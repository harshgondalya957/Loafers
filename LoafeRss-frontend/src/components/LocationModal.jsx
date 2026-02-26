import React, { useEffect, useState } from 'react';
import { useLocationContext, locations } from '../context/LocationContext';
import { FaStore, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const LocationModal = ({ manualOpen, onClose }) => {
    const { selectedLocation, setLocation } = useLocationContext();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // If manualOpen is provided, respect it
        if (manualOpen !== undefined) {
            setIsOpen(manualOpen);
        }
        // Else if no location is selected and auto-open isn't suppressed, open modal
        // Note: For initial load, we might want to force selection
        else if (!selectedLocation) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [selectedLocation, manualOpen]);

    const handleSelect = (locationId) => {
        setLocation(locationId);
        setIsOpen(false);
        if (onClose) onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop - Prevent closing without selection */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
                >
                    {manualOpen && (
                        <button
                            onClick={() => { setIsOpen(false); if (onClose) onClose(); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    )}
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaStore className="text-[#F43F97] text-3xl" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Choose Your Store</h2>
                        <p className="text-gray-500 text-sm">Please select which location you'd like to order from.</p>

                        <button
                            onClick={() => {
                                // Simulate Geolocation and picking nearest store (e.g., Denton)
                                alert("Detecting location... (Simulated)");
                                setTimeout(() => {
                                    handleSelect('denton');
                                }, 800);
                            }}
                            className="mt-4 text-xs font-bold text-[#F43F97] border border-[#F43F97] px-4 py-2 rounded-full hover:bg-pink-50 transition-colors flex items-center gap-2 mx-auto"
                        >
                            <FaMapMarkerAlt /> Use My Current Location
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Denton Option */}
                        <button
                            onClick={() => handleSelect('denton')}
                            className="w-full bg-gray-50 hover:bg-pink-50 border-2 border-transparent hover:border-[#F43F97] rounded-xl p-4 transition-all group text-left flex items-start gap-4"
                        >
                            <div className="mt-1">
                                <FaMapMarkerAlt className="text-gray-400 group-hover:text-[#F43F97] text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#F43F97]">Denton</h3>
                                <p className="text-gray-500 text-sm">77 Stockport Rd, Greater, Denton, Manchester M34 6DD</p>
                            </div>
                        </button>

                        {/* Ashton Option */}
                        <button
                            onClick={() => handleSelect('ashton')}
                            className="w-full bg-gray-50 hover:bg-pink-50 border-2 border-transparent hover:border-[#F43F97] rounded-xl p-4 transition-all group text-left flex items-start gap-4"
                        >
                            <div className="mt-1">
                                <FaMapMarkerAlt className="text-gray-400 group-hover:text-[#F43F97] text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#F43F97]">Ashton</h3>
                                <p className="text-gray-500 text-sm">200 Stockport Rd, Ashton-under-Lyne OL7 0NS</p>
                            </div>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LocationModal;
