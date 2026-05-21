import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Store auth data
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-indigo-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-pink-500/20 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-8 shadow-xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Admin Portal</h1>
            <p className="text-purple-300">Sign in to manage CampusConnect</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/15 border border-red-500/30 p-3">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@campusconnect.com"
                className="w-full rounded-xl border border-pink-500/20 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-purple-400 focus:border-pink-400 transition"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-pink-500/20 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-purple-400 focus:border-pink-400 transition"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 rounded-2xl bg-linear-to-r from-pink-600 to-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-purple-300 mb-2">Demo Credentials:</p>
            <p className="text-xs text-purple-200">Email: admin@test.com</p>
            <p className="text-xs text-purple-200">Password: Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
