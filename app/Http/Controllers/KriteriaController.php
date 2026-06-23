<?php

namespace App\Http\Controllers;

use App\Http\Requests\KriteriaRequest;
use App\Models\Kriteria;
use App\Services\PerhitunganService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
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
        $data = $request->validated();

        DB::transaction(function () use ($data): void {
            // Priorities form a contiguous 1..n ranking; ROC forbids ties.
            $count = Kriteria::query()->count();
            $position = min(max((int) $data['prioritas'], 1), $count + 1);

            // Make room by pushing everything at/after the target position down.
            Kriteria::query()
                ->where('prioritas', '>=', $position)
                ->increment('prioritas');

            $data['prioritas'] = $position;
            Kriteria::create($data);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kriteria berhasil ditambahkan.']);

        return to_route('kriteria.index');
    }

    public function update(KriteriaRequest $request, Kriteria $kriteria): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data, $kriteria): void {
            $count = Kriteria::query()->count();
            $old = (int) $kriteria->prioritas;
            $new = min(max((int) $data['prioritas'], 1), $count);

            // Shift the criteria between the old and new positions to keep the
            // 1..n ranking contiguous and free of duplicate priorities.
            if ($new < $old) {
                Kriteria::query()
                    ->whereBetween('prioritas', [$new, $old - 1])
                    ->increment('prioritas');
            } elseif ($new > $old) {
                Kriteria::query()
                    ->whereBetween('prioritas', [$old + 1, $new])
                    ->decrement('prioritas');
            }

            $data['prioritas'] = $new;
            $kriteria->update($data);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kriteria berhasil diperbarui.']);

        return to_route('kriteria.index');
    }

    public function destroy(Kriteria $kriteria): RedirectResponse
    {
        DB::transaction(function () use ($kriteria): void {
            $removed = (int) $kriteria->prioritas;
            $kriteria->delete();

            // Close the gap left behind so priorities stay contiguous.
            Kriteria::query()
                ->where('prioritas', '>', $removed)
                ->decrement('prioritas');
        });

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
