import { Head, router } from '@inertiajs/react';
import { Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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

    const [saving, setSaving] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [confirmClear, setConfirmClear] = useState(false);

    function emptyMatrix() {
        const empty: Record<number, Record<number, string>> = {};
        for (const a of alternatif) {
            empty[a.id] = {};
            for (const k of kriteria) empty[a.id][k.id] = '';
        }
        return empty;
    }

    function setCell(altId: number, kritId: number, value: string) {
        setMatrix((prev) => ({
            ...prev,
            [altId]: { ...prev[altId], [kritId]: value },
        }));
    }

    function saveAll() {
        // Build the full matrix payload: penilaian[altId][kritId] = number.
        const payload: Record<number, Record<number, number>> = {};
        for (const a of alternatif) {
            payload[a.id] = {};
            for (const k of kriteria) {
                const v = matrix[a.id]?.[k.id] ?? '';
                if (v !== '') payload[a.id][k.id] = Number(v);
            }
        }

        router.post(
            '/penilaian',
            { penilaian: payload },
            {
                preserveScroll: true,
                onStart: () => setSaving(true),
                onFinish: () => setSaving(false),
            },
        );
    }

    function clearAll() {
        router.delete('/penilaian', {
            preserveScroll: true,
            onStart: () => setClearing(true),
            onSuccess: () => setMatrix(emptyMatrix()),
            onFinish: () => {
                setClearing(false);
                setConfirmClear(false);
            },
        });
    }

    // At least one cell must be filled to allow saving.
    const hasAnyValue = alternatif.some((a) =>
        kriteria.some((k) => (matrix[a.id]?.[k.id] ?? '') !== ''),
    );

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
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                        <div>
                            <CardTitle>Penilaian Alternatif</CardTitle>
                            <CardDescription>
                                Masukkan nilai tiap alternatif pada setiap
                                kriteria, lalu simpan seluruh penilaian.
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setConfirmClear(true)}
                                disabled={clearing || !hasAnyValue}
                            >
                                <Trash2 className="size-4" />
                                Hapus Semua
                            </Button>
                            <Button
                                onClick={saveAll}
                                disabled={saving || !hasAnyValue}
                            >
                                <Save className="size-4" />
                                Simpan Semua
                            </Button>
                        </div>
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
                                                {k.keterangan}
                                                {k.satuan
                                                    ? ` (${k.satuan})`
                                                    : ''}
                                            </TableHead>
                                        ))}
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-4">
                            <p className="text-xs text-muted-foreground">
                                Nilai yang dimasukkan dipakai langsung pada
                                matriks keputusan VIKOR.
                            </p>
                            <Button
                                onClick={saveAll}
                                disabled={saving || !hasAnyValue}
                            >
                                <Save className="size-4" />
                                Simpan Semua
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus semua penilaian?</DialogTitle>
                        <DialogDescription>
                            Seluruh nilai penilaian alternatif akan dihapus.
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmClear(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={clearAll}
                            disabled={clearing}
                        >
                            Hapus Semua
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PenilaianIndex.layout = {
    breadcrumbs: [{ title: 'Penilaian', href: '/penilaian' }],
};
