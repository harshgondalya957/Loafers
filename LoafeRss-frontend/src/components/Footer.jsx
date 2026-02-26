import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaTiktok, FaExternalLinkAlt } from 'react-icons/fa';
import footerBg from '../assets/footer.jpg';
import pisanImg from '../assets/pisan.png'; // Using pisan.png as the pan image

const Footer = () => {
    const [showFbMenu, setShowFbMenu] = useState(false);
    return (
        <footer className="bg-white relative w-full overflow-hidden flex min-h-[500px]">

            {/* Left Decorative Image (Pan) */}
            <div className="absolute left-[-2%] bottom-5 z-50 w-[200px] xl:w-[280px]">
                <img src={pisanImg} alt="Breakfast Pan" className="w-full h-auto object-contain drop-shadow-2xl scale-x-[-1]" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-row relative z-20">

                {/* Text Content Container */}
                <div className="flex-1 bg-white py-16 pr-8 pl-[200px] xl:pl-64 grid grid-cols-2 gap-12 justify-center items-start relative z-20">

                    {/* Column 1: Locations */}
                    <div className="flex flex-col space-y-6 w-full">
                        <div>
                            <h4 className="font-heading text-[#F43F97] text-xs font-bold uppercase mb-1">DENTON</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-medium">
                                77 Stockport Rd, Denton,<br />Manchester M34 6DD
                            </p>
                        </div>
                        <div>
                            <h4 className="font-heading text-[#F43F97] text-xs font-bold uppercase mb-1">ASHTON</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-medium">
                                200 Stockport Rd, Ashton-<br />under-Lyne OL7 0NS
                            </p>
                        </div>
                        <div>
                            <h4 className="font-heading text-[#F43F97] text-xs font-bold uppercase mb-1">RESERVATIONS</h4>
                            <p className="text-gray-500 text-xs font-medium">loafersdenton.co.uk</p>
                        </div>
                    </div>

                    {/* Column 2: Menu & Hours */}
                    <div className="flex flex-col space-y-6 w-full">
                        <div>
                            <h4 className="font-heading text-[#F43F97] text-xs font-bold uppercase mb-1">MENU</h4>
                            <p className="text-gray-500 text-xs font-medium mb-1">loafersdenton.co.uk</p>
                            <a href="/order" className="text-[#F43F97] text-xs font-bold underline">Order Now</a>
                        </div>
                        <div>
                            <h4 className="font-heading text-[#F43F97] text-xs font-bold uppercase mb-1 mt-4">HOURS</h4>
                            <p className="text-gray-500 text-xs font-medium">
                                Delivery : 8 AM - 2:30 PM
                            </p>
                        </div>
                    </div>

                    {/* Column 3: Brand */}
                    <div className="flex flex-col w-full">
                        <h2 className="text-[#F43F97] font-heading text-4xl font-black uppercase tracking-tighter mb-2">LOAFERS</h2>
                        <p className="text-gray-500 text-[10px] leading-loose font-medium max-w-xs">
                            The mouth-watering aroma of sizzling burgers now fills the streets of birmingham thanks to the passionate pursuit of three brothers, the British founders of fizzfood.
                        </p>
                    </div>

                    {/* Column 4: Phone & Socials */}
                    <div className="flex flex-col w-full">
                        <h3 className="text-[#F43F97] font-heading text-xs font-bold uppercase mb-1">PHONE :</h3>
                        <p className="text-black font-bold text-sm mb-4">+91 99244-70816</p>

                        <div className="flex gap-2 items-center relative">
                            <div className="relative">
                                <button
                                    onClick={() => setShowFbMenu(!showFbMenu)}
                                    className={`w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 ${showFbMenu ? 'bg-[#F43F97] border-[#F43F97] text-white' : 'text-gray-600 hover:bg-[#F43F97] hover:border-[#F43F97] hover:text-white'}`}
                                >
                                    <FaFacebookF size={12} />
                                </button>
                                {showFbMenu && (
                                    <div className="absolute bottom-full right-0 mb-3 w-40 bg-white rounded-xl shadow-2xl p-3 z-50 animate-fade-in-up border border-gray-100">
                                        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-100"></div>
                                        <h4 className="text-gray-900 font-extrabold text-xs mb-2 border-b border-gray-100 pb-2">Select Location</h4>
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
                            <a href="https://www.tiktok.com/@loafers786?_r=1&_t=ZN-940FKMaheS6" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#F43F97] hover:border-[#F43F97] hover:text-white transition-all duration-300">
                                <FaTiktok size={14} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Image Container */}
                <div className="w-[40%] relative min-h-[500px] clip-path-slant-left">
                    <div className="absolute inset-0 bg-gray-900">
                        <img src={footerBg} alt="Interior" className="w-full h-full object-cover opacity-90" />
                    </div>
                    {/* Optional top shadow/gradient for aesthetic blending */}
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent opacity-20"></div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="absolute bottom-2 left-0 w-[60%] pl-[200px] xl:pl-64 text-left z-30">
                <div className="w-full border-t border-gray-300 mb-4"></div>
                <p className="text-gray-500 text-xs font-medium tracking-wide">
                    Copyright © 2025 LOAFERS. All rights reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;