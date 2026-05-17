import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import { Zap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(formData);
        toast.success('Account created successfully!');
      } else {
        await login({ email: formData.email, password: formData.password });
        toast.success('Welcome back!');
      }
      // Use both navigate and fallback to ensure redirect works
      navigate('/', { replace: true });
      // Fallback: if React Router navigation doesn't trigger a re-render,
      // force it after a brief delay
      setTimeout(() => {
        if (window.location.pathname === '/login') {
          window.location.href = '/';
        }
      }, 100);
    } catch (error: any) {
      const message = error.response?.data?.error
        || error.response?.data?.details?.[0]?.message
        || error.message
        || 'Authentication failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-surface-950 to-surface-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-center p-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-primary-600 to-primary-400 rounded-2xl shadow-2xl shadow-primary-600/30">
              <Zap size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Gig<span className="text-primary-400">Flow</span>
              </h1>
              <p className="text-sm text-surface-400 tracking-widest uppercase">Smart Leads Dashboard</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Manage your sales pipeline<br />
            <span className="text-primary-400">with intelligence.</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-md">
            Track leads, automate workflows, and close deals faster with our AI-powered CRM dashboard.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {['Real-time Analytics', 'Smart Filters', 'CSV Export', 'Role-Based Access'].map((f) => (
              <span key={f} className="px-4 py-2 bg-surface-800/50 border border-surface-700 rounded-full text-xs text-surface-300 font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-950">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Gig<span className="text-primary-400">Flow</span>
            </h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-surface-400 mt-2">
              {isRegister ? 'Start managing leads today' : 'Sign in to your dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                icon={<User size={16} />}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@company.com"
              icon={<Mail size={16} />}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-surface-500 hover:text-surface-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Quick login hint */}
            {!isRegister && (
              <div className="bg-surface-900/60 border border-surface-800 rounded-xl p-3 space-y-1">
                <p className="text-xs text-surface-400 font-medium">Demo credentials:</p>
                <p className="text-xs text-surface-500">Admin: admin@gigflow.com / admin123</p>
                <p className="text-xs text-surface-500">Sales: sarah@gigflow.com / sales123</p>
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-surface-400">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors cursor-pointer"
            >
              {isRegister ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
