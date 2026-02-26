import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaArrowLeft, FaEnvelope, FaLock, FaPhone, FaKey } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { googleLogin, customLogin } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'otp'
    const [otpStep, setOtpStep] = useState('phone'); // 'phone' | 'verify'

    // Form Data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone: '',
        otp: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const syncUserToBackend = async (user) => {
        try {
            await fetch('https://loafers-backend-2.onrender.com/api/shop/sync-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.displayName || 'Customer',
                    email: user.email,
                    phone: user.phoneNumber || ''
                })
            });
        } catch (err) {
            console.error("Backend sync error:", err);
        }
    };

    const handleSendEmailOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('https://loafers-backend-2.onrender.com/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setOtpStep('verify');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmailOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('https://loafers-backend-2.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: formData.otp })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Success
            customLogin(data.user); // Use customLogin if user exists
            navigate('/order');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = (e) => {
        e.preventDefault();
        setError('');
        if (formData.phone.length < 10) {
            setError('Please enter a valid phone number.');
            return;
        }
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setOtpStep('verify');
            alert('OTP sent to ' + formData.phone + ' (Use 1234)');
        }, 1000);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.otp === '1234') {
            // Mock Success - In real app, exchange OTP for token
            // For now, we simulate a user or just navigate
            // Since we can't create a real firebase user without real phone auth hooked up,
            // we will just save a flag and redirect, assuming Context handles 'null' user gracefully or we mock it.
            // But AuthContext expects Firebase User.
            // Fallback: We can't really "login" to Firebase without real creds.
            // Option: Create an anonymous user and link phone? Or just navigate and store info in localStorage for this session.

            localStorage.setItem('isPhoneLoggedIn', 'true');
            localStorage.setItem('phoneUser', formData.phone);

            // Sync dummy user
            try {
                // If we want a real user, we'd need backend support.
                // For UI demo:
                navigate('/order');
            } catch (err) {
                setError('Verification failed');
            }
        } else {
            setError('Invalid OTP. Please try again.');
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        // ... (Keep existing Google logic)
        try {
            setError('');
            setLoading(true);
            const result = await googleLogin();
            await syncUserToBackend(result.user);
            navigate('/order');
        } catch (err) {
            setError(`Failed to log in with Google: ${err.message}`);
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

                    <div className="relative z-10">
                        <Link to="/order" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary mb-8 transition-colors text-sm font-bold">
                            <FaArrowLeft /> Back to Menu
                        </Link>

                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Welcome Back! 👋</h1>
                            <p className="text-gray-500 text-sm">Log in to your account</p>
                        </div>

                        {/* Login Method Toggle */}
                        <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                            <button
                                onClick={() => setLoginMethod('email')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMethod === 'email' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Email
                            </button>
                            <button
                                onClick={() => setLoginMethod('otp')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMethod === 'otp' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Phone (OTP)
                            </button>
                        </div>

                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</div>}

                        {/* Email Login Form */}
                        {loginMethod === 'email' && (
                            <form onSubmit={otpStep === 'verify' ? handleVerifyEmailOTP : handleSendEmailOTP} className="space-y-4">
                                {otpStep === 'phone' ? ( // Reusing 'phone' state for initial step
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email</label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-medium"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="animate-fade-in-down">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Enter OTP</label>
                                        <div className="relative">
                                            <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="otp"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-medium tracking-widest text-center text-lg"
                                                placeholder="123456"
                                                value={formData.otp}
                                                onChange={handleChange}
                                                maxLength={6}
                                            />
                                        </div>
                                        <p className="text-xs text-center text-gray-400 mt-2">OTP sent to {formData.email} <button type="button" onClick={() => setOtpStep('phone')} className="text-primary font-bold hover:underline">Change?</button></p>
                                    </div>
                                )}
                                <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-primary-hover transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                    {otpStep === 'phone' ? 'Send OTP' : 'Verify & Login'}
                                </button>
                            </form>
                        )}

                        {/* OTP Login Form */}
                        {loginMethod === 'otp' && (
                            <form onSubmit={otpStep === 'phone' ? handleSendOTP : handleVerifyOTP} className="space-y-4">
                                {otpStep === 'phone' ? (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-medium"
                                                placeholder="+91 98765 43210"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Enter OTP</label>
                                        <div className="relative">
                                            <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="otp"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-medium tracking-widest text-center text-lg"
                                                placeholder="1234"
                                                value={formData.otp}
                                                onChange={handleChange}
                                                maxLength={4}
                                            />
                                        </div>
                                        <p className="text-xs text-center text-gray-400 mt-2">OTP sent to {formData.phone} <button type="button" onClick={() => setOtpStep('phone')} className="text-primary font-bold hover:underline">Change?</button></p>
                                    </div>
                                )}
                                <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-primary-hover transition-all mt-4">
                                    {otpStep === 'phone' ? 'Send OTP' : 'Verify & Login'}
                                </button>
                            </form>
                        )}

                        <div className="flex items-center gap-4 my-6">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-gray-400 text-xs font-bold uppercase">Or details</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button onClick={handleGoogleLogin} className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md">
                                <FaGoogle className="text-red-500" />
                                Continue with Google
                            </button>
                        </div>

                        <p className="text-center text-gray-500 text-sm mt-8">
                            Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
