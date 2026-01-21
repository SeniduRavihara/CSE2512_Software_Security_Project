'use client';

import { useAuth } from '@/context/AuthContext';
import { AlertCircle, CheckCircle, Lock, QrCode, RefreshCw, Shield, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // MFA State
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [setupError, setSetupError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Disable MFA State
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disableCode, setDisableCode] = useState('');

  // 1. Auth Guard
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 2. Fetch User Details (Sync MFA Status)
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const userData = await response.json();
          setMfaEnabled(userData.mfaEnabled || false);
        }
      } catch (error) {
        console.error('Failed to fetch user status', error);
      } finally {
        setMfaLoading(false);
      }
    };

    if (user) {
      fetchUserStatus();
    }
  }, [user]);

  // 3. Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // MFA Actions
  const initiateMfaSetup = async () => {
    try {
      setSetupError('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mfa/setup`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (res.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setShowSetup(true);
      } else {
        setSetupError(data.error || 'Setup failed');
      }
    } catch (err) {
      setSetupError('Network error');
    }
  };

  const verifyAndEnableMfa = async () => {
    try {
      setSetupError('');
      setIsVerifying(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mfa/verify`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: verificationCode })
      });

      if (res.ok) {
        setMfaEnabled(true);
        setShowSetup(false);
        setVerificationCode('');
        setQrCode(null);
      } else {
        const data = await res.json();
        setSetupError(data.error || 'Invalid code');
      }
    } catch (err) {
      setSetupError('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const disableMfa = async () => {
    try {
      setSetupError('');
      setIsVerifying(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mfa/disable`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // Note: Backend might require token to disable. If so, pass disableCode.
        // Assuming current backend impl requires token for security.
        body: JSON.stringify({ token: disableCode })
      });

      if (res.ok) {
        setMfaEnabled(false);
        setShowDisableConfirm(false);
        setDisableCode('');
      } else {
        const data = await res.json();
        setSetupError(data.error || 'Invalid code. Cannot disable.');
      }
    } catch (err) {
      setSetupError('Failed to disable MFA');
    } finally {
      setIsVerifying(false);
    }
  };


  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Profile Info Box */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-teal-500 rounded-full"></div>
                My Profile
              </h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <div className="text-lg text-white font-semibold">{user.name}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <div className="text-lg text-white">{user.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                  <div className="inline-block px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm font-medium capitalize">
                    {user.role?.toLowerCase()}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full px-6 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Logout
              </button>
            </div>

            {/* Security Box */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Shield size={64} className="text-teal-500" />
               </div>
               
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <Lock className="text-teal-500" size={20} />
                 Security
               </h3>

               {mfaLoading ? (
                 <div className="text-gray-400 text-sm">Checking status...</div>
               ) : (
                 <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Two-Factor Auth</span>
                      {mfaEnabled ? (
                        <span className="flex items-center gap-1 text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded">
                          <CheckCircle size={14} /> Enabled
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500 text-sm font-medium bg-gray-500/10 px-2 py-1 rounded">
                          Disabled
                        </span>
                      )}
                    </div>

                    {!mfaEnabled && !showSetup && (
                      <button 
                        onClick={initiateMfaSetup}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <QrCode size={16} /> Enable MFA
                      </button>
                    )}

                    {mfaEnabled && !showDisableConfirm && (
                      <button 
                         onClick={() => setShowDisableConfirm(true)}
                         className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 border border-white/10 rounded-lg text-sm font-medium transition-colors"
                      >
                        Disable MFA
                      </button>
                    )}

                    {/* Disable Confirmation */}
                    {showDisableConfirm && (
                      <div className="space-y-3 mt-4 bg-black/20 p-3 rounded-lg border border-white/5">
                        <p className="text-xs text-gray-400">Enter code to confirm disable:</p>
                        <input 
                          type="text" 
                          placeholder="000000"
                          value={disableCode}
                          onChange={(e) => setDisableCode(e.target.value)}
                          maxLength={6}
                          className="w-full bg-black border border-white/20 rounded px-3 py-2 text-center tracking-widest text-lg focus:ring-1 focus:ring-teal-500 outline-none"
                        />
                         {setupError && <p className="text-red-400 text-xs">{setupError}</p>}
                        <div className="flex gap-2">
                           <button onClick={() => setShowDisableConfirm(false)} className="flex-1 py-1 text-xs text-gray-400 hover:text-white">Cancel</button>
                           <button onClick={disableMfa} disabled={isVerifying} className="flex-1 py-1 bg-red-600 text-white rounded text-xs">Confirm</button>
                        </div>
                      </div>
                    )}
                 </div>
               )}
            </div>

          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            
            {/* MFA Setup Wizard (Visible only when setting up) */}
            {showSetup && (
               <div className="bg-zinc-900 border border-teal-500/30 rounded-2xl p-8 animate-in fade-in slide-in-from-top-4">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-teal-400">
                    <Smartphone size={24} />
                    Setup Authenticator App
                  </h3>

                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="bg-white p-4 rounded-xl w-fit mx-auto md:mx-0">
                      {qrCode && <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-white font-medium mb-1">
                          <span className="w-6 h-6 rounded-full bg-teal-500 text-black flex items-center justify-center text-sm font-bold">1</span>
                          Scan QR Code
                        </div>
                        <p className="text-sm text-gray-400 ml-8">Open Microsoft Authenticator (or Google Auth) and scan this image.</p>
                      </div>

                      <div>
                         <div className="flex items-center gap-2 text-white font-medium mb-1">
                          <span className="w-6 h-6 rounded-full bg-teal-500 text-black flex items-center justify-center text-sm font-bold">2</span>
                          Enter Code
                        </div>
                        <p className="text-sm text-gray-400 ml-8 mb-2">Enter the 6-digit code from your app.</p>
                        <div className="ml-8">
                          <input 
                            type="text" 
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="000 000"
                            maxLength={6}
                            className="w-40 bg-black border border-white/20 rounded-lg px-4 py-2 text-center text-xl tracking-widest focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                      
                      {setupError && (
                        <div className="ml-8 text-red-400 text-sm flex items-center gap-1">
                          <AlertCircle size={14} /> {setupError}
                        </div>
                      )}

                      <div className="ml-8 flex gap-3 pt-2">
                        <button 
                          onClick={verifyAndEnableMfa}
                          disabled={isVerifying || verificationCode.length < 6}
                          className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isVerifying ? 'Verifying...' : 'Verify & Enable'}
                        </button>
                        <button 
                          onClick={() => setShowSetup(false)}
                          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
               </div>
            )}

            {/* Order History */}
            <div className="">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                 Order History
                 {ordersLoading && <RefreshCw className="animate-spin text-gray-600" size={20} />}
              </h2>

              {!ordersLoading && orders.length === 0 ? (
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 text-center">
                  <p className="text-gray-400 mb-4">You haven't placed any orders yet.</p>
                  <button 
                    onClick={() => router.push('/products')}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden hover:border-teal-500/30 transition-colors">
                      <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-white/5">
                        <div>
                          <p className="text-sm text-gray-400">Order Placed</p>
                          <p className="font-medium text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Amount</p>
                          <p className="font-medium text-teal-400">${Number(order.totalAmount).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-400' :
                            order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-right">
                           <p className="text-sm text-gray-400">Order ID</p>
                           <p className="font-mono text-xs text-gray-500">#{order.id.slice(-8)}</p>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="space-y-4">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex gap-4 items-center">
                              <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                {item.product?.imageUrl && (
                                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-white">{item.product?.name || 'Product'}</h4>
                                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-white">${Number(item.price).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
