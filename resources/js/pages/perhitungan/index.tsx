import { Head, Link } from '@inertiajs/react';
import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

type Kriteria = {
    id: number;
    kode: string;
    keterangan: string;
    jenis: string;
    bobot: number;
};
type Alternatif = { id: number; nama: string };
type Matrix = Record<number, Record<number, number>>;
type RankRow = { key: number; nama: string; s: number; r: number; q: number; rank: number };

type Result = {
    v: number;
    kriteria: Kriteria[];
    alternatif: Alternatif[];
    matrix: Matrix;
    normalized: Matrix;
    weighted: Matrix;
    s: Record<number, number>;
    r: Record<number, number>;
    q: Record<number, number>;
    s_star: number;
    s_minus: number;
    r_star: number;
    r_minus: number;
    ranking: RankRow[];
};

const fmt = (n: number, d = 4) => Number(n).toFixed(d);

function MatrixTable({
    title,
    description,
    kriteria,
    alternatif,
    data,
    digits = 4,
}: {
    title: string;
    description?: string;
    kriteria: Kriteria[];
    alternatif: Alternatif[];
    data: Matrix;
    digits?: number;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Alternatif</TableHead>
                                {kriteria.map((k) => (
                                    <TableHead
                                        key={k.id}
                                        className="text-right"
                                    >
                                        {k.kode}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alternatif.map((a) => (
                                <TableRow key={a.id}>
                                    <TableCell className="font-medium">
                                        {a.nama}
                                    </TableCell>
                                    {kriteria.map((k) => (
                                        <TableCell
                                            key={k.id}
                                            className="text-right tabular-nums"
                                        >
                                            {fmt(data[a.id]?.[k.id] ?? 0, digits)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

export default function PerhitunganIndex({ result }: { result: Result }) {
    const { kriteria, alternatif } = result;
    const best = result.ranking[0];

    return (
        <>
            <Head title="Perhitungan" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Perhitungan ROC-VIKOR
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Rincian setiap langkah perhitungan (v ={' '}
                            {result.v}).
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/hasil">Lihat Hasil</Link>
                    </Button>
                </div>

                {best && (
                    <Card className="border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20">
                        <CardContent className="flex items-center gap-3 py-4">
                            <Trophy className="size-5 text-amber-500" />
                            <span>
                                Alternatif terbaik:{' '}
                                <strong>{best.nama}</strong> dengan Qi ={' '}
                                {fmt(best.q)} (Qi terkecil).
                            </span>
                        </CardContent>
                    </Card>
                )}

                {/* Bobot kriteria (ROC) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bobot Kriteria (ROC)</CardTitle>
                        <CardDescription>
                            Bobot didapat dari metode Rank Order Centroid.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Kriteria</TableHead>
                                        <TableHead>Jenis</TableHead>
                                        <TableHead className="text-right">
                                            Bobot
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kriteria.map((k) => (
                                        <TableRow key={k.id}>
                                            <TableCell className="font-medium">
                                                {k.kode}
                                            </TableCell>
                                            <TableCell>
                                                {k.keterangan}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        k.jenis === 'benefit'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {k.jenis}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {fmt(k.bobot, 3)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <MatrixTable
                    title="Matriks Keputusan (X)"
                    description="Nilai mentah setiap alternatif pada tiap kriteria."
                    kriteria={kriteria}
                    alternatif={alternatif}
                    data={result.matrix}
                    digits={0}
                />

                <MatrixTable
                    title="Matriks Normalisasi"
                    description="Jarak terhadap solusi ideal (benefit/cost diperhitungkan)."
                    kriteria={kriteria}
                    alternatif={alternatif}
                    data={result.normalized}
                />

                <MatrixTable
                    title="Normalisasi Terbobot"
                    description="Hasil normalisasi dikalikan bobot kriteria."
                    kriteria={kriteria}
                    alternatif={alternatif}
                    data={result.weighted}
                />

                {/* S, R, Q + ranking */}
                <Card>
                    <CardHeader>
                        <CardTitle>Nilai S, R, dan Q (Perankingan)</CardTitle>
                        <CardDescription>
                            S* = {fmt(result.s_star)}, S⁻ ={' '}
                            {fmt(result.s_minus)}, R* = {fmt(result.r_star)}, R⁻
                            = {fmt(result.r_minus)}. Ranking 1 = Qi terkecil.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16 text-center">
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
                                    {result.ranking.map((row) => (
                                        <TableRow key={row.key}>
                                            <TableCell className="text-center font-semibold">
                                                {row.rank}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {row.nama}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {fmt(row.s)}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {fmt(row.r)}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {fmt(row.q)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PerhitunganIndex.layout = {
    breadcrumbs: [{ title: 'Perhitungan', href: '/perhitungan' }],
};
