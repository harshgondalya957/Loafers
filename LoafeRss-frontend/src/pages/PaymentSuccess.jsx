import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaReceipt, FaMotorcycle, FaWalking } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentSuccess = () => {
    const location = useLocation();

    // Safety fallback incase user hits direct URL
    const [orderId] = useState(location.state?.orderId || `CLV-${Math.floor(100000 + Math.random() * 900000)}`);
    const serviceType = location.state?.serviceType || 'delivery';

    useEffect(() => {
        // You would typically clear the shopping cart globally here via Redux or Context dispatch
        // e.g. dispatch({ type: 'CLEAR_CART' })
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-body">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-4 py-12">
                <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden">

                    {/* Pattern Overlay Background */}
                    <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>

                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 scale-up">
                        <FaCheckCircle className="text-green-500 text-6xl drop-shadow-sm" />
                    </div>

                    <h1 className="text-3xl font-heading font-black text-gray-900 mb-2">Success!</h1>
                    <p className="text-gray-500 mb-8 font-medium">Your payment has been approved and your order is confirmed.</p>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 w-full border border-gray-100 flex flex-col items-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-2">Transaction ID</p>
                        <p className="text-xl font-mono font-bold text-gray-800 tracking-wider bg-white px-4 py-2 rounded-lg shadow-sm">{orderId}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link to="/order" className="bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-primary-hover hover:-translate-y-1 transform transition-all shadow-[0_8px_16px_rgba(244,63,151,0.2)]">
                            Back to Menu
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
