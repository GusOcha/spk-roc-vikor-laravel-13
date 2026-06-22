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
            'kriteria' => Kriteria::query()->orderBy('prioritas')->get(['id', 'kode', 'keterangan', 'satuan']),
            'penilaian' => $existing,
        ]);
    }

    public function store(PenilaianRequest $request): RedirectResponse
    {
        $alternatifId = $request->integer('alternatif_id');

        /** @var array<int, float|int|string> $nilai  Map of kriteria_id => nilai */
        $nilai = $request->validated('nilai');

        DB::transaction(function () use ($alternatifId, $nilai): void {
            foreach ($nilai as $kriteriaId => $value) {
                Penilaian::updateOrCreate(
                    ['alternatif_id' => $alternatifId, 'kriteria_id' => $kriteriaId],
                    ['nilai' => $value],
                );
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Penilaian berhasil disimpan.']);

        return to_route('penilaian.index');
    }
}
