<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $kode
 * @property string $keterangan
 * @property string $jenis
 * @property int $prioritas
 * @property float|null $bobot
 */
class Kriteria extends Model
{
    protected $table = 'kriteria';

    protected $fillable = [
        'kode',
        'keterangan',
        'jenis',
        'prioritas',
        'bobot',
    ];

    protected function casts(): array
    {
        return [
            'prioritas' => 'integer',
            'bobot' => 'float',
        ];
    }

    /**
     * @return HasMany<SubKriteria, $this>
     */
    public function subKriteria(): HasMany
    {
        return $this->hasMany(SubKriteria::class);
    }

    /**
     * @return HasMany<Penilaian, $this>
     */
    public function penilaian(): HasMany
    {
        return $this->hasMany(Penilaian::class);
    }
}
