<?php

namespace App\Http\Controllers;

use App\Http\Requests\PenilaianRequest;
use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\Penilaian;
use App\Models\SubKriteria;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PenilaianController extends Controller
{
    public function index(): Response
    {
        // Existing scores as a lookup: [alternatif_id][kriteria_id] = sub_kriteria_id
        $existing = [];
        foreach (Penilaian::query()->get(['alternatif_id', 'kriteria_id', 'sub_kriteria_id']) as $row) {
            $existing[$row->alternatif_id][$row->kriteria_id] = $row->sub_kriteria_id;
        }

        return Inertia::render('penilaian/index', [
            'alternatif' => Alternatif::query()->orderBy('id')->get(['id', 'nama']),
            'kriteria' => Kriteria::query()->orderBy('prioritas')->get(['id', 'kode', 'keterangan']),
            'subKriteria' => SubKriteria::query()
                ->orderBy('kriteria_id')
                ->orderByDesc('nilai')
                ->get(['id', 'kriteria_id', 'deskripsi', 'nilai']),
            'penilaian' => $existing,
        ]);
    }

    public function store(PenilaianRequest $request): RedirectResponse
    {
        $alternatifId = $request->integer('alternatif_id');

        /** @var array<int, int> $nilai  Map of kriteria_id => sub_kriteria_id */
        $nilai = $request->validated('nilai');

        DB::transaction(function () use ($alternatifId, $nilai): void {
            foreach ($nilai as $kriteriaId => $subKriteriaId) {
                Penilaian::updateOrCreate(
                    ['alternatif_id' => $alternatifId, 'kriteria_id' => $kriteriaId],
                    ['sub_kriteria_id' => $subKriteriaId],
                );
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Penilaian berhasil disimpan.']);

        return to_route('penilaian.index');
    }
}
