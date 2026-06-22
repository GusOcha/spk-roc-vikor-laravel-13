import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Boxes,
    Calculator,
    ClipboardList,
    FileText,
    LayoutGrid,
    SlidersHorizontal,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Auth, NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth.user?.is_admin === true;

    const navItems: NavItem[] = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        ...(isAdmin
            ? [
                  { title: 'Kriteria', href: '/kriteria', icon: SlidersHorizontal },
                  { title: 'Alternatif', href: '/alternatif', icon: Boxes },
                  { title: 'Penilaian', href: '/penilaian', icon: ClipboardList },
                  { title: 'Perhitungan', href: '/perhitungan', icon: Calculator },
              ]
            : []),
        { title: 'Hasil', href: '/hasil', icon: BarChart3 },
        { title: 'Laporan', href: '/laporan', icon: FileText },
        ...(isAdmin ? [{ title: 'Pengguna', href: '/users', icon: Users }] : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
