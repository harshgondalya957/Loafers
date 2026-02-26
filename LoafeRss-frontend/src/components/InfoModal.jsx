import React from 'react';
import { FaTimes, FaMapMarkerAlt, FaInfoCircle, FaUtensils, FaClock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Import images for Cuisines section
import iceCreamImg from '../assets/SweetTreats/sw1.png'; // Using Sundae as Ice Cream
import saladImg from '../assets/SaladBar/sa1.png';     // Using Salad as Salad
import grillImg from '../assets/BurgerBar/b5.png';      // Using Burger (Chicken) as Grill

import { useLocationContext } from '../context/LocationContext';

const InfoModal = ({ isOpen, onClose }) => {
    const { selectedLocation, setLocation } = useLocationContext();

    // Fallback to Denton if null (though modal typically forces selection)
    const CurrentLoc = selectedLocation || {
        name: 'Denton',
        address: '77 Stockport Rd, Greater, Denton, Manchester M34 6DD',
        phone: '0161 320 7744',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=77+Stockport+Rd,+Greater,+Denton,+M34+6DD'
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-[#F9F9F9] w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-black transition-colors shadow-sm"
                        >
                            <FaTimes size={20} />
                        </button>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                {/* LEFT COLUMN */}
                                <div className="space-y-8">
                                    {/* INFO Section */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <FaInfoCircle className="text-gray-600" />
                                            <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">INFO</h3>
                                        </div>
                                        <div className="bg-primary p-6 rounded-xl shadow-sm transform transition-all hover:shadow-md">
                                            <p className="text-white leading-relaxed font-medium">
                                                Loafers based in {CurrentLoc.name} offers great-tasting English Breakfast delights at affordable prices. Get Fresh Food Delivered Hot To Your Doorstep!
                                            </p>
                                        </div>
                                    </div>

                                    {/* LOCATION Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-600" />
                                                <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">LOCATION ({CurrentLoc.name})</h3>
                                            </div>
                                            <button
                                                onClick={() => { onClose(); setLocation(null); }}
                                                className="text-xs font-bold text-primary hover:underline"
                                            >
                                                Switch Location
                                            </button>
                                        </div>
                                        <a
                                            href={CurrentLoc.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                                        >
                                            <div className="p-6 pb-2">
                                                <p className="text-gray-800 font-medium mb-1 group-hover:text-primary transition-colors">{CurrentLoc.address}</p>
                                                <p className="text-[#3B82F6] font-medium">{CurrentLoc.phone}</p>
                                            </div>
                                            {/* Static Map Visual Representation */}
                                            <div className="w-full h-48 bg-blue-50 relative mt-4 overflow-hidden">
                                                {/* Simple CSS Map Pattern */}
                                                <div className="absolute inset-0 opacity-50" style={{
                                                    backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
                                                    backgroundSize: '20px 20px'
                                                }}></div>
                                                {/* Roads */}
                                                <div className="absolute top-1/2 left-0 right-0 h-4 bg-white transform -rotate-6 border-y border-gray-200"></div>
                                                <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-white transform border-x border-gray-200"></div>

                                                {/* Location Pin */}
                                                <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                                                    <div className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded mb-1 whitespace-nowrap group-hover:bg-primary transition-colors">WE ARE HERE</div>
                                                    <FaMapMarkerAlt className="text-purple-600 text-3xl drop-shadow-lg group-hover:scale-110 transition-transform" />
                                                </div>

                                                {/* Street Names (Decorative) */}
                                                <div className="absolute top-10 left-10 text-gray-400 text-xs font-bold -rotate-6">Rose Hill</div>
                                                <div className="absolute bottom-10 right-20 text-gray-400 text-xs font-bold">Linden Road Academy</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN */}
                                <div className="space-y-8">
                                    {/* HYGIENE RATING */}
                                    <div className="bg-primary rounded-xl p-6 relative overflow-hidden text-center">
                                        <div className="flex justify-between items-start text-[10px] font-bold text-white mb-2">
                                            <span>Food Hygiene Rating</span>
                                            <div className="text-right">
                                                <div className="text-[8px]">Last Inspection:</div>
                                                <div>27 Jan 2025</div>
                                            </div>
                                        </div>

                                        {/* Circles */}
                                        <div className="flex justify-center items-center gap-2 md:gap-4 my-4 relative z-10">
                                            {[0, 1, 2, 3, 4, 5].map((num) => (
                                                <div key={num} className="relative flex flex-col items-center">
                                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg ${num === 4 ? 'bg-gray-800 text-white border-gray-800 shadow-xl scale-110' : 'bg-white text-gray-700 border-gray-700'}`}>
                                                        {num}
                                                    </div>
                                                    {num === 4 && (
                                                        <>
                                                            <div className="absolute -top-6 text-white text-2xl">▼</div>
                                                            <div className="absolute -bottom-6 font-bold text-white text-xs tracking-wider">GOOD</div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CUISINES */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <FaUtensils className="text-gray-600" transform="rotate(45)" />
                                            <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">CUISINES</h3>
                                        </div>
                                        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-around items-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-md">
                                                    <img src={iceCreamImg} alt="Ice Cream" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">Ice Cream</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-md">
                                                    <img src={saladImg} alt="Salad" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">Salad</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-md">
                                                    <img src={grillImg} alt="Grill" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">Grill</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* OPENING HOURS */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <FaClock className="text-gray-600" />
                                            <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">OPENING HOURS</h3>
                                        </div>
                                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                            <div className="grid grid-cols-3 bg-primary text-white text-xs md:text-sm font-medium py-3 px-4">
                                                <div>Day</div>
                                                <div className="text-center">Pickup</div>
                                                <div className="text-center">Delivery</div>
                                            </div>
                                            <div className="text-xs md:text-sm text-gray-600">
                                                {[
                                                    { day: 'Mon', pickup: '8:00 AM - 3:00 PM', delivery: '8:00 AM - 2:35 PM' },
                                                    { day: 'Tue', pickup: '8:00 AM - 3:00 PM', delivery: '8:00 AM - 2:35 PM' },
                                                    { day: 'Wed', pickup: '8:00 AM - 3:00 PM', delivery: '8:00 AM - 2:35 PM' },
                                                    { day: 'Thu', pickup: '8:00 AM - 3:00 PM', delivery: '8:00 AM - 2:35 PM' },
                                                    { day: 'Fri', pickup: '8:00 AM - 3:00 PM', delivery: '8:00 AM - 2:35 PM' },
                                                    { day: 'Sat', pickup: '8:00 AM - 3:00 PM', delivery: '8:00 AM - 2:35 PM' },
                                                    { day: 'Sun', pickup: '8:00 AM - 3:00 PM', delivery: '8:00 AM - 2:30 PM' },
                                                ].map((schedule, idx) => {
                                                    // Calculate current day index where 0 is Monday and 6 is Sunday
                                                    // new Date().getDay() returns 0 for Sunday, 1 for Monday, etc.
                                                    const currentDayIndex = (new Date().getDay() + 6) % 7;
                                                    const isActive = idx === currentDayIndex;

                                                    return (
                                                        <div key={idx} className={`grid grid-cols-3 py-3 px-4 border-b last:border-0 items-center ${isActive ? 'font-bold text-black bg-gray-50' : ''}`}>
                                                            <div>{schedule.day}</div>
                                                            <div className="text-center">{schedule.pickup}</div>
                                                            <div className="text-center">{schedule.delivery}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InfoModal;
