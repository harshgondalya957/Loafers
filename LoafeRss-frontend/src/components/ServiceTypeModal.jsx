import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingBag, FaTruck } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';

const ServiceTypeModal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-8"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading uppercase tracking-wide">How would you like your order?</h2>
                        <p className="text-gray-500 text-sm">Select a service type to proceed</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Delivery Option */}
                        <button
                            onClick={() => onSelect('delivery')}
                            className="bg-gray-50 hover:bg-pink-50 border-2 border-transparent hover:border-[#F43F97] rounded-2xl p-6 transition-all group flex flex-col items-center justify-center gap-4 py-10"
                        >
                            <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MdDeliveryDining className="text-[#F43F97] text-4xl" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#F43F97] uppercase tracking-wide">Delivery</h3>
                                <p className="text-gray-400 text-xs mt-1">We bring it to your door</p>
                            </div>
                        </button>

                        {/* Pickup Option */}
                        <button
                            onClick={() => onSelect('pickup')}
                            className="bg-gray-50 hover:bg-pink-50 border-2 border-transparent hover:border-[#F43F97] rounded-2xl p-6 transition-all group flex flex-col items-center justify-center gap-4 py-10"
                        >
                            <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaShoppingBag className="text-[#F43F97] text-3xl" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#F43F97] uppercase tracking-wide">Pickup</h3>
                                <p className="text-gray-400 text-xs mt-1">Collect from store</p>
                            </div>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ServiceTypeModal;
