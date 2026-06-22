<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $alternatif_id
 * @property float $nilai_s
 * @property float $nilai_r
 * @property float $nilai_q
 * @property int $ranking
 */
class Hasil extends Model
{
    protected $table = 'hasil';

    protected $fillable = [
        'alternatif_id',
        'nilai_s',
        'nilai_r',
        'nilai_q',
        'ranking',
    ];

    protected function casts(): array
    {
        return [
            'alternatif_id' => 'integer',
            'nilai_s' => 'float',
            'nilai_r' => 'float',
            'nilai_q' => 'float',
            'ranking' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Alternatif, $this>
     */
    public function alternatif(): BelongsTo
    {
        return $this->belongsTo(Alternatif::class);
    }
}
