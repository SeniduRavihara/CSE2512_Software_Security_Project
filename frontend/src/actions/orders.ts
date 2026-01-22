'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const OrderSchema = z.object({
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerAddress: z.string().min(1, 'Address is required'),
});

// Helper to get token from cookies (server-side)
async function getServerToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function placeOrder(prevState: any, formData: FormData) {
  const validatedFields = OrderSchema.safeParse({
    customerName: formData.get('customerName'),
    customerEmail: formData.get('customerEmail'),
    customerAddress: formData.get('customerAddress'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Place Order.',
    };
  }

  const { customerName, customerEmail, customerAddress } = validatedFields.data;

  try {
    const token = await getServerToken();

    if (!token) {
      return { message: 'Please login to place an order' };
    }

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ customerName, customerEmail, customerAddress }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        message: error.error || 'Failed to place order',
      };
    }

  } catch (error) {
    console.error(error);
    return {
      message: 'Error: Failed to Place Order.',
    };
  }

  redirect('/checkout/success');
}

export async function getOrders() {
    try {
        const token = await getServerToken();

        if (!token) {
          throw new Error('Unauthorized');
        }

        const response = await fetch(`${API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const orders = await response.json();
        return orders;
    } catch (error) {
        throw new Error('Failed to fetch orders');
    }
}

import { revalidatePath } from 'next/cache';

export async function updateOrder(orderId: string, status: string) {
    try {
        const token = await getServerToken();
        if (!token) throw new Error('Unauthorized');

        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update order');
        }

        revalidatePath('/admin/orders');
    } catch (error) {
        console.error('Update order error:', error);
        throw new Error('Failed to update order');
    }
}
