<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $alternatif_id
 * @property int $kriteria_id
 * @property int $sub_kriteria_id
 */
class Penilaian extends Model
{
    protected $table = 'penilaian';

    protected $fillable = [
        'alternatif_id',
        'kriteria_id',
        'sub_kriteria_id',
    ];

    protected function casts(): array
    {
        return [
            'alternatif_id' => 'integer',
            'kriteria_id' => 'integer',
            'sub_kriteria_id' => 'integer',
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

    /**
     * @return BelongsTo<SubKriteria, $this>
     */
    public function subKriteria(): BelongsTo
    {
        return $this->belongsTo(SubKriteria::class);
    }
}
