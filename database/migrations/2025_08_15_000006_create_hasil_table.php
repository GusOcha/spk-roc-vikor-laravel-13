<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Stores the most recent VIKOR computation so the result and report
     * pages can be displayed without recalculating every visit.
     */
    public function up(): void
    {
        Schema::create('hasil', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alternatif_id')->constrained('alternatif')->cascadeOnDelete();
            $table->decimal('nilai_s', 12, 6); // Utility measure (S)
            $table->decimal('nilai_r', 12, 6); // Regret measure (R)
            $table->decimal('nilai_q', 12, 6); // VIKOR index (Q)
            $table->unsignedInteger('ranking');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil');
    }
};
