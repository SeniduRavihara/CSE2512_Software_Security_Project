'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { LogOut, Menu, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage) return null;

  return (
    <nav className="bg-zinc-950 border-b border-white/10 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center group-hover:bg-teal-400 transition-colors">
              <span className="text-black font-bold">T</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">
              TechStore
            </span>
          </Link>

          <div className="flex-1 max-w-md mx-4 hidden md:flex">
             <div className="relative w-full">
                <input 
                    type="text" 
                    placeholder="Search shoes..." 
                    className="w-full pl-4 pr-10 py-2 rounded-lg border border-white/10 bg-zinc-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    <Search className="w-4 h-4" />
                </button>
             </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
           
            <Link href="/products" className="hidden sm:inline-flex text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Products
            </Link>

            <Link
              href="/cart"
              className="relative text-gray-400 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="hidden md:inline text-sm font-medium">{user.name}</span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl py-2">
                         <div className="py-1">
                            {user.role === 'ADMIN' && (
                                <Link
                                    href="/admin/products"
                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                            <Link
                                href="/profile"
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white"
                                onClick={() => setShowUserMenu(false)}
                            >
                                My Profile
                            </Link>
                            <button
                                onClick={() => {
                                    setShowUserMenu(false);
                                    logout();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition-colors">
                    Sign In
                  </Link>
                )}
              </>
            )}
            
            <button className="sm:hidden text-gray-400 hover:text-white">
                <Menu className="w-6 h-6" />
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}
