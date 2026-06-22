import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Sparkles } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { ConfirmDelete } from '@/components/spk/confirm-delete';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';
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

type Kriteria = {
    id: number;
    kode: string;
    keterangan: string;
    jenis: 'benefit' | 'cost';
    satuan: string | null;
    prioritas: number;
    bobot: number | null;
};

type FormState = {
    kode: string;
    keterangan: string;
    jenis: 'benefit' | 'cost';
    satuan: string;
    prioritas: number | string;
};

const emptyForm: FormState = {
    kode: '',
    keterangan: '',
    jenis: 'benefit',
    satuan: '',
    prioritas: '',
};

function KriteriaDialog({
    open,
    onOpenChange,
    editing,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing: Kriteria | null;
}) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<FormState>(
            editing
                ? {
                      kode: editing.kode,
                      keterangan: editing.keterangan,
                      jenis: editing.jenis,
                      satuan: editing.satuan ?? '',
                      prioritas: editing.prioritas,
                  }
                : emptyForm,
        );

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
            put(`/kriteria/${editing.id}`, opts);
        } else {
            post('/kriteria', opts);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Edit Kriteria' : 'Tambah Kriteria'}
                        </DialogTitle>
                        <DialogDescription>
                            Prioritas 1 = paling penting. Bobot dihitung otomatis
                            (ROC).
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="kode">Kode</Label>
                            <Input
                                id="kode"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value)}
                                placeholder="K1"
                            />
                            <InputError message={errors.kode} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="keterangan">Keterangan</Label>
                            <Input
                                id="keterangan"
                                value={data.keterangan}
                                onChange={(e) =>
                                    setData('keterangan', e.target.value)
                                }
                                placeholder="Nama kriteria"
                            />
                            <InputError message={errors.keterangan} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="jenis">Jenis</Label>
                                <Select
                                    value={data.jenis}
                                    onValueChange={(v) =>
                                        setData('jenis', v as 'benefit' | 'cost')
                                    }
                                >
                                    <SelectTrigger id="jenis">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="benefit">
                                            Benefit
                                        </SelectItem>
                                        <SelectItem value="cost">
                                            Cost
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.jenis} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="satuan">Satuan</Label>
                                <Input
                                    id="satuan"
                                    value={data.satuan}
                                    onChange={(e) =>
                                        setData('satuan', e.target.value)
                                    }
                                    placeholder="cc, kg, juta, ..."
                                />
                                <InputError message={errors.satuan} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="prioritas">Prioritas</Label>
                            <Input
                                id="prioritas"
                                type="number"
                                min={1}
                                value={data.prioritas}
                                onChange={(e) =>
                                    setData('prioritas', e.target.value)
                                }
                            />
                            <InputError message={errors.prioritas} />
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

export default function KriteriaIndex({ kriteria }: { kriteria: Kriteria[] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Kriteria | null>(null);

    function openCreate() {
        setEditing(null);
        setDialogOpen(true);
    }

    function openEdit(row: Kriteria) {
        setEditing(row);
        setDialogOpen(true);
    }

    return (
        <>
            <Head title="Kriteria" />
            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                        <div>
                            <CardTitle>Data Kriteria</CardTitle>
                            <CardDescription>
                                Kelola kriteria penilaian dan bobotnya.
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.post(
                                        '/kriteria/generate',
                                        {},
                                        { preserveScroll: true },
                                    )
                                }
                            >
                                <Sparkles className="size-4" /> Generate Bobot
                            </Button>
                            <Button onClick={openCreate}>
                                <Plus className="size-4" /> Tambah
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                        <TableHead>Jenis</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead className="text-center">
                                            Prioritas
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Bobot
                                        </TableHead>
                                        <TableHead className="w-24 text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kriteria.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                Belum ada data.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {kriteria.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="font-medium">
                                                {row.kode}
                                            </TableCell>
                                            <TableCell>
                                                {row.keterangan}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        row.jenis === 'benefit'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {row.jenis}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {row.satuan ? (
                                                    row.satuan
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {row.prioritas}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {row.bobot === null
                                                    ? '—'
                                                    : Number(row.bobot).toFixed(
                                                          3,
                                                      )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            openEdit(row)
                                                        }
                                                        aria-label="Edit"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <ConfirmDelete
                                                        url={`/kriteria/${row.id}`}
                                                        label={row.keterangan}
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
                <KriteriaDialog
                    key={editing?.id ?? 'new'}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    editing={editing}
                />
            )}
        </>
    );
}

KriteriaIndex.layout = {
    breadcrumbs: [{ title: 'Kriteria', href: '/kriteria' }],
};
