import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FaMotorcycle, FaCheck, FaPhone, FaArrowRight } from 'react-icons/fa';

const RiderLogin = () => {
    const [riders, setRiders] = useState([]);
    const [selectedRider, setSelectedRider] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // We can't access setRider from context here easily because Login is rendered inside Outlet but we need to update the parent state.
    // However, in our Layout, we conditionally render Outlet based on rider presence.
    // If we are at /delivery/login, Layout renders Outlet even if no rider. 
    // We should pass setRider via context.

    // Correction: In DeliveryLayout, I used <Outlet context={{ rider, setRider }} />.
    // So distinct from normal context. Let's try to grab it.
    const { setRider } = useOutletContext() || {};
    // If context is null (e.g. strict mode or mounting), fallback.

    useEffect(() => {
        fetchRiders();
    }, []);

    const fetchRiders = async () => {
        try {
            const res = await fetch('https://loafers-backend-2.onrender.com/api/store/riders');
            if (res.ok) {
                const data = await res.json();
                setRiders(data.filter(r => r.status === 'available' || r.status === 'busy'));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        if (!selectedRider) return;
        // Fix: Do not parse ID to int as Mongo uses string IDs
        const rider = riders.find(r => String(r.id) === String(selectedRider));
        if (rider) {
            localStorage.setItem('loafers_rider', JSON.stringify(rider));
            if (setRider) setRider(rider);
            else window.location.href = '/delivery/dashboard'; // Fallback reload
            navigate('/delivery/dashboard');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center border border-gray-100">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <FaMotorcycle size={32} />
                </div>
                <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">Rider Login</h2>
                <p className="text-sm text-gray-500 mb-8">Select your profile to start delivering</p>

                {loading ? (
                    <p className="text-primary font-bold">Loading Riders...</p>
                ) : (
                    <div className="space-y-4">
                        <select
                            value={selectedRider}
                            onChange={(e) => setSelectedRider(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 font-bold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">Select Your Name</option>
                            {riders.map(r => (
                                <option key={r.id} value={r.id}>{r.name} ({r.vehicle_no})</option>
                            ))}
                        </select>

                        <button
                            onClick={handleLogin}
                            disabled={!selectedRider}
                            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Start Shift <FaArrowRight />
                        </button>
                    </div>
                )}
            </div>
            <p className="mt-8 text-xs text-gray-400 font-bold">Loafers Delivery App v1.0</p>
        </div>
    );
};

export default RiderLogin;
