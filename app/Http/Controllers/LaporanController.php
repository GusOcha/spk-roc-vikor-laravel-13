<?php

namespace App\Http\Controllers;

use App\Models\Hasil;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    /**
     * Printable report of the final ranking.
     */
    public function index(): Response
    {
        return Inertia::render('laporan/index', [
            'generatedAt' => now()->translatedFormat('d F Y H:i'),
            'hasil' => Hasil::query()
                ->with('alternatif:id,nama')
                ->orderBy('ranking')
                ->get()
                ->map(fn (Hasil $h): array => [
                    'ranking' => $h->ranking,
                    'nama' => $h->alternatif?->nama,
                    'nilai_q' => $h->nilai_q,
                ]),
        ]);
    }
}
