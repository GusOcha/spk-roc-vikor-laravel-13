import { Head, router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Alternatif = { id: number; nama: string };
type Kriteria = {
    id: number;
    kode: string;
    keterangan: string;
    satuan: string | null;
};

type Props = {
    alternatif: Alternatif[];
    kriteria: Kriteria[];
    /** [alternatif_id][kriteria_id] = nilai */
    penilaian: Record<number, Record<number, number>>;
};

export default function PenilaianIndex({
    alternatif,
    kriteria,
    penilaian,
}: Props) {
    // Working copy of the matrix: matrix[altId][kritId] = nilai (as string).
    const [matrix, setMatrix] = useState<Record<number, Record<number, string>>>(
        () => {
            const initial: Record<number, Record<number, string>> = {};
            for (const a of alternatif) {
                initial[a.id] = {};
                for (const k of kriteria) {
                    const val = penilaian[a.id]?.[k.id];
                    initial[a.id][k.id] =
                        val === undefined || val === null ? '' : String(val);
                }
            }
            return initial;
        },
    );

    const [savingId, setSavingId] = useState<number | null>(null);

    function setCell(altId: number, kritId: number, value: string) {
        setMatrix((prev) => ({
            ...prev,
            [altId]: { ...prev[altId], [kritId]: value },
        }));
    }

    function saveRow(altId: number) {
        const row = matrix[altId];
        const nilai: Record<number, number> = {};
        for (const k of kriteria) {
            if (row[k.id] !== '') nilai[k.id] = Number(row[k.id]);
        }
        router.post(
            '/penilaian',
            { alternatif_id: altId, nilai },
            {
                preserveScroll: true,
                onStart: () => setSavingId(altId),
                onFinish: () => setSavingId(null),
            },
        );
    }

    const incomplete = (altId: number) =>
        kriteria.some((k) => (matrix[altId]?.[k.id] ?? '') === '');

    if (alternatif.length === 0 || kriteria.length === 0) {
        return (
            <>
                <Head title="Penilaian" />
                <div className="p-4">
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Lengkapi data kriteria dan alternatif terlebih
                            dahulu.
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Penilaian" />
            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Penilaian Alternatif</CardTitle>
                        <CardDescription>
                            Masukkan nilai tiap alternatif pada setiap kriteria,
                            lalu simpan per baris.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="sticky left-0 bg-background">
                                            Alternatif
                                        </TableHead>
                                        {kriteria.map((k) => (
                                            <TableHead key={k.id}>
                                                {k.kode}
                                                {k.satuan
                                                    ? ` (${k.satuan})`
                                                    : ''}
                                            </TableHead>
                                        ))}
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alternatif.map((a) => (
                                        <TableRow key={a.id}>
                                            <TableCell className="sticky left-0 bg-background font-medium">
                                                {a.nama}
                                            </TableCell>
                                            {kriteria.map((k) => (
                                                <TableCell key={k.id}>
                                                    <Input
                                                        type="number"
                                                        inputMode="decimal"
                                                        step="any"
                                                        className="w-28"
                                                        placeholder="—"
                                                        value={
                                                            matrix[a.id]?.[
                                                                k.id
                                                            ] ?? ''
                                                        }
                                                        onChange={(e) =>
                                                            setCell(
                                                                a.id,
                                                                k.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        saveRow(a.id)
                                                    }
                                                    disabled={
                                                        savingId === a.id ||
                                                        incomplete(a.id)
                                                    }
                                                >
                                                    <Save className="size-4" />
                                                    Simpan
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                            Nilai yang dimasukkan dipakai langsung pada matriks
                            keputusan VIKOR.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PenilaianIndex.layout = {
    breadcrumbs: [{ title: 'Penilaian', href: '/penilaian' }],
};
