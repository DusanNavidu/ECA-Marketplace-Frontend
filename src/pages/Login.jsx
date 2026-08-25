import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useAlert } from '../context/AlertContext';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login', formData);
      localStorage.setItem('token', response.data);
      showAlert('Success!', 'Login Successful! 🚀');
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error === 'ACCOUNT_PENDING') {
        setIsPending(true);
      } else {
        setError('Invalid credentials or something went wrong!');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center border-t-4 border-yellow-500">
                    <div className="text-5xl mb-4">⏳</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Pending</h2>
                    <p className="text-gray-600 mb-6">
                        Your seller account is currently under review. Our admins will approve your account shortly. Please check back later!
                    </p>
                    <button 
                        onClick={() => setIsPending(false)} 
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">

      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

      <div className="w-full max-w-md">
        <Link to="/">
          <div className="shrink-0 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-black text-xl tracking-tighter">ECA</span>
            </div>
            <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-linear-to-r from-gray-800 to-gray-600">
              Marketplace
            </span>
          </div>
        </Link>
        
        {/* Main Login Card (Glassmorphism effect) */}
        <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl max-w-md w-full border border-white relative z-10 my-8">


          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-500 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm">Log in to your ECA Marketplace account</p>
          </div>

          <ErrorMessage message={error} className="mb-6 text-center" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                required
                error={!!error}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                error={!!error}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full mt-4 py-3 text-lg shadow-md shadow-blue-200 transform hover:-translate-y-0.5 transition-all" disabled={loading}>
              {loading ? 'Authenticating...' : 'Log In'}
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline transition-all">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}