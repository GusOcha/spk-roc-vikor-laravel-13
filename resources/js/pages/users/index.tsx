import { Head, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { ConfirmDelete } from '@/components/spk/confirm-delete';
import InputError from '@/components/input-error';
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
import type { Auth } from '@/types';

type UserRow = {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
};

type FormState = {
    name: string;
    email: string;
    is_admin: boolean;
    password: string;
};

function UserDialog({
    open,
    onOpenChange,
    editing,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing: UserRow | null;
}) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<FormState>({
            name: editing?.name ?? '',
            email: editing?.email ?? '',
            is_admin: editing?.is_admin ?? false,
            password: '',
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
            put(`/users/${editing.id}`, opts);
        } else {
            post('/users', opts);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Edit Pengguna' : 'Tambah Pengguna'}
                        </DialogTitle>
                        {editing && (
                            <DialogDescription>
                                Kosongkan password jika tidak ingin
                                mengubahnya.
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={data.is_admin ? 'admin' : 'user'}
                                onValueChange={(v) =>
                                    setData('is_admin', v === 'admin')
                                }
                            >
                                <SelectTrigger id="role">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">
                                        Administrator
                                    </SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.is_admin} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder={
                                    editing ? 'Biarkan kosong' : 'Min. 6 karakter'
                                }
                            />
                            <InputError message={errors.password} />
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

export default function UsersIndex({ users }: { users: UserRow[] }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<UserRow | null>(null);

    return (
        <>
            <Head title="Pengguna" />
            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                        <div>
                            <CardTitle>Data Pengguna</CardTitle>
                            <CardDescription>
                                Kelola akun yang dapat mengakses sistem.
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
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="w-24 text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="font-medium">
                                                {row.name}
                                            </TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        row.is_admin
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {row.is_admin
                                                        ? 'Administrator'
                                                        : 'User'}
                                                </Badge>
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
                                                    {row.id !==
                                                        auth.user.id && (
                                                        <ConfirmDelete
                                                            url={`/users/${row.id}`}
                                                            label={row.name}
                                                        />
                                                    )}
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
                <UserDialog
                    key={editing?.id ?? 'new'}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    editing={editing}
                />
            )}
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Pengguna', href: '/users' }],
};
