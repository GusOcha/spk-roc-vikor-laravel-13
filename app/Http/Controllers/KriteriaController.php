<?php

namespace App\Http\Controllers;

use App\Http\Requests\KriteriaRequest;
use App\Models\Kriteria;
use App\Services\PerhitunganService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class KriteriaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('kriteria/index', [
            'kriteria' => Kriteria::query()
                ->orderBy('prioritas')
                ->get(['id', 'kode', 'keterangan', 'jenis', 'satuan', 'prioritas', 'bobot']),
        ]);
    }

    public function store(KriteriaRequest $request): RedirectResponse
    {
        Kriteria::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kriteria berhasil ditambahkan.']);

        return to_route('kriteria.index');
    }

    public function update(KriteriaRequest $request, Kriteria $kriteria): RedirectResponse
    {
        $kriteria->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kriteria berhasil diperbarui.']);

        return to_route('kriteria.index');
    }

    public function destroy(Kriteria $kriteria): RedirectResponse
    {
        $kriteria->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kriteria berhasil dihapus.']);

        return to_route('kriteria.index');
    }

    /**
     * Generate ROC weights from the current criteria priorities.
     */
    public function generate(PerhitunganService $service): RedirectResponse
    {
        $service->generateBobot();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Bobot kriteria berhasil digenerate dengan metode ROC.']);

        return to_route('kriteria.index');
    }
}
