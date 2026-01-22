'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  imageUrl: z.string().url('Invalid URL'),
});

export type State = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    imageUrl?: string[];
  };
  message?: string | null;
};

// Helper to get token from cookies (server-side)
async function getServerToken() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function createProduct(prevState: State, formData: FormData) {
  const validatedFields = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    imageUrl: formData.get('imageUrl'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.',
    };
  }

  const { name, description, price, imageUrl } = validatedFields.data;

  try {
    const token = await getServerToken();
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ name, description, price, imageUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        message: error.error || 'Failed to Create Product.',
      };
    }
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Product.',
    };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function updateProduct(id: string, prevState: State, formData: FormData) {
  const validatedFields = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    imageUrl: formData.get('imageUrl'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.',
    };
  }

  const { name, description, price, imageUrl } = validatedFields.data;

  try {
    const token = await getServerToken();
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ name, description, price, imageUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        message: error.error || 'Failed to Update Product.',
      };
    }
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Product.',
    };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  try {
    const token = await getServerToken();
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { message: error.error || 'Failed to Delete Product.' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { message: 'Deleted Product.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Product.' };
  }
}

export async function getProducts() {
    try {
        const response = await fetch(`${API_URL}/products`, {
          cache: 'no-store', // Disable caching for fresh data
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const products = await response.json();
        return products;
    } catch (error) {
        console.error("API error in getProducts:", error);
        throw new Error('Failed to fetch products');
    }
}

export async function getProduct(id: string) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const product = await response.json();
        return product;
    } catch (error) {
        throw new Error('Failed to fetch product');
    }
}
