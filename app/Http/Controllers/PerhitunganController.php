<?php

namespace App\Http\Controllers;

use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Services\PerhitunganService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PerhitunganController extends Controller
{
    public function __construct(private readonly PerhitunganService $service) {}

    /**
     * Run the full ROC-VIKOR calculation, persist the ranking, and display
     * every intermediate step.
     */
    public function index(): Response|RedirectResponse
    {
        if (Kriteria::query()->count() === 0 || Alternatif::query()->count() === 0) {
            Inertia::flash('toast', ['type' => 'warning', 'message' => 'Lengkapi data kriteria dan alternatif terlebih dahulu.']);

            return to_route('dashboard');
        }

        if (Kriteria::query()->whereNull('bobot')->exists()) {
            Inertia::flash('toast', ['type' => 'warning', 'message' => 'Generate bobot kriteria (ROC) terlebih dahulu.']);

            return to_route('kriteria.index');
        }

        return Inertia::render('perhitungan/index', [
            'result' => $this->service->hitung(),
        ]);
    }
}
