import React, { useState, useEffect, useRef } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaTiktok, FaExternalLinkAlt } from 'react-icons/fa';

const TopBar = () => {
    const [showFbMenu, setShowFbMenu] = useState(false);
    const fbMenuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (fbMenuRef.current && !fbMenuRef.current.contains(event.target)) {
                setShowFbMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-primary text-white py-2 text-[210px] md:text-xs font-bold uppercase tracking-widest hidden md:block relative z-[60]">
            <div className="container mx-auto flex justify-between items-center px-6">
                <div className="flex gap-6">
                    <span>100% Secure Delivery</span>
                    <span>Variety of Dishes</span>
                    <span>Best Quality Guarantee</span>
                </div>
                <div className="flex gap-3 text-primary items-center">
                    {/* Facebook Popup */}
                    <div className="relative" ref={fbMenuRef}>
                        <button
                            onClick={() => setShowFbMenu(!showFbMenu)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer ${showFbMenu ? 'bg-pink-700 text-white' : 'bg-white hover:bg-gray-100 text-primary'}`}
                        >
                            <FaFacebookF size={14} />
                        </button>

                        {showFbMenu && (
                            <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl p-4 z-50 animate-fade-in-up border border-gray-100">
                                <div className="absolute -top-2 right-3 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-100"></div>
                                <h4 className="text-gray-900 font-extrabold text-sm mb-3 border-b border-gray-100 pb-2">Select Location</h4>
                                <div className="space-y-2">
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61575084346746"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between w-full px-3 py-2 bg-gray-50 hover:bg-pink-50 hover:text-primary rounded-lg text-xs font-bold text-gray-700 transition-all group"
                                        onClick={() => setShowFbMenu(false)}
                                    >
                                        Stockport
                                        <FaExternalLinkAlt className="text-gray-400 group-hover:text-primary text-[10px]" />
                                    </a>
                                    <a
                                        href="https://www.facebook.com/people/Loafers-Guide-bridge/61586911096745/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between w-full px-3 py-2 bg-gray-50 hover:bg-pink-50 hover:text-primary rounded-lg text-xs font-bold text-gray-700 transition-all group"
                                        onClick={() => setShowFbMenu(false)}
                                    >
                                        Guide Bridge
                                        <FaExternalLinkAlt className="text-gray-400 group-hover:text-primary text-[10px]" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    <a href="https://www.tiktok.com/@loafers786?_r=1&_t=ZN-940FKMaheS6" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors"><FaTiktok size={14} /></a>

                    {/* <a href="#" className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors"><FaTwitter size={14} /></a> */}
                    {/* <a href="#" className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors"><FaInstagram size={14} /></a> */}
                    {/* <a href="#" className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors"><FaPinterestP size={14} /></a> */}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
