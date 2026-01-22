'use client';

import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import CartDrawer from './CartDrawer';

type CartItem = {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    imageUrl: string;
  };
};

export default function CartWrapper({ cartItems }: { cartItems: CartItem[] }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-white hover:text-teal-400 transition-colors"
      >
        <ShoppingBag className="h-6 w-6" />
        {cartItems.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
        )}
      </button>
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
      />
    </>
  );
}
