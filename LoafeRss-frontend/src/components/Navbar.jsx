import React from 'react';
import { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaBars, FaTimes, FaUser, FaSignOutAlt, FaMapMarkerAlt, FaTiktok } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileFbMenu, setMobileFbMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const { selectedLocation, setLocation: setStoreLocation } = useLocationContext();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const toggleLocation = () => {
        setStoreLocation(null); // This will trigger the modal
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle hash scrolling on route change
    useEffect(() => {
        if (location.pathname === '/' && location.hash) {
            // Use a slightly longer timeout to ensure page layout is settled
            setTimeout(() => {
                const element = document.querySelector(location.hash);
                if (element) {
                    // Offset for sticky header (TopBar + Navbar)
                    const yOffset = -180;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 300);
        }
    }, [location]);

    const navLinks = ['Order Now', 'About Us', 'Reorder', 'Reviews', 'More'];

    const getLinkProps = (item) => {
        const isHome = location.pathname === '/';
        let to = '/';
        let isAnchor = false;

        if (item === 'Order Now') {
            to = '/order';
        } else if (item === 'About Us') {
            to = '/about';
        } else if (item === 'Reorder') {
            // Reorder should go to Order Now section on Home Page
            to = isHome ? '#order-now' : '/#order-now';
            isAnchor = isHome;
        } else {
            // For landing page sections
            // Ensure ID matches exactly what is in App.jsx
            const sectionId = item.toLowerCase().replace(/\s+/g, '-');
            to = isHome ? `#${item === 'More' ? 'contact' : sectionId}` : `/#${item === 'More' ? 'contact' : sectionId}`;
            isAnchor = isHome;
        }

        return { to, isAnchor };
    };

    return (
        <header className={`w-full z-50 transition-all duration-300 ${scrolled ? 'fixed top-0 bg-white shadow-md' : 'relative'}`}>
            {/* Top Bar */}
            <TopBar />

            {/* Main Nav */}
            <nav className="bg-white py-4 md:py-6 relative z-50">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-5xl font-heading font-bold text-primary tracking-tighter cursor-pointer"
                        onClick={() => window.location.href = '/'}
                    >
                        LOAFERS
                    </motion.h1>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex gap-8 font-heading font-bold text-sm uppercase tracking-widest text-gray-500 items-center">
                        {navLinks.map((item) => {
                            const { to, isAnchor } = getLinkProps(item);

                            return (
                                <li key={item}>
                                    {isAnchor ? (
                                        <a href={to} className="hover:text-primary transition-colors duration-300 relative group">
                                            {item}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                                        </a>
                                    ) : (
                                        <Link to={to} className="hover:text-primary transition-colors duration-300 relative group">
                                            {item}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    )}
                                </li>
                            );
                        })}

                        {/* Location Selector */}
                        <div
                            className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-[#F43F97] transition-colors border-l pl-6 ml-2 border-gray-200"
                            onClick={toggleLocation}
                            title="Switch Location"
                        >
                            <FaMapMarkerAlt className="text-[#F43F97]" />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] text-gray-400 font-bold">ORDERING FROM</span>
                                <span className="font-bold text-sm">{selectedLocation?.name || 'Select Store'}</span>
                            </div>
                        </div>

                        {/* Auth Buttons */}
                        {currentUser ? (
                            <div className="flex items-center gap-4 ml-4 border-l pl-4 border-gray-200">
                                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                    <FaUser />
                                    <span>{currentUser.displayName || currentUser.name || 'User'}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <FaSignOutAlt size={18} />
                                </button>
                            </div>
                        ) : (
                            <li className="ml-4">
                                <Link
                                    to="/login"
                                    className="text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300 text-xs"
                                >
                                    LOGIN
                                </Link>
                            </li>
                        )}
                    </ul>

                    {/* Mobile Menu Icon */}
                    <div className="md:hidden text-2xl text-primary cursor-pointer z-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 md:hidden shadow-lg"
                    >
                        {navLinks.map((item) => {
                            const { to, isAnchor } = getLinkProps(item);
                            return (
                                isAnchor ? (
                                    <a
                                        key={item}
                                        href={to}
                                        className="text-2xl font-heading font-bold text-gray-800 hover:text-primary transition-colors uppercase tracking-widest"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item}
                                    </a>
                                ) : (
                                    <Link
                                        key={item}
                                        to={to}
                                        className="text-2xl font-heading font-bold text-gray-800 hover:text-primary transition-colors uppercase tracking-widest"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item}
                                    </Link>
                                )
                            );
                        })}

                        <div className="flex flex-col items-center gap-2 mt-4" onClick={toggleLocation}>
                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                <FaMapMarkerAlt className="text-[#F43F97]" />
                                <span className="text-sm uppercase tracking-widest">Ordering from:</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800 border-b-2 border-[#F43F97] pb-1">
                                {selectedLocation?.name || 'Select Store'}
                            </span>
                        </div>

                        <div className="flex gap-6 text-primary text-xl mt-8 items-center relative z-50">
                            {/* Mobile Facebook Popup */}
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMobileFbMenu(!mobileFbMenu);
                                    }}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${mobileFbMenu ? 'bg-primary text-white' : 'bg-white'}`}
                                >
                                    <FaFacebookF />
                                </button>
                                {mobileFbMenu && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-white rounded-xl shadow-2xl p-4 animate-fade-in-up border border-gray-100 ring-1 ring-black/5">
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-100"></div>
                                        <h4 className="text-gray-900 font-extrabold text-xs mb-3 border-b border-gray-100 pb-2 text-center">Select Location</h4>
                                        <div className="space-y-2">
                                            <a
                                                href="https://www.facebook.com/profile.php?id=61575084346746"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full px-3 py-2 bg-gray-50 hover:bg-pink-50 hover:text-primary rounded-lg text-xs font-bold text-gray-700 text-center transition-all"
                                                onClick={() => setMobileFbMenu(false)}
                                            >
                                                Stockport
                                            </a>
                                            <a
                                                href="https://www.facebook.com/people/Loafers-Guide-bridge/61586911096745/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full px-3 py-2 bg-gray-50 hover:bg-pink-50 hover:text-primary rounded-lg text-xs font-bold text-gray-700 text-center transition-all"
                                                onClick={() => setMobileFbMenu(false)}
                                            >
                                                Guide Bridge
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <a href="https://www.tiktok.com/@loafers786?_r=1&_t=ZN-940FKMaheS6" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                                <FaTiktok />
                            </a>

                            {/* <a href="#"><FaTwitter /></a>
                            <a href="#"><FaInstagram /></a>
                            <a href="#"><FaPinterestP /></a> */}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
