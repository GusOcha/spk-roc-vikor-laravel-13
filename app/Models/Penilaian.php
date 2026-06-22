<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $alternatif_id
 * @property int $kriteria_id
 * @property float $nilai
 */
class Penilaian extends Model
{
    protected $table = 'penilaian';

    protected $fillable = [
        'alternatif_id',
        'kriteria_id',
        'nilai',
    ];

    protected function casts(): array
    {
        return [
            'alternatif_id' => 'integer',
            'kriteria_id' => 'integer',
            'nilai' => 'float',
        ];
    }

    /**
     * @return BelongsTo<Alternatif, $this>
     */
    public function alternatif(): BelongsTo
    {
        return $this->belongsTo(Alternatif::class);
    }

    /**
     * @return BelongsTo<Kriteria, $this>
     */
    public function kriteria(): BelongsTo
    {
        return $this->belongsTo(Kriteria::class);
    }
}
