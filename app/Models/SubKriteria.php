<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $kriteria_id
 * @property string $deskripsi
 * @property float $nilai
 */
class SubKriteria extends Model
{
    protected $table = 'sub_kriteria';

    protected $fillable = [
        'kriteria_id',
        'deskripsi',
        'nilai',
    ];

    protected function casts(): array
    {
        return [
            'kriteria_id' => 'integer',
            'nilai' => 'float',
        ];
    }

    /**
     * @return BelongsTo<Kriteria, $this>
     */
    public function kriteria(): BelongsTo
    {
        return $this->belongsTo(Kriteria::class);
    }
}
