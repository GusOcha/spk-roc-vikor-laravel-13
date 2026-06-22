<?php

namespace App\Http\Controllers;

use App\Http\Requests\AlternatifRequest;
use App\Models\Alternatif;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AlternatifController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('alternatif/index', [
            'alternatif' => Alternatif::query()->orderBy('id')->get(['id', 'nama']),
        ]);
    }

    public function store(AlternatifRequest $request): RedirectResponse
    {
        Alternatif::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Alternatif berhasil ditambahkan.']);

        return to_route('alternatif.index');
    }

    public function update(AlternatifRequest $request, Alternatif $alternatif): RedirectResponse
    {
        $alternatif->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Alternatif berhasil diperbarui.']);

        return to_route('alternatif.index');
    }

    public function destroy(Alternatif $alternatif): RedirectResponse
    {
        $alternatif->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Alternatif berhasil dihapus.']);

        return to_route('alternatif.index');
    }
}
