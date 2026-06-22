<?php

use App\Http\Controllers\AlternatifController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HasilController;
use App\Http\Controllers\KriteriaController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PenilaianController;
use App\Http\Controllers\PerhitunganController;
use App\Http\Controllers\SubKriteriaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Viewable by any authenticated user.
    Route::get('hasil', [HasilController::class, 'index'])->name('hasil.index');
    Route::get('laporan', [LaporanController::class, 'index'])->name('laporan.index');

    // Management & calculation — administrators only.
    Route::middleware('admin')->group(function () {
        Route::get('kriteria', [KriteriaController::class, 'index'])->name('kriteria.index');
        Route::post('kriteria', [KriteriaController::class, 'store'])->name('kriteria.store');
        Route::post('kriteria/generate', [KriteriaController::class, 'generate'])->name('kriteria.generate');
        Route::put('kriteria/{kriteria}', [KriteriaController::class, 'update'])->name('kriteria.update');
        Route::delete('kriteria/{kriteria}', [KriteriaController::class, 'destroy'])->name('kriteria.destroy');

        Route::get('sub-kriteria', [SubKriteriaController::class, 'index'])->name('sub-kriteria.index');
        Route::post('sub-kriteria', [SubKriteriaController::class, 'store'])->name('sub-kriteria.store');
        Route::put('sub-kriteria/{subKriteria}', [SubKriteriaController::class, 'update'])->name('sub-kriteria.update');
        Route::delete('sub-kriteria/{subKriteria}', [SubKriteriaController::class, 'destroy'])->name('sub-kriteria.destroy');

        Route::get('alternatif', [AlternatifController::class, 'index'])->name('alternatif.index');
        Route::post('alternatif', [AlternatifController::class, 'store'])->name('alternatif.store');
        Route::put('alternatif/{alternatif}', [AlternatifController::class, 'update'])->name('alternatif.update');
        Route::delete('alternatif/{alternatif}', [AlternatifController::class, 'destroy'])->name('alternatif.destroy');

        Route::get('penilaian', [PenilaianController::class, 'index'])->name('penilaian.index');
        Route::post('penilaian', [PenilaianController::class, 'store'])->name('penilaian.store');

        Route::get('perhitungan', [PerhitunganController::class, 'index'])->name('perhitungan.index');

        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

require __DIR__.'/settings.php';
