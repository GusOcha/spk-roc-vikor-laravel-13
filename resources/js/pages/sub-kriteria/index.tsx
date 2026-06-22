import { Head, useForm } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { ConfirmDelete } from '@/components/spk/confirm-delete';
import InputError from '@/components/input-error';
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

type Kriteria = { id: number; kode: string; keterangan: string };
type SubKriteria = {
    id: number;
    kriteria_id: number;
    deskripsi: string;
    nilai: number;
    kriteria: Kriteria | null;
};

type FormState = {
    kriteria_id: string;
    deskripsi: string;
    nilai: number | string;
};

function SubKriteriaDialog({
    open,
    onOpenChange,
    editing,
    kriteria,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing: SubKriteria | null;
    kriteria: Kriteria[];
}) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<FormState>({
            kriteria_id: editing ? String(editing.kriteria_id) : '',
            deskripsi: editing?.deskripsi ?? '',
            nilai: editing?.nilai ?? '',
        });

    function submit(e: FormEvent) {
        e.preventDefault();
        const opts = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                onOpenChange(false);
            },
        };
        if (editing) {
            put(`/sub-kriteria/${editing.id}`, opts);
        } else {
            post('/sub-kriteria', opts);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>
                            {editing
                                ? 'Edit Sub Kriteria'
                                : 'Tambah Sub Kriteria'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="kriteria_id">Kriteria</Label>
                            <Select
                                value={data.kriteria_id}
                                onValueChange={(v) => setData('kriteria_id', v)}
                            >
                                <SelectTrigger id="kriteria_id">
                                    <SelectValue placeholder="Pilih kriteria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kriteria.map((k) => (
                                        <SelectItem
                                            key={k.id}
                                            value={String(k.id)}
                                        >
                                            {k.kode} — {k.keterangan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.kriteria_id} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Input
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) =>
                                    setData('deskripsi', e.target.value)
                                }
                            />
                            <InputError message={errors.deskripsi} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nilai">Nilai</Label>
                            <Input
                                id="nilai"
                                type="number"
                                step="any"
                                value={data.nilai}
                                onChange={(e) =>
                                    setData('nilai', e.target.value)
                                }
                            />
                            <InputError message={errors.nilai} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function SubKriteriaIndex({
    subKriteria,
    kriteria,
}: {
    subKriteria: SubKriteria[];
    kriteria: Kriteria[];
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<SubKriteria | null>(null);

    return (
        <>
            <Head title="Sub Kriteria" />
            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                        <div>
                            <CardTitle>Data Sub Kriteria</CardTitle>
                            <CardDescription>
                                Skala penilaian untuk setiap kriteria.
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => {
                                setEditing(null);
                                setDialogOpen(true);
                            }}
                            disabled={kriteria.length === 0}
                        >
                            <Plus className="size-4" /> Tambah
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kriteria</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead className="text-right">
                                            Nilai
                                        </TableHead>
                                        <TableHead className="w-24 text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subKriteria.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                Belum ada data.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {subKriteria.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="font-medium">
                                                {row.kriteria
                                                    ? `${row.kriteria.kode} — ${row.kriteria.keterangan}`
                                                    : '—'}
                                            </TableCell>
                                            <TableCell>
                                                {row.deskripsi}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {row.nilai}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditing(row);
                                                            setDialogOpen(true);
                                                        }}
                                                        aria-label="Edit"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <ConfirmDelete
                                                        url={`/sub-kriteria/${row.id}`}
                                                        label={row.deskripsi}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {dialogOpen && (
                <SubKriteriaDialog
                    key={editing?.id ?? 'new'}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    editing={editing}
                    kriteria={kriteria}
                />
            )}
        </>
    );
}

SubKriteriaIndex.layout = {
    breadcrumbs: [{ title: 'Sub Kriteria', href: '/sub-kriteria' }],
};
