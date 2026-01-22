import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type FetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

export async function fetchFromServer(endpoint: string, options: FetchOptions = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle errors
  if (!res.ok) {
     // Try to parse error message, fallback to status text
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.message || res.statusText;
    throw new Error(errorMessage);
  }
  
  // Handle empty responses
  if (res.status === 204) return null;

  return res.json();
}
