import { Head, router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Alternatif = { id: number; nama: string };
type Kriteria = { id: number; kode: string; keterangan: string };
type SubKriteria = {
    id: number;
    kriteria_id: number;
    deskripsi: string;
    nilai: number;
};

type Props = {
    alternatif: Alternatif[];
    kriteria: Kriteria[];
    subKriteria: SubKriteria[];
    /** [alternatif_id][kriteria_id] = sub_kriteria_id */
    penilaian: Record<number, Record<number, number>>;
};

export default function PenilaianIndex({
    alternatif,
    kriteria,
    subKriteria,
    penilaian,
}: Props) {
    // Group sub-criteria by their criterion for the dropdowns.
    const subByKriteria = useMemo(() => {
        const map: Record<number, SubKriteria[]> = {};
        for (const s of subKriteria) {
            (map[s.kriteria_id] ??= []).push(s);
        }
        return map;
    }, [subKriteria]);

    // Working copy of the matrix: matrix[altId][kritId] = subId (as string).
    const [matrix, setMatrix] = useState<Record<number, Record<number, string>>>(
        () => {
            const initial: Record<number, Record<number, string>> = {};
            for (const a of alternatif) {
                initial[a.id] = {};
                for (const k of kriteria) {
                    const val = penilaian[a.id]?.[k.id];
                    initial[a.id][k.id] = val ? String(val) : '';
                }
            }
            return initial;
        },
    );

    const [savingId, setSavingId] = useState<number | null>(null);

    function setCell(altId: number, kritId: number, subId: string) {
        setMatrix((prev) => ({
            ...prev,
            [altId]: { ...prev[altId], [kritId]: subId },
        }));
    }

    function saveRow(altId: number) {
        const row = matrix[altId];
        const nilai: Record<number, number> = {};
        for (const k of kriteria) {
            if (row[k.id]) nilai[k.id] = Number(row[k.id]);
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
        kriteria.some((k) => !matrix[altId]?.[k.id]);

    if (alternatif.length === 0 || kriteria.length === 0) {
        return (
            <>
                <Head title="Penilaian" />
                <div className="p-4">
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Lengkapi data kriteria, sub kriteria, dan alternatif
                            terlebih dahulu.
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
                            Pilih nilai sub kriteria untuk setiap alternatif,
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
                                                    <Select
                                                        value={
                                                            matrix[a.id]?.[
                                                                k.id
                                                            ] ?? ''
                                                        }
                                                        onValueChange={(v) =>
                                                            setCell(
                                                                a.id,
                                                                k.id,
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-28">
                                                            <SelectValue placeholder="—" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {(
                                                                subByKriteria[
                                                                    k.id
                                                                ] ?? []
                                                            ).map((s) => (
                                                                <SelectItem
                                                                    key={s.id}
                                                                    value={String(
                                                                        s.id,
                                                                    )}
                                                                >
                                                                    {s.deskripsi}{' '}
                                                                    ({s.nilai})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
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
                            Angka dalam tanda kurung adalah nilai yang dipakai
                            pada matriks keputusan.
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
