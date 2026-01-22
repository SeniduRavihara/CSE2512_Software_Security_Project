'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get token from cookies (server-side)
async function getServerToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function getCart() {
  try {
    const token = await getServerToken();
    
    if (!token) {
      // Return empty cart if not authenticated
      return { id: '', items: [] };
    }

    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return { id: '', items: [] };
    }

    const cart = await response.json();
    return cart;
  } catch (error) {
    console.error('Get cart error:', error);
    return { id: '', items: [] };
  }
}

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const token = await getServerToken();

    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    const response = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add to cart');
    }

    revalidatePath('/cart');
  } catch (error) {
    console.error('Add to cart error:', error);
    throw error;
  }
}

export async function removeFromCart(itemId: string) {
  try {
    const token = await getServerToken();

    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: 0 }), // Backend deletes when quantity is 0
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove item');
    }

    revalidatePath('/cart');
  } catch (error) {
    console.error('Remove from cart error:', error);
    throw error;
  }
}

export async function updateCartItem(itemId: string, quantity: number) {
  if (quantity <= 0) {
      await removeFromCart(itemId);
  } else {
    try {
      const token = await getServerToken();

      if (!token) {
        throw new Error('Unauthorized');
      }

      const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update cart');
      }

      revalidatePath('/cart');
    } catch (error) {
      console.error('Update cart error:', error);
      throw error;
    }
  }
}
