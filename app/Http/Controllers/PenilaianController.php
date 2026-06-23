<?php

namespace App\Http\Controllers;

use App\Http\Requests\PenilaianRequest;
use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\Penilaian;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PenilaianController extends Controller
{
    public function index(): Response
    {
        // Existing scores as a lookup: [alternatif_id][kriteria_id] = nilai
        $existing = [];
        foreach (Penilaian::query()->get(['alternatif_id', 'kriteria_id', 'nilai']) as $row) {
            $existing[$row->alternatif_id][$row->kriteria_id] = $row->nilai;
        }

        return Inertia::render('penilaian/index', [
            'alternatif' => Alternatif::query()->orderBy('id')->get(['id', 'nama']),
            'kriteria' => Kriteria::query()
                ->get(['id', 'kode', 'keterangan', 'satuan'])
                ->sortBy('kode', SORT_NATURAL | SORT_FLAG_CASE)
                ->values(),
            'penilaian' => $existing,
        ]);
    }

    public function store(PenilaianRequest $request): RedirectResponse
    {
        /** @var array<int, array<int, float|int|string|null>> $matrix  penilaian[alternatif_id][kriteria_id] = nilai */
        $matrix = $request->validated('penilaian');

        DB::transaction(function () use ($matrix): void {
            foreach ($matrix as $alternatifId => $row) {
                foreach ($row as $kriteriaId => $value) {
                    if ($value === null || $value === '') {
                        continue;
                    }

                    Penilaian::updateOrCreate(
                        ['alternatif_id' => $alternatifId, 'kriteria_id' => $kriteriaId],
                        ['nilai' => $value],
                    );
                }
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Penilaian berhasil disimpan.']);

        return to_route('penilaian.index');
    }

    public function clear(): RedirectResponse
    {
        Penilaian::query()->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Semua penilaian berhasil dihapus.']);

        return to_route('penilaian.index');
    }
}
