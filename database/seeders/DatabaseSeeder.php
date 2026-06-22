<?php

namespace Database\Seeders;

use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\Penilaian;
use App\Models\SubKriteria;
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
     * Reproduces the original CodeIgniter sample case (e-commerce platform
     * selection) so the migrated app starts with the same demo data.
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
        // [old_id => [kode, keterangan, jenis, prioritas, bobot]]
        $kriteriaRows = [
            34 => ['K1', 'User Interface', 'benefit', 3, 0.157],
            35 => ['K2', 'Kelengkapan Produk', 'benefit', 1, 0.457],
            36 => ['K3', 'Respon Pelayanan', 'benefit', 2, 0.257],
            37 => ['K4', 'Proses Transaksi', 'cost', 4, 0.09],
            38 => ['K5', 'Jasa Pengiriman', 'benefit', 5, 0.04],
        ];

        $kriteriaMap = [];
        foreach ($kriteriaRows as $oldId => [$kode, $keterangan, $jenis, $prioritas, $bobot]) {
            $kriteriaMap[$oldId] = Kriteria::create([
                'kode' => $kode,
                'keterangan' => $keterangan,
                'jenis' => $jenis,
                'prioritas' => $prioritas,
                'bobot' => $bobot,
            ])->id;
        }

        // [old_id => [old_kriteria_id, deskripsi, nilai]]
        $subKriteriaRows = [
            224 => [34, '41', 41], 225 => [34, '42', 42], 226 => [34, '43', 43], 227 => [34, '46', 46],
            228 => [35, '41', 41], 229 => [35, '44', 44], 230 => [35, '45', 45], 231 => [35, '47', 47], 232 => [35, '48', 48],
            233 => [36, '38', 38], 234 => [36, '40', 40], 235 => [36, '43', 43],
            236 => [37, '40', 40], 237 => [37, '41', 41], 238 => [37, '43', 43], 239 => [37, '44', 44],
            240 => [38, '36', 36], 241 => [38, '41', 41], 242 => [38, '42', 42], 243 => [38, '45', 45],
        ];

        $subKriteriaMap = [];
        foreach ($subKriteriaRows as $oldId => [$oldKriteriaId, $deskripsi, $nilai]) {
            $subKriteriaMap[$oldId] = SubKriteria::create([
                'kriteria_id' => $kriteriaMap[$oldKriteriaId],
                'deskripsi' => $deskripsi,
                'nilai' => $nilai,
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

        // [old_alternatif_id, old_kriteria_id, old_sub_kriteria_id]
        $penilaianRows = [
            [59, 34, 226], [59, 35, 228], [59, 36, 234], [59, 37, 239], [59, 38, 241],
            [60, 34, 225], [60, 35, 229], [60, 36, 235], [60, 37, 237], [60, 38, 240],
            [61, 34, 224], [61, 35, 230], [61, 36, 234], [61, 37, 238], [61, 38, 242],
            [62, 34, 227], [62, 35, 232], [62, 36, 235], [62, 37, 236], [62, 38, 243],
            [63, 34, 224], [63, 35, 231], [63, 36, 233], [63, 37, 237], [63, 38, 242],
        ];

        foreach ($penilaianRows as [$oldAlt, $oldKrit, $oldSub]) {
            Penilaian::create([
                'alternatif_id' => $alternatifMap[$oldAlt],
                'kriteria_id' => $kriteriaMap[$oldKrit],
                'sub_kriteria_id' => $subKriteriaMap[$oldSub],
            ]);
        }
    }
}
