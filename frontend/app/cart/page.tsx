'use client';

import { useCart } from '@/context/CartContext';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-600 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-400 mb-8">Add some amazing shoes to get started!</p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-zinc-900 border border-white/10 rounded-xl p-6 flex gap-6"
              >
                {/* Product Image */}
                <div className="w-32 h-32 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
                  <p className="text-2xl font-bold text-teal-400">${item.price}</p>

                  {/* Quantity Controls */}
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center border border-white/10 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-2 hover:bg-white/5 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-2 hover:bg-white/5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-sm text-gray-400">Subtotal</p>
                  <p className="text-xl font-bold text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">FREE</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-teal-400">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-teal-600 hover:bg-teal-500 text-white text-center font-semibold py-3 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="block w-full mt-3 border border-white/10 hover:bg-white/5 text-white text-center font-semibold py-3 rounded-lg transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
