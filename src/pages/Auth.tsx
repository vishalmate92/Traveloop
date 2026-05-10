import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Globe, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { isMockMode, auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (isMockMode) {
        const mockUser = {
          uid: 'google-user-123',
          email: 'google-user@example.com',
          displayName: 'Google Traveler',
          photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google'
        };
        localStorage.setItem('traveloop_mock_user', JSON.stringify(mockUser));
        toast.success('Signed in with Google (Mock)');
        window.location.href = '/dashboard';
      } else if (auth) {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isMockMode) {
        // Simple mock auth simulation
        const mockUser = {
          uid: 'user-123',
          email: email,
          displayName: email.split('@')[0],
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        localStorage.setItem('traveloop_mock_user', JSON.stringify(mockUser));
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
        window.location.href = '/dashboard';
      } else if (auth) {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
        }
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (err.code === 'auth/admin-restricted-operation') {
        toast.error('Authentication method disabled. Please enable it in Firebase Console.', { duration: 10000 });
      } else {
        toast.error(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
     if (isMockMode) {
        const guestUser = { uid: 'guest-123', email: 'guest@traveloop.ai', displayName: 'Guest' };
        localStorage.setItem('traveloop_mock_user', JSON.stringify(guestUser));
        window.location.href = '/dashboard';
     } else if (auth) {
        signInAnonymously(auth)
          .then(() => navigate('/dashboard'))
          .catch((err) => {
            if (err.code === 'auth/admin-restricted-operation') {
              toast.error('Anonymous sign-in is disabled.', { duration: 10000 });
            } else {
              toast.error(err.message || 'Guest login failed');
            }
          });
     }
  };

  return (
    <div className="min-h-screen bg-white flex lg:grid lg:grid-cols-2">
      {/* Left Side: Visual Experience */}
      <div className="hidden lg:relative lg:flex flex-col justify-between p-16 text-white overflow-hidden bg-slate-950">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070" 
            className="w-full h-full object-cover opacity-40 scale-105"
            alt="Luxury Resort"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-20">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Globe className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase font-display">Traveloop</span>
          </div>
          
          <h1 className="text-7xl font-black tracking-tighter leading-[0.85] mb-8 font-display">
            NAVIGATE <br />THE <span className="text-slate-400">EXTRAORDINARY.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-md font-medium leading-relaxed">
            The intelligent companion for the modern explorer. Architecting seamless journeys through collective intelligence.
          </p>
        </div>

        <div className="relative z-10 p-10 bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 max-w-lg">
          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className="text-white text-xs">★</span>
            ))}
          </div>
          <p className="text-xl italic text-white font-medium mb-6 leading-relaxed">
            "The level of precision in these AI-generated itineraries is beyond what any local guide could offer. Simply impeccable."
          </p>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" alt="Avatar" />
             </div>
             <div>
                <p className="font-bold text-white">Marcus Thorne</p>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded-full inline-block">Product Strategist</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side: Identity Gateway */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="absolute top-12 left-12 lg:hidden">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
             </div>
             <span className="text-xl font-black tracking-tighter uppercase font-display">Traveloop</span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <div className="space-y-3 mb-12">
            <h2 className="text-4xl font-black tracking-tight text-slate-950 font-display">
              {isLogin ? 'Authenticating' : 'Join the Collective'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Welcome back to your curated explorations.' : 'Start engineering your next great escape today.'}
            </p>
          </div>

          <div className="space-y-8">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-1.5">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Identity (Email)</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="email" 
                      placeholder="alex@example.com"
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-none ring-slate-950 focus-visible:ring-2 transition-all font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                 </div>
              </div>

               <div className="space-y-1.5">
                 <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secret (Password)</label>
                    {isLogin && <button type="button" className="text-xs font-bold text-slate-400 hover:text-slate-950 transition-colors uppercase tracking-widest">Lost Access?</button>}
                 </div>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-none ring-slate-950 focus-visible:ring-2 transition-all font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                 </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-14 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-2xl transition-all active:scale-[0.98] group"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    {isLogin ? 'Access Trips' : 'Create Identity'}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
               <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100" />
               </div>
               <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em] text-slate-300">
                  <span className="bg-white px-4">Federated Access</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-14 rounded-2xl border-slate-100 hover:bg-slate-50 font-bold gap-3 transition-colors text-slate-600"
                onClick={handleGoogleLogin}
                type="button"
                disabled={loading}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                className="h-14 rounded-2xl border-slate-100 hover:bg-slate-50 font-bold transition-colors text-slate-600"
                onClick={handleGuestLogin}
                type="button"
                disabled={loading}
              >
                Guest View
              </Button>
            </div>

            <p className="text-center text-sm font-medium text-slate-500">
              {isLogin ? "New to the collective?" : "Already part of us?"} {' '}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-950 font-black hover:underline underline-offset-4 decoration-2"
              >
                {isLogin ? 'Initiate Account' : 'Authenticate'}
              </button>
            </p>
          </div>
          
          <p className="text-[10px] text-slate-300 text-center mt-20 uppercase font-black tracking-[0.2em]">
            Curated Experience © 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}
