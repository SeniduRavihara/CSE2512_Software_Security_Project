'use server'


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getServerToken() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function getUsers() {
    try {
        const token = await getServerToken();
        const response = await fetch(`${API_URL}/users`, {
          cache: 'no-store',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
            // If unauthorized, return empty array or throw
             if (response.status === 401 || response.status === 403) {
                 return [];
             }
            throw new Error('Failed to fetch users');
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error("API error in getUsers:", error);
        return [];
    }
}
