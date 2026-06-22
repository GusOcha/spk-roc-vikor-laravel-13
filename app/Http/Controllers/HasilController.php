<?php

namespace App\Http\Controllers;

use App\Models\Hasil;
use Inertia\Inertia;
use Inertia\Response;

class HasilController extends Controller
{
    /**
     * Show the final ranking from the most recent calculation.
     */
    public function index(): Response
    {
        return Inertia::render('hasil/index', [
            'hasil' => Hasil::query()
                ->with('alternatif:id,nama')
                ->orderBy('ranking')
                ->get()
                ->map(fn (Hasil $h): array => [
                    'ranking' => $h->ranking,
                    'nama' => $h->alternatif?->nama,
                    'nilai_s' => $h->nilai_s,
                    'nilai_r' => $h->nilai_r,
                    'nilai_q' => $h->nilai_q,
                ]),
        ]);
    }
}
