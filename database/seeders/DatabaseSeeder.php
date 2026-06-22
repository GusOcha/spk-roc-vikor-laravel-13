<?php

namespace Database\Seeders;

use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\Penilaian;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Reproduces the original sample case (e-commerce platform selection) so
     * the migrated app starts with demo data.
     */
    public function run(): void
    {
        $this->seedUsers();
        $this->seedDecisionData();
    }

    private function seedUsers(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'User',
                'password' => Hash::make('user'),
                'is_admin' => false,
                'email_verified_at' => now(),
            ],
        );
    }

    private function seedDecisionData(): void
    {
        // [old_id => [kode, keterangan, jenis, satuan, prioritas, bobot]]
        $kriteriaRows = [
            34 => ['K1', 'User Interface', 'benefit', 'poin', 3, 0.157],
            35 => ['K2', 'Kelengkapan Produk', 'benefit', 'poin', 1, 0.457],
            36 => ['K3', 'Respon Pelayanan', 'benefit', 'poin', 2, 0.257],
            37 => ['K4', 'Proses Transaksi', 'cost', 'menit', 4, 0.09],
            38 => ['K5', 'Jasa Pengiriman', 'benefit', 'poin', 5, 0.04],
        ];

        $kriteriaMap = [];
        foreach ($kriteriaRows as $oldId => [$kode, $keterangan, $jenis, $satuan, $prioritas, $bobot]) {
            $kriteriaMap[$oldId] = Kriteria::create([
                'kode' => $kode,
                'keterangan' => $keterangan,
                'jenis' => $jenis,
                'satuan' => $satuan,
                'prioritas' => $prioritas,
                'bobot' => $bobot,
            ])->id;
        }

        // [old_id => nama]
        $alternatifRows = [
            59 => 'Shopee',
            60 => 'Lazada',
            61 => 'Bukalapak',
            62 => 'Facebook Marketplace',
            63 => 'Tokopedia',
        ];

        $alternatifMap = [];
        foreach ($alternatifRows as $oldId => $nama) {
            $alternatifMap[$oldId] = Alternatif::create(['nama' => $nama])->id;
        }

        // [old_alternatif_id, old_kriteria_id, nilai]
        $penilaianRows = [
            [59, 34, 43], [59, 35, 41], [59, 36, 40], [59, 37, 44], [59, 38, 41],
            [60, 34, 42], [60, 35, 44], [60, 36, 43], [60, 37, 41], [60, 38, 36],
            [61, 34, 41], [61, 35, 45], [61, 36, 40], [61, 37, 43], [61, 38, 42],
            [62, 34, 46], [62, 35, 48], [62, 36, 43], [62, 37, 40], [62, 38, 45],
            [63, 34, 41], [63, 35, 47], [63, 36, 38], [63, 37, 41], [63, 38, 42],
        ];

        foreach ($penilaianRows as [$oldAlt, $oldKrit, $nilai]) {
            Penilaian::create([
                'alternatif_id' => $alternatifMap[$oldAlt],
                'kriteria_id' => $kriteriaMap[$oldKrit],
                'nilai' => $nilai,
            ]);
        }
    }
}
