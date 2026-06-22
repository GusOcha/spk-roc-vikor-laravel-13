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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Alternatif = { id: number; nama: string };

function AlternatifDialog({
    open,
    onOpenChange,
    editing,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing: Alternatif | null;
}) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({ nama: editing?.nama ?? '' });

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
            put(`/alternatif/${editing.id}`, opts);
        } else {
            post('/alternatif', opts);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Edit Alternatif' : 'Tambah Alternatif'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2 py-4">
                        <Label htmlFor="nama">Nama Alternatif</Label>
                        <Input
                            id="nama"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            placeholder="Nama alternatif"
                            autoFocus
                        />
                        <InputError message={errors.nama} />
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

export default function AlternatifIndex({
    alternatif,
}: {
    alternatif: Alternatif[];
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Alternatif | null>(null);

    return (
        <>
            <Head title="Alternatif" />
            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                        <div>
                            <CardTitle>Data Alternatif</CardTitle>
                            <CardDescription>
                                Daftar alternatif yang akan dirangking.
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => {
                                setEditing(null);
                                setDialogOpen(true);
                            }}
                        >
                            <Plus className="size-4" /> Tambah
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">
                                            No
                                        </TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead className="w-24 text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alternatif.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                Belum ada data.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {alternatif.map((row, i) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="text-muted-foreground">
                                                {i + 1}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {row.nama}
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
                                                        url={`/alternatif/${row.id}`}
                                                        label={row.nama}
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
                <AlternatifDialog
                    key={editing?.id ?? 'new'}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    editing={editing}
                />
            )}
        </>
    );
}

AlternatifIndex.layout = {
    breadcrumbs: [{ title: 'Alternatif', href: '/alternatif' }],
};
