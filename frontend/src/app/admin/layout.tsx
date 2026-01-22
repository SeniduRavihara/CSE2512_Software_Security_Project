import AdminGuard from '@/components/admin/AdminGuard';
import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
        <div className="flex min-h-screen flex-col md:flex-row bg-black text-white">
        {/* Sidebar */}
        <div className="w-full flex-none md:w-64 border-r border-white/10 bg-zinc-900">
            <div className="flex h-full flex-col px-3 py-4 md:px-4">
                
                {/* Branding */}
                <Link
                className="mb-8 flex h-16 items-center justify-start rounded-xl bg-teal-600/10 p-4 border border-teal-500/20"
                href="/admin/products"
                >
                <div className="flex items-center gap-3 text-teal-400">
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="text-lg font-bold">Admin Console</span>
                </div>
                </Link>

                {/* Nav Links */}
                <div className="flex flex-col space-y-2">
                    <Link
                        href="/admin/products"
                        className="flex h-[48px] items-center gap-3 rounded-lg bg-white/5 p-3 text-sm font-medium hover:bg-teal-500/10 hover:text-teal-400 transition-all border border-transparent hover:border-teal-500/20"
                    >
                        <Package className="w-5 h-5" />
                        <p>Products</p>
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex h-[48px] items-center gap-3 rounded-lg bg-white/5 p-3 text-sm font-medium hover:bg-teal-500/10 hover:text-teal-400 transition-all border border-transparent hover:border-teal-500/20"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <p>Orders</p>
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex h-[48px] items-center gap-3 rounded-lg bg-white/5 p-3 text-sm font-medium hover:bg-teal-500/10 hover:text-teal-400 transition-all border border-transparent hover:border-teal-500/20"
                    >
                        <Users className="w-5 h-5" />
                        <p>Users</p>
                    </Link>
                </div>
                
                <div className="mt-auto p-4">
                    <p className="text-xs text-gray-500 text-center">TechStore Admin v1.0</p>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-black">
            {children}
        </div>
        </div>
    </AdminGuard>
  );
}
