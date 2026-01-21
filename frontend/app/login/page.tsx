'use client';

import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  // Destructure loginWithMFA as well
  const { login, loginWithMFA } = useAuth();
  const router = useRouter();
  
  // State
  const [step, setStep] = useState<'LOGIN' | 'MFA'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (step === 'LOGIN') {
        const result = await login(email, password);
        
        // Check if MFA is required
        if (result && result.requiresMfa) {
          setStep('MFA');
          setLoading(false);
          return;
        }

        // If no MFA required, we are redirected or logged in
        router.push('/');
      } 
      else if (step === 'MFA') {
        // Handle MFA Verification
        await loginWithMFA(email, mfaCode);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 'LOGIN' ? 'Welcome Back' : 'Two-Factor Auth'}
            </h1>
            <p className="text-gray-400">
              {step === 'LOGIN' ? 'Sign in to your account' : 'Enter the code from your app'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
               <span className="block w-1.5 h-1.5 rounded-full bg-red-400"></span>
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {step === 'LOGIN' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                 <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-400">
                       <Smartphone size={32} />
                    </div>
                 </div>
                 
                 <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 text-center">Authentication Code</label>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    required
                    maxLength={6}
                    autoFocus
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-teal-500 transition-colors font-mono"
                    placeholder="000000"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (step === 'LOGIN' ? 'Signing in...' : 'Verifying...') : (
                 step === 'LOGIN' ? 'Sign In' : 'Verify Login'
              )}
              {!loading && <ArrowRight size={18} />}
            </button>
            
            {step === 'MFA' && (
               <button
                 type="button"
                 onClick={() => { setStep('LOGIN'); setError(''); }}
                 className="w-full text-sm text-gray-500 hover:text-white transition-colors"
               >
                 Back to Login
               </button>
            )}
          </form>

          {step === 'LOGIN' && (
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-teal-400 hover:text-teal-300">
                  Sign up
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
