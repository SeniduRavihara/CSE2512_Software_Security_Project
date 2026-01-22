'use client';

import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ 
  product 
}: { 
  product: { id: string; name: string; price: number; imageUrl: string } 
}) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded-lg transition-colors"
    >
      Add to Cart
    </button>
  );
}
