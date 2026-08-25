import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import Select from '../components/ui/Select';
import { useAlert } from '../context/AlertContext';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'BUYER' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/users/register', formData);
            showAlert('Success!', 'Registration Successful! 🎉 Please login.');
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please check your details and try again. 🛑');
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        { value: 'BUYER', label: 'I want to Buy (BUYER)' },
        { value: 'SELLER', label: 'I want to Sell (SELLER)' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">

            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

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
                {/* Main Register Card (Glassmorphism effect) */}
                <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl max-w-md w-full border border-white relative z-10 my-8">

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-500 mb-2">
                            Create Account
                        </h2>
                        <p className="text-gray-500 text-sm">Join ECA Marketplace today</p>
                    </div>

                    <ErrorMessage message={error} className="mb-6 text-center" />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                error={!!error}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

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

                        <div>
                            <Label htmlFor="role">Account Type</Label>
                            <Select
                                id="role"
                                value={formData.role}
                                options={roleOptions}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="w-full mt-6 py-3 text-lg shadow-md shadow-blue-200 transform hover:-translate-y-0.5 transition-all" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline transition-all">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}