<?php

namespace App\Http\Controllers;

use App\Models\Alternatif;
use App\Models\Hasil;
use App\Models\Kriteria;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $best = Hasil::query()
            ->with('alternatif:id,nama')
            ->orderBy('ranking')
            ->first();

        return Inertia::render('dashboard', [
            'stats' => [
                'kriteria' => Kriteria::query()->count(),
                'alternatif' => Alternatif::query()->count(),
                'sudahDihitung' => Hasil::query()->exists(),
            ],
            'terbaik' => $best ? [
                'nama' => $best->alternatif?->nama,
                'nilai_q' => $best->nilai_q,
            ] : null,
        ]);
    }
}
