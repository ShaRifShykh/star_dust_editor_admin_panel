import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // React Router's hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.post(`${baseUrl}/admin/login`, {
        email,
        password,
      });

      // Agar login successful hai aur response me token milta hai
      if (response.data && response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        if (typeof onLogin === 'function') {
          onLogin();
        }
        navigate('/dashboard', { replace: true }); // success hone par navigate
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d0b13' }}>
      <div className="w-full max-w-md p-8 rounded-xl border" style={{ backgroundColor: '#191626', borderColor: '#29253a' }}>
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="mt-2 text-sm" style={{ color: '#8088e2' }}>
            Sign in with your admin credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#0d0b13] border border-[#29253a] text-white focus:outline-none focus:ring-2 focus:ring-[#8088e2]"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#0d0b13] border border-[#29253a] text-white focus:outline-none focus:ring-2 focus:ring-[#8088e2]"
              placeholder="Your password"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#8088e2' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
