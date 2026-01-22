'use client';

import { motion } from 'framer-motion';
import { Loader2, Lock, LogIn, Mail, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      // Check if MFA is required
      if (result.requiresMfa) {
        setRequiresMfa(true);
        setUserEmail(result.email);
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get('callbackUrl') || '/products';
      router.push(callbackUrl); 
      router.refresh();
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

  async function handleMfaSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const token = formData.get('mfaToken');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mfa/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, token }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Invalid MFA code');
      }

      // Store token in localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get('callbackUrl') || '/products';
      router.push(callbackUrl); 
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid MFA code');
      }
    } finally {
      setLoading(false);
    }
  }

  if (requiresMfa) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
      >
         <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-teal-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Two-Factor Authentication
          </h2>
          <p className="text-gray-300 mt-2">Enter the 6-digit code from your authenticator app</p>
        </div>

        <form onSubmit={handleMfaSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 text-sm text-red-100 bg-red-500/20 border border-red-500/30 rounded-xl"
            >
              {error}
            </motion.div>
          )}
          
          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-teal-400 transition-colors" />
            <input
              id="mfaToken"
              name="mfaToken"
              type="text"
              placeholder="000000"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              autoComplete="off"
              className="w-full bg-black/20 border border-gray-600 rounded-xl px-10 py-3 text-white text-center text-2xl tracking-widest placeholder:text-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
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
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                <span>Verify</span>
              </>
            )}
          </motion.button>

          <button
            type="button"
            onClick={() => setRequiresMfa(false)}
            className="w-full text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to login
          </button>
        </form>
      </motion.div>
    );
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
          Welcome Back
        </h2>
        <p className="text-gray-300 mt-2">Sign in to continue your journey</p>
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
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
