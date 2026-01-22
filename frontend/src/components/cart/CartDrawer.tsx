'use client';

import { removeFromCart, updateCartItem } from '@/actions/cart';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import Link from 'next/link';

type CartItem = {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    imageUrl: string;
  };
};

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
};

export default function CartDrawer({ isOpen, onClose, cartItems }: CartDrawerProps) {
    const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl"
          >
            <div className="flex h-full flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-teal-500" />
                    <h2 className="text-lg font-bold text-white tracking-wide">YOUR CART</h2>
                </div>
                <button
                  type="button"
                  className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <ShoppingBag className="w-16 h-16 text-zinc-800" />
                        <p className="text-gray-500">Your cart is empty.</p>
                        <button onClick={onClose} className="text-teal-500 hover:text-teal-400 font-medium">Start Shopping</button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                        <motion.div 
                            layout
                            key={item.id} 
                            className="group flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex justify-between text-base font-medium text-white">
                                <h3 className="line-clamp-1">{item.product.name}</h3>
                                <p className="ml-4 text-teal-400">${Number(item.product.price).toFixed(2)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                               <div className="flex items-center bg-black/40 rounded-full border border-white/10 px-2 py-1">
                                    <button 
                                        onClick={() => updateCartItem(item.id, item.quantity - 1)}
                                        className="p-1 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="mx-3 text-sm font-medium text-white w-4 text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                        className="p-1 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                               </div>

                               <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-500/70 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-full transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                  <div className="border-t border-white/10 px-6 py-6 bg-zinc-900/50 backdrop-blur-md">
                    <div className="flex justify-between text-base font-medium text-gray-300 mb-6">
                      <p>Subtotal</p>
                      <p className="text-white text-xl">${subtotal.toFixed(2)}</p>
                    </div>
                    
                    <Link
                        href="/checkout"
                        className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-teal-900/20 hover:from-teal-500 hover:to-emerald-500 transform active:scale-95 transition-all"
                        onClick={onClose}
                    >
                        Checkout Securely
                    </Link>
                    
                    <button
                        type="button"
                        className="mt-4 w-full text-center text-sm text-gray-500 hover:text-white transition-colors"
                        onClick={onClose}
                    >
                        Continue Shopping
                    </button>
                  </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
