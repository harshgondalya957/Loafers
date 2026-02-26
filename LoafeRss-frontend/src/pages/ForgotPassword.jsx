import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(email);
            setMessage('Password reset email sent! Please check your Inbox and Spam folder.');
        } catch (err) {
            console.error("Reset Password Error:", err);
            let msg = 'Failed to reset password.';
            if (err.code === 'auth/user-not-found') {
                msg = 'No account found with this email. Please sign up first.';
            } else if (err.code === 'auth/invalid-email') {
                msg = 'Invalid email address.';
            } else {
                msg = err.message;
            }
            setError(msg);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-cream font-body text-gray-800 flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-orange-400"></div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-cream rounded-full opacity-50"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-50 rounded-full opacity-50"></div>

                    <div className="relative z-10">
                        <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary mb-8 transition-colors text-sm font-bold">
                            <FaArrowLeft /> Back to Login
                        </Link>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Password Reset 🔒</h1>
                            <p className="text-gray-500 text-sm">Enter your email and we'll send you a link to reset your password.</p>
                        </div>

                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">{error}</div>}
                        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">{message}</div>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 hover:bg-primary-hover transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ForgotPassword;
