<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $nama
 */
class Alternatif extends Model
{
    protected $table = 'alternatif';

    protected $fillable = [
        'nama',
    ];

    /**
     * @return HasMany<Penilaian, $this>
     */
    public function penilaian(): HasMany
    {
        return $this->hasMany(Penilaian::class);
    }

    /**
     * @return HasOne<Hasil, $this>
     */
    public function hasil(): HasOne
    {
        return $this->hasOne(Hasil::class);
    }
}
