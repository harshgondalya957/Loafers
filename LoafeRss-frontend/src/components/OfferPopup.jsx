import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaGift } from 'react-icons/fa';

const OfferPopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show popup after 2 seconds
        const timer = setTimeout(() => {
            const hasSeenOffer = sessionStorage.getItem('hasSeenOffer');
            if (!hasSeenOffer) {
                setIsOpen(true);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem('hasSeenOffer', 'true');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header Image/Color */}
                        <div className="bg-[#F43F97] h-32 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                            <FaGift className="text-white/30 text-8xl absolute -bottom-4 -right-4 rotate-12" />
                            <div className="text-center z-10 text-white p-4">
                                <h2 className="text-3xl font-heading font-bold mb-1">SPECIAL OFFER!</h2>
                                <p className="font-medium text-white/90">Get 20% OFF your first order</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors backdrop-blur-md"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-center bg-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Use Code: <span className="text-[#F43F97] font-black tracking-wider text-2xl block mt-2 border-2 border-dashed border-[#F43F97] py-2 px-4 rounded-xl transform -rotate-2">LOAFERS20</span></h3>
                            <p className="text-gray-500 text-sm mt-4 mb-6 leading-relaxed">
                                Experience the taste of our premium burgers and breakfasts.
                                Valid for new users only. T&C apply.
                            </p>

                            <button
                                onClick={handleClose}
                                className="w-full bg-[#F43F97] text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-600 transform hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-wide text-sm"
                            >
                                Order Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OfferPopup;
