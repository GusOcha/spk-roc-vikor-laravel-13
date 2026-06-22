<?php

namespace App\Services;

use App\Models\Alternatif;
use App\Models\Hasil;
use App\Models\Kriteria;
use App\Models\Penilaian;
use Illuminate\Support\Facades\DB;

/**
 * Orchestrates the full ROC-VIKOR decision process against the database:
 * builds the decision matrix from stored assessments, generates criteria
 * weights, ranks the alternatives, and persists the result.
 */
class PerhitunganService
{
    public function __construct(
        private readonly RocService $roc,
        private readonly VikorService $vikor,
    ) {}

    /**
     * Compute ROC weights from criteria priorities and store them on each
     * criterion's `bobot` column.
     *
     * @return array<int, float> Map of kriteria id => weight.
     */
    public function generateBobot(): array
    {
        $kriteria = Kriteria::query()->get();

        $priorities = $kriteria->pluck('prioritas', 'id')->all();
        $weights = $this->roc->computeWeights($priorities);

        DB::transaction(function () use ($kriteria, $weights): void {
            foreach ($kriteria as $criterion) {
                $criterion->bobot = round($weights[$criterion->id], 6);
                $criterion->save();
            }
        });

        return $weights;
    }

    /**
     * Run the VIKOR calculation against the current data and persist the
     * ranking to the `hasil` table.
     *
     * @return array<string, mixed> Display-ready computation with labels.
     */
    public function hitung(): array
    {
        $kriteria = Kriteria::query()->orderBy('prioritas')->get();
        $alternatif = Alternatif::query()->orderBy('id')->get();

        $matrix = $this->buildMatrix();

        // Shape inputs for the pure VIKOR service.
        $criteriaInput = [];
        foreach ($kriteria as $criterion) {
            $criteriaInput[$criterion->id] = [
                'weight' => (float) ($criterion->bobot ?? 0),
                'type' => $criterion->jenis,
            ];
        }

        $scores = [];
        foreach ($alternatif as $alt) {
            foreach ($kriteria as $criterion) {
                $scores[$alt->id][$criterion->id] = $matrix[$alt->id][$criterion->id] ?? 0.0;
            }
        }

        $result = $this->vikor->calculate($criteriaInput, $scores);

        $this->persistRanking($result['ranking']);

        // Attach human-readable labels for the UI.
        $result['kriteria'] = $kriteria->map(fn (Kriteria $k): array => [
            'id' => $k->id,
            'kode' => $k->kode,
            'keterangan' => $k->keterangan,
            'jenis' => $k->jenis,
            'bobot' => (float) ($k->bobot ?? 0),
        ])->values()->all();

        $result['alternatif'] = $alternatif->map(fn (Alternatif $a): array => [
            'id' => $a->id,
            'nama' => $a->nama,
        ])->values()->all();

        $result['matrix'] = $scores;

        // Re-key ranking with alternative names for convenience.
        $namaById = $alternatif->pluck('nama', 'id');
        $result['ranking'] = array_map(static function (array $entry) use ($namaById): array {
            $entry['nama'] = $namaById[$entry['key']] ?? (string) $entry['key'];

            return $entry;
        }, $result['ranking']);

        return $result;
    }

    /**
     * Build the decision matrix: matrix[alternatif_id][kriteria_id] = the
     * numeric value entered for that pair.
     *
     * @return array<int, array<int, float>>
     */
    public function buildMatrix(): array
    {
        $penilaian = Penilaian::query()->get();

        $matrix = [];
        foreach ($penilaian as $row) {
            $matrix[$row->alternatif_id][$row->kriteria_id] = (float) $row->nilai;
        }

        return $matrix;
    }

    /**
     * Replace the stored result with the latest ranking.
     *
     * @param  array<int, array{key: int|string, s: float, r: float, q: float, rank: int}>  $ranking
     */
    private function persistRanking(array $ranking): void
    {
        DB::transaction(function () use ($ranking): void {
            Hasil::query()->delete();

            foreach ($ranking as $entry) {
                Hasil::create([
                    'alternatif_id' => $entry['key'],
                    'nilai_s' => round($entry['s'], 6),
                    'nilai_r' => round($entry['r'], 6),
                    'nilai_q' => round($entry['q'], 6),
                    'ranking' => $entry['rank'],
                ]);
            }
        });
    }
}
