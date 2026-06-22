import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type HasilRow = { ranking: number; nama: string; nilai_q: number };

export default function LaporanIndex({
    hasil,
    generatedAt,
}: {
    hasil: HasilRow[];
    generatedAt: string;
}) {
    return (
        <>
            <Head title="Laporan" />
            <div className="flex flex-col gap-4 p-4">
                <div className="no-print flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Laporan Hasil
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Pratinjau laporan siap cetak.
                        </p>
                    </div>
                    <Button onClick={() => window.print()}>
                        <Printer className="size-4" /> Cetak
                    </Button>
                </div>

                <div className="print-area rounded-xl border bg-card p-8 text-card-foreground">
                    <div className="mb-6 border-b pb-4 text-center">
                        <h2 className="text-lg font-bold uppercase">
                            Laporan Hasil Perankingan
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Sistem Pendukung Keputusan — Metode ROC &amp; VIKOR
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Dicetak pada {generatedAt}
                        </p>
                    </div>

                    {hasil.length === 0 ? (
                        <p className="py-8 text-center text-muted-foreground">
                            Belum ada hasil perhitungan.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-20 text-center">
                                        Ranking
                                    </TableHead>
                                    <TableHead>Alternatif</TableHead>
                                    <TableHead className="text-right">
                                        Nilai Qi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hasil.map((row) => (
                                    <TableRow key={row.ranking}>
                                        <TableCell className="text-center font-semibold">
                                            {row.ranking}
                                        </TableCell>
                                        <TableCell>{row.nama}</TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {Number(row.nilai_q).toFixed(4)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {hasil.length > 0 && (
                        <p className="mt-6 text-sm">
                            Berdasarkan perhitungan, alternatif{' '}
                            <strong>{hasil[0].nama}</strong> menempati peringkat
                            pertama dan direkomendasikan sebagai pilihan terbaik.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

LaporanIndex.layout = {
    breadcrumbs: [{ title: 'Laporan', href: '/laporan' }],
};
