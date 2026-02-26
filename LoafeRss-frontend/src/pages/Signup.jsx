import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaArrowLeft, FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { googleLogin, customLogin } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('details'); // 'details' | 'otp'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        otp: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('https://loafers.onrender.com/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setStep('otp');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Call Backend Signup which verifies OTP
            const res = await fetch('https://loafers.onrender.com/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    otp: formData.otp
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Success - Log in custom user
            // Note: We might want to create a Firebase user too to keep using standard auth if desired,
            // but for this specific request "Verify OTP then Signup", backend handled it.
            // We'll proceed as custom user.

            customLogin(data.user);
            navigate('/order');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Wrapper to choose handler
    const onFormSubmit = (e) => {
        if (step === 'details') handleSendOtp(e);
        else handleVerifyAndSignup(e);
    };

    // ... (Keep Google Login)

    const handleGoogleLogin = async () => {
        // ... same as before
        try {
            setError('');
            setLoading(true);
            const result = await googleLogin();
            const user = result.user;

            try {
                await fetch('https://loafers.onrender.com/api/shop/sync-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: user.displayName,
                        email: user.email,
                        phone: user.phoneNumber || ''
                    })
                });
            } catch (err) {
                console.error("Backend sync error:", err);
            }

            navigate('/order');
        } catch (err) {
            console.error(err);
            setError(`Failed to sign up with Google: ${err.message}`);
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
                        <Link to="/order" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary mb-8 transition-colors text-sm font-bold">
                            <FaArrowLeft /> Back to Menu
                        </Link>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Join Loafers 🍔</h1>
                            <p className="text-gray-500 text-sm">Create an account to get started.</p>
                        </div>

                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">{error}</div>}

                        {step === 'details' && (
                            <>
                                <div className="flex flex-col gap-3 mb-6">
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md group"
                                    >
                                        <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" />
                                        Sign up with Google
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                    <span className="text-gray-400 text-xs font-bold uppercase">Or details</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                            </>
                        )}

                        <form onSubmit={onFormSubmit} className="space-y-4">
                            {step === 'details' ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Full Name</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email Address</label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium"
                                                placeholder="+44 7700 900000"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Removed Address and Password fields for OTP flow simplicity as requested? 
                                        Request said "sign up me email enter kare tab email me otp jana chaiye tab bhi verify hona chaiye".
                                        Usually signup still needs password if it's email signup. 
                                        But if we are doing pure OTP signup, maybe no password needed?
                                        Or we verify OTP first then ask for password?
                                        For now, I'll keep it simple: Enter details (including Password if user wants, but I removed it in replacement above to match Login flow style? No wait, I should keep password if user wants password login later. But Login flow is now OTP only. 
                                        Okay, I will REMOVE Password field to make it consistent with OTP Login.
                                    */}
                                </>
                            ) : (
                                <div className="animate-fade-in-down">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Enter Verification Code</label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                                    <p className="text-xs text-center text-gray-400 mt-2">Code sent to {formData.email}</p>
                                    <button type="button" onClick={() => setStep('details')} className="text-center w-full text-xs text-primary font-bold hover:underline mt-1">Change Email?</button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 hover:bg-primary-hover transition-all transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                {step === 'details' ? 'Continue' : 'Verify & Create Account'}
                            </button>
                        </form>

                        <p className="text-center text-gray-500 text-sm mt-8">
                            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div >
    );
};

export default Signup;

