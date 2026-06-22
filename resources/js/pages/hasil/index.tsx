import { Head, Link } from '@inertiajs/react';
import { Medal, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type HasilRow = {
    ranking: number;
    nama: string;
    nilai_s: number;
    nilai_r: number;
    nilai_q: number;
};

const fmt = (n: number) => Number(n).toFixed(4);
const medalColor = ['text-amber-500', 'text-zinc-400', 'text-amber-700'];

export default function HasilIndex({ hasil }: { hasil: HasilRow[] }) {
    return (
        <>
            <Head title="Hasil" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Hasil Perankingan
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Urutan alternatif berdasarkan nilai VIKOR (Qi).
                        </p>
                    </div>
                    {hasil.length > 0 && (
                        <Button variant="outline" asChild>
                            <Link href="/laporan">
                                <Printer className="size-4" /> Cetak Laporan
                            </Link>
                        </Button>
                    )}
                </div>

                {hasil.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Belum ada hasil. Jalankan perhitungan terlebih
                            dahulu.
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Tabel Perankingan</CardTitle>
                            <CardDescription>
                                Nilai Qi terkecil menempati peringkat pertama.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-20 text-center">
                                                Rank
                                            </TableHead>
                                            <TableHead>Alternatif</TableHead>
                                            <TableHead className="text-right">
                                                S
                                            </TableHead>
                                            <TableHead className="text-right">
                                                R
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Q
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {hasil.map((row) => (
                                            <TableRow key={row.ranking}>
                                                <TableCell className="text-center">
                                                    <span className="inline-flex items-center justify-center gap-1 font-semibold">
                                                        {row.ranking <= 3 && (
                                                            <Medal
                                                                className={`size-4 ${medalColor[row.ranking - 1]}`}
                                                            />
                                                        )}
                                                        {row.ranking}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {row.nama}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {fmt(row.nilai_s)}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {fmt(row.nilai_r)}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold tabular-nums">
                                                    {fmt(row.nilai_q)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

HasilIndex.layout = {
    breadcrumbs: [{ title: 'Hasil', href: '/hasil' }],
};
