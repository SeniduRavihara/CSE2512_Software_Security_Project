'use client';

import { motion } from 'framer-motion';
import { Loader2, Lock, Mail, User, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
            const messages = Object.values(result.errors).flat().join(', ');
            throw new Error(messages);
        }
        throw new Error(result.message || 'Something went wrong');
      }

      router.push('/login?message=Account created successfully');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-gray-300 mt-2">Join us to explore the future</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 text-sm text-red-100 bg-red-500/20 border border-red-500/30 rounded-xl"
          >
            {error}
          </motion.div>
        )}
        
        <div className="space-y-4">
          <div className="relative group">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-teal-400 transition-colors" />
            <input
              id="name"
              name="name"
              placeholder="Full Name"
              required
              className="w-full bg-black/20 border border-gray-600 rounded-xl px-10 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-teal-400 transition-colors" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              required
              className="w-full bg-black/20 border border-gray-600 rounded-xl px-10 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-teal-400 transition-colors" />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full bg-black/20 border border-gray-600 rounded-xl px-10 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-teal-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              <span>Sigrn Up</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
