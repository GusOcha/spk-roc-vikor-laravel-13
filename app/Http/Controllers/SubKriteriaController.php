<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubKriteriaRequest;
use App\Models\Kriteria;
use App\Models\SubKriteria;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SubKriteriaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('sub-kriteria/index', [
            'subKriteria' => SubKriteria::query()
                ->with('kriteria:id,kode,keterangan')
                ->orderBy('kriteria_id')
                ->orderByDesc('nilai')
                ->get(['id', 'kriteria_id', 'deskripsi', 'nilai']),
            'kriteria' => Kriteria::query()
                ->orderBy('prioritas')
                ->get(['id', 'kode', 'keterangan']),
        ]);
    }

    public function store(SubKriteriaRequest $request): RedirectResponse
    {
        SubKriteria::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Sub kriteria berhasil ditambahkan.']);

        return to_route('sub-kriteria.index');
    }

    public function update(SubKriteriaRequest $request, SubKriteria $subKriteria): RedirectResponse
    {
        $subKriteria->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Sub kriteria berhasil diperbarui.']);

        return to_route('sub-kriteria.index');
    }

    public function destroy(SubKriteria $subKriteria): RedirectResponse
    {
        $subKriteria->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Sub kriteria berhasil dihapus.']);

        return to_route('sub-kriteria.index');
    }
}
