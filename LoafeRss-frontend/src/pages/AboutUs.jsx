import React from 'react';
import { FaLeaf, FaBolt, FaWallet, FaHeart, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TornPaperBackground from '../components/TornPaperBackground';
import bgImage from '../assets/ki.jpg';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-cream font-body text-gray-800">
            <Navbar />

            {/* 1. Header Section */}
            <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-black">
                <div className="absolute inset-0 z-0 opacity-40">
                    <img src={bgImage} alt="Cafe Background" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-4 drop-shadow-lg tracking-tight">Loafers Cafe</h1>
                    <p className="text-xl md:text-2xl text-pink-200 font-bold drop-shadow-md italic">Delicious Moments, Freshly Served</p>
                </div>
                {/* Torn paper effect bottom */}
                <div className="absolute bottom-[-1px] left-0 w-full z-20">
                    <svg viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
                        <path d="M0,120 C240,100 480,20 720,40 C960,60 1200,100 1440,80 L1440,120 L0,120 Z" fill="#FFF9EF"></path>
                    </svg>
                </div>
            </div>

            {/* 2. About Description */}
            <TornPaperBackground className="py-20 md:py-32" bgColor="#FFF9EF" topEdge={false}>
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8 tracking-tight">Welcome to Loafers!</h2>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                        At Loafers Cafe, we believe in bringing people together over exceptional food and a great atmosphere.
                        We pride ourselves on using fresh ingredients to create mouth-watering meals that satisfy every craving.
                        From the moment you step in, our customer-focused service and comfortable ambiance are designed
                        to make you feel right at home. Come for the quality food, and stay for the experience.
                    </p>
                </div>
            </TornPaperBackground>

            {/* 3. Story & Mission Section */}
            <div className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                        {/* Our Story */}
                        <div className="bg-pink-50 rounded-3xl p-8 lg:p-12 border border-pink-100 shadow-sm relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-200 rounded-full opacity-50 blur-3xl"></div>
                            <h3 className="text-2xl md:text-3xl font-heading font-bold text-[#F43F97] mb-6 relative z-10">Our Story</h3>
                            <p className="text-gray-700 leading-relaxed font-medium relative z-10">
                                Loafers Cafe started with a simple idea: fast food doesn't have to mean compromising on quality.
                                We set out to create a vibrant local hub where friends and family could grab a bite of something
                                truly delicious without the wait. Over the years, our passion for great taste has transformed
                                us into a community favorite, constantly expanding our menu to bring you even more
                                freshly served delicious moments.
                            </p>
                        </div>

                        {/* Our Mission */}
                        <div className="bg-blue-50 rounded-3xl p-8 lg:p-12 border border-blue-100 shadow-sm relative overflow-hidden">
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>
                            <h3 className="text-2xl md:text-3xl font-heading font-bold text-[#3B82F6] mb-6 relative z-10">Our Mission</h3>
                            <p className="text-gray-700 leading-relaxed font-medium relative z-10">
                                Our mission is simple: to focus on quality, taste, and ultimate customer satisfaction.
                                We aim to push the boundaries of everyday cafe dining by sourcing the freshest ingredients
                                and meticulously crafting every dish to perfection. Every order that leaves our kitchen
                                is a testament to our commitment to culinary excellence and making you happy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Why Choose Us */}
            <TornPaperBackground className="py-16 md:py-24" bgColor="#FFF9EF">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 tracking-tight">Why Choose Us?</h2>
                        <div className="w-24 h-1 bg-[#F43F97] mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto bg-green-50 text-green-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                                <FaLeaf />
                            </div>
                            <h4 className="text-xl font-heading font-extrabold text-gray-900 mb-3 tracking-tight">Fresh Ingredients</h4>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">We handpick fresh, local produce to ensure maximum flavor in every bite.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                                <FaBolt />
                            </div>
                            <h4 className="text-xl font-heading font-extrabold text-gray-900 mb-3 tracking-tight">Fast Service</h4>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">Quick and efficient preparation so you get your hot meals on time.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                                <FaWallet />
                            </div>
                            <h4 className="text-xl font-heading font-extrabold text-gray-900 mb-3 tracking-tight">Affordable Pricing</h4>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">Enjoy premium taste without breaking the bank. Great food, great value.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto bg-pink-50 text-[#F43F97] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                                <FaHeart />
                            </div>
                            <h4 className="text-xl font-heading font-extrabold text-gray-900 mb-3 tracking-tight">Cozy Environment</h4>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">A warm, inviting atmosphere perfect for chilling with friends and family.</p>
                        </div>
                    </div>
                </div>
            </TornPaperBackground>

            {/* 5. Contact Info Section */}
            <div className="bg-white py-16 md:py-24">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-gray-900 mb-12 tracking-tight">Visit Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-3xl flex flex-col items-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                            <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                                <FaMapMarkerAlt className="text-2xl text-[#F43F97]" />
                            </div>
                            <h4 className="text-lg font-heading font-extrabold text-gray-900 mb-3">Location</h4>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">77 Stockport Rd, Greater<br />Denton, Manchester<br />M34 6DD, UK</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl flex flex-col items-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <FaPhoneAlt className="text-2xl text-blue-500" />
                            </div>
                            <h4 className="text-lg font-heading font-extrabold text-gray-900 mb-3">Phone</h4>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">Call us for orders or info<br />0161 336 2953</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl flex flex-col items-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                <FaEnvelope className="text-2xl text-green-500" />
                            </div>
                            <h4 className="text-lg font-heading font-extrabold text-gray-900 mb-3">Email</h4>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">Drop us a line anytime<br />contact@loaferscafe.com</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutUs;
