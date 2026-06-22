import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Boxes,
    ClipboardList,
    Layers,
    SlidersHorizontal,
    Trophy,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type DashboardProps = {
    stats: {
        kriteria: number;
        subKriteria: number;
        alternatif: number;
        sudahDihitung: boolean;
    };
    terbaik: { nama: string; nilai_q: number } | null;
};

const statCards = [
    { key: 'kriteria', label: 'Kriteria', icon: SlidersHorizontal },
    { key: 'subKriteria', label: 'Sub Kriteria', icon: Layers },
    { key: 'alternatif', label: 'Alternatif', icon: Boxes },
] as const;

const steps = [
    { title: 'Kelola Kriteria', desc: 'Tentukan kriteria & prioritasnya, lalu generate bobot (ROC).', href: '/kriteria' },
    { title: 'Sub Kriteria', desc: 'Definisikan skala penilaian tiap kriteria.', href: '/sub-kriteria' },
    { title: 'Alternatif', desc: 'Daftarkan alternatif yang akan dinilai.', href: '/alternatif' },
    { title: 'Penilaian', desc: 'Beri nilai tiap alternatif pada setiap kriteria.', href: '/penilaian' },
    { title: 'Perhitungan', desc: 'Jalankan metode VIKOR untuk perankingan.', href: '/perhitungan' },
];

export default function Dashboard({ stats, terbaik }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Sistem Pendukung Keputusan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Pemilihan alternatif dengan metode ROC &amp; VIKOR.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map(({ key, label, icon: Icon }) => (
                        <Card key={key}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {label}
                                </CardTitle>
                                <Icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats[key]}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Card className="border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Alternatif Terbaik
                            </CardTitle>
                            <Trophy className="size-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            {terbaik ? (
                                <>
                                    <div className="truncate text-lg font-bold">
                                        {terbaik.nama}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Qi = {terbaik.nilai_q.toFixed(4)}
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada perhitungan.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Alur Pengambilan Keputusan</CardTitle>
                        <CardDescription>
                            Ikuti langkah berikut secara berurutan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        {steps.map((step, i) => (
                            <Link
                                key={step.href}
                                href={step.href}
                                className="group flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-accent"
                            >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                    {i + 1}
                                </span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 font-medium">
                                        <ClipboardList className="size-4 text-muted-foreground" />
                                        {step.title}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {step.desc}
                                    </p>
                                </div>
                                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
