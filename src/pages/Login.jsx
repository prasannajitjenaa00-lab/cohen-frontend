import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.mustChangePassword) {
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      sessionStorage.setItem('showWelcome', 'true');
      if (result.user?.mustChangePassword) {
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background glowing blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl shadow-2xl border border-white/20 inline-block mb-3 max-w-[320px]">
            <img src="/logo.png" alt="Cohen International School" className="h-16 w-auto object-contain mx-auto" />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Admissions & Lead Management Portal</p>
        </div>

        <div className="glass-card bg-slate-900/60 p-8 border border-slate-800/80 shadow-2xl relative">
          <h3 className="text-lg font-bold text-slate-200 mb-6">Staff Account Login</h3>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@cohenschool.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 glass-input"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400">Account Password</label>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-10 glass-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-6 glass-btn-primary py-2.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access CRM Dashboard</span>
              )}
            </button>
          </form>

          {/* Super User & Demo Info */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-400">Portal Accounts:</p>
            <p>• Super Users: <span className="text-slate-300">chairman@coheninternationalschool.com</span></p>
            <p>• Initial Password: <span className="text-slate-300">Registered mobile number (First-time password change required)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
