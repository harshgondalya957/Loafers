import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaRedo } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentFailure = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state?.message || 'The payment gateway could not authorize your transaction. Please double-check your card details or try a different method.';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-body">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-4 py-12">
                <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden">

                    {/* Pattern Overlay Background */}
                    <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-red-400 via-rose-500 to-red-600"></div>

                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaTimesCircle className="text-red-500 text-6xl drop-shadow-sm" />
                    </div>

                    <h1 className="text-3xl font-heading font-black text-gray-900 mb-4">Payment Failed!</h1>

                    <div className="bg-red-50 text-red-700 font-medium px-6 py-4 rounded-2xl mb-8 border border-red-100 text-sm leading-relaxed">
                        {message}
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-black hover:-translate-y-1 transform transition-all shadow-[0_8px_16px_rgba(0,0,0,0.1)] flex justify-center items-center gap-2"
                        >
                            <FaRedo /> Try Again
                        </button>
                        <Link
                            to="/order"
                            className="text-gray-500 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Cancel Transaction
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentFailure;
