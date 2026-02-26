import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaTiktok, FaExternalLinkAlt } from 'react-icons/fa';
import footerBg from '../assets/footer.jpg';
import pisanImg from '../assets/pisan.png'; // Using pisan.png as the pan image

const Footer = () => {
    const [showFbMenu, setShowFbMenu] = useState(false);
    return (
        <footer className="bg-white relative w-full overflow-hidden flex flex-col md:flex-row min-h-auto md:min-h-[500px]">

            {/* Left Decorative Image (Pan) - Desktop */}
            <div className="hidden md:block absolute left-[-2%] bottom-5 z-50 w-[150px] lg:w-[200px] xl:w-[280px]">
                <img src={pisanImg} alt="Breakfast Pan" className="w-full h-auto object-contain drop-shadow-2xl scale-x-[-1]" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row relative z-20 w-full">

                {/* Text Content Container */}
                <div className="flex-1 bg-white pt-10 pb-6 px-6 sm:px-12 md:py-16 md:pr-8 md:pl-[140px] lg:pl-[200px] xl:pl-64 flex flex-row justify-between gap-x-4 items-start relative z-20">

                    {/* Left Column (Address, Menu, Reservations, Hours) */}
                    <div className="flex flex-col space-y-8 w-1/2 text-left items-start pr-2">
                        <div>
                            <h4 className="font-heading text-[#F43F97] text-sm md:text-base font-black uppercase mb-2">ADDRESS :</h4>
                            <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-medium">
                                Greater, 77 Stockport Rd, Denton,<br />Manchester M34 6DD, United<br />Kingdom
                            </p>
                        </div>

                        <div>
                            <h4 className="font-heading text-[#F43F97] text-sm md:text-base font-black uppercase mb-2">MENU :</h4>
                            <p className="text-gray-600 text-xs md:text-sm font-medium">loafersdenton.co.uk</p>
                        </div>

                        <div>
                            <h4 className="font-heading text-[#F43F97] text-sm md:text-base font-black uppercase mb-2">RESERVATIONS :</h4>
                            <p className="text-gray-600 text-xs md:text-sm font-medium">loafersdenton.co.uk</p>
                        </div>

                        <div>
                            <h4 className="font-heading text-[#F43F97] text-sm md:text-base font-black uppercase mb-2">HOURS :</h4>
                            <p className="text-gray-600 text-xs md:text-sm font-bold">
                                Delivery <span className="font-medium">: 8 AM-2:35 PM</span>
                            </p>
                        </div>
                    </div>

                    {/* Right Column (Loafers, Phone & Socials) */}
                    <div className="flex flex-col w-1/2 text-left items-start pl-2 md:pl-6">

                        {/* Brand */}
                        <div className="flex flex-col mb-10">
                            <h2 className="text-[#F43F97] font-heading text-[2.5rem] md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">LOAFERS</h2>
                            <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-medium">
                                The mouth-watering aroma of sizzling burgers now fills the streets of Birmingham thanks to the passionate pursuit of three brothers, the British founders of Faztfood.
                            </p>
                        </div>

                        {/* Phone & Socials */}
                        <div className="flex flex-col w-full text-left items-start">
                            <h3 className="text-[#F43F97] font-heading text-sm md:text-base font-black uppercase mb-2">PHONE :</h3>
                            <p className="text-black font-bold text-sm md:text-base mb-4">+44 161 320 7744</p>

                            <div className="flex gap-2 flex-wrap items-center relative justify-start">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowFbMenu(!showFbMenu)}
                                        className={`w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-400 flex items-center justify-center transition-all duration-300 ${showFbMenu ? 'bg-[#F43F97] border-[#F43F97] text-white' : 'text-gray-600 hover:bg-[#F43F97] hover:border-[#F43F97] hover:text-white'}`}
                                    >
                                        <FaFacebookF size={12} className="md:w-3.5 md:h-3.5" />
                                    </button>
                                    {showFbMenu && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-0 mb-3 w-40 bg-white rounded-xl shadow-2xl p-3 z-50 animate-fade-in-up border border-gray-100">
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-4 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-100"></div>
                                            <h4 className="text-gray-900 font-extrabold text-xs mb-2 border-b border-gray-100 pb-2 text-left">Select Location</h4>
                                            <div className="space-y-1">
                                                <a
                                                    href="https://www.facebook.com/profile.php?id=61575084346746"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between w-full px-2 py-1.5 bg-gray-50 hover:bg-pink-50 hover:text-primary rounded-lg text-[10px] font-bold text-gray-700 transition-all group"
                                                    onClick={() => setShowFbMenu(false)}
                                                >
                                                    Stockport
                                                    <FaExternalLinkAlt className="text-gray-400 group-hover:text-primary text-[8px]" />
                                                </a>
                                                <a
                                                    href="https://www.facebook.com/people/Loafers-Guide-bridge/61586911096745/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between w-full px-2 py-1.5 bg-gray-50 hover:bg-pink-50 hover:text-primary rounded-lg text-[10px] font-bold text-gray-700 transition-all group"
                                                    onClick={() => setShowFbMenu(false)}
                                                >
                                                    Guide Bridge
                                                    <FaExternalLinkAlt className="text-gray-400 group-hover:text-primary text-[8px]" />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <a href="https://www.tiktok.com/@loafers786?_r=1&_t=ZN-940FKMaheS6" target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-[#F43F97] hover:border-[#F43F97] hover:text-white transition-all duration-300">
                                    <FaTiktok size={12} className="md:w-3.5 md:h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Image Container */}
                <div className="w-full md:w-[40%] h-[300px] sm:h-[350px] md:h-auto relative md:min-h-[500px] md:clip-path-slant-left mt-8 md:mt-0">
                    <div className="absolute inset-0 bg-gray-900 overflow-hidden">
                        <img src={footerBg} alt="Interior" className="w-full h-full object-cover opacity-90 scale-105" />
                    </div>
                    {/* Cloud-like top fade on mobile to blend background with interior image like in design */}
                    <div className="absolute top-0 left-0 w-full h-24 md:hidden bg-gradient-to-b from-white via-white/80 to-transparent"></div>

                    {/* Mobile Only: Pan Overlay positioned on the right top overlapping the image */}
                    <div className="md:hidden absolute -top-16 right-0 sm:right-10 z-50 w-[140px] drop-shadow-xl translate-x-4">
                        <img src={pisanImg} alt="Breakfast Pan" className="w-full h-auto object-contain scale-110" />
                    </div>

                </div>
            </div>

            {/* Copyright Bar - Mobile */}
            <div className="md:hidden w-full text-center py-5 bg-white z-20">
                <p className="text-gray-500 text-[10px] font-medium tracking-wide">
                    Copyright © 2025 LOAFERS. All rights reserved
                </p>
            </div>

            {/* Desktop Only: Copyright Bar */}
            <div className="hidden md:block absolute bottom-2 left-0 w-[60%] md:pl-[140px] lg:pl-[200px] xl:pl-64 text-left z-30">
                <div className="w-full border-t border-gray-300 mb-4"></div>
                <p className="text-gray-500 text-xs font-medium tracking-wide">
                    Copyright © 2025 LOAFERS. All rights reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;