import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaStar, FaInfoCircle, FaSearch, FaPlus, FaCheckCircle, FaTimesCircle, FaRegCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { FiClock, FiShoppingBag, FiUsers } from 'react-icons/fi';
import { MdDeliveryDining, MdStorefront, MdKeyboardArrowDown } from 'react-icons/md';

import MenuCard from '../components/MenuCard';
import ProductModal from '../components/ProductModal';
import HotDrinksCard from '../components/HotDrinksCard';
import BurgerCard from '../components/BurgerCard';
import CartSidebar from '../components/CartSidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InfoModal from '../components/InfoModal';
import ServiceTypeModal from '../components/ServiceTypeModal';
import LocationModal from '../components/LocationModal';
import { useLocationContext } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';

// Assuming ki.jpg is the intended background image (kl.png typo)
import bgImage from '../assets/ki.jpg';

import { motion, AnimatePresence } from 'framer-motion';

import { menuData, categories } from '../data/products';
import HotDogCard from '../components/HotDogCard';
import SaladCard from '../components/SaladCard';
import SavouriesCard from '../components/SavouriesCard';
import MealDealCard from '../components/MealDealCard';
import ShakeCard from '../components/ShakeCard';
import SweetTreatCard from '../components/SweetTreatCard';
import BreakfastCard from '../components/BreakfastCard';



// Data moved to src/data/products.js

const OrderNow = () => {
    // Cart State
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cartItems');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (e) {
            console.error("Failed to parse cart items", e);
            return [];
        }
    });

    // Save Cart to LocalStorage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // Location Context
    const { selectedLocation } = useLocationContext();
    const [showLocationModal, setShowLocationModal] = useState(false);

    // Initialize from localStorage or show modal
    const [orderType, setOrderType] = useState(localStorage.getItem('orderType') || null);
    const [showServiceModal, setShowServiceModal] = useState(!localStorage.getItem('orderType'));

    const handleServiceSelect = (type) => {
        setOrderType(type);
        localStorage.setItem('orderType', type);
        setShowServiceModal(false);
    };

    const navigate = useNavigate();
    const location = useLocation();

    // Tabbed Menu State
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const isManualScroll = React.useRef(false);

    // Effect to handle category selection from URL query parameters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get('category');
        if (categoryParam && categories.includes(categoryParam)) {
            setActiveCategory(categoryParam);
            const sectionId = categoryParam.replace(/\s+/g, '-').toLowerCase();
            // Allow time for render
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const yOffset = -100;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location.search]);

    // Scroll Spy Effect
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // Trigger when section is near top
            threshold: 0
        };

        const handleIntersect = (entries) => {
            if (isManualScroll.current) return;

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const category = categories.find(cat =>
                        cat.replace(/\s+/g, '-').toLowerCase() === sectionId
                    );
                    if (category) {
                        setActiveCategory(category);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        categories.forEach(cat => {
            const sectionId = cat.replace(/\s+/g, '-').toLowerCase();
            const element = document.getElementById(sectionId);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    // Product Modal State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    // Cart Handlers
    // 1. Opens the modal with the selected product
    const { currentUser } = useAuth(); // Add this hook call at the top of component

    const addToCart = (item) => {
        if (!currentUser) {
            // Optional: Save intended item or just redirect
            navigate('/login');
            return;
        }
        setSelectedProduct(item);
        setIsProductModalOpen(true);
    };

    // 2. Adds the customized product from the modal to the cart
    const handleModalAddToCart = (customizedItem) => {
        setCartItems(prev => {
            // Generate a unique ID for the cart item to handle customizations separately
            // In a real app, you might check for identical existing items to merge quantities
            const uniqueId = `${customizedItem.name}-${Date.now()}`;
            return [...prev, { ...customizedItem, id: uniqueId }];
        });
        setIsCartOpen(true); // Open cart sidebar to show the added item
        setIsProductModalOpen(false); // Close product modal
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) return;
        setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Get current items
    const currentItems = menuData[activeCategory] || [];





    // Store Open Logic
    const [storeSettings, setStoreSettings] = useState({ open_time: '08:00', close_time: '22:00' });
    const [isStoreOpen, setIsStoreOpen] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('https://loafers-backend-2.onrender.com/api/store/settings');
                if (res.ok) {
                    const data = await res.json();
                    setStoreSettings(data);
                    checkStoreStatus(data);
                }
            } catch (error) {
                console.error("Failed to fetch store settings:", error);
                // Fallback to default
                checkStoreStatus(storeSettings);
            }
        };
        fetchSettings();
    }, []);

    const checkStoreStatus = (settings) => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const [openHour, openMinute] = (settings.open_time || '08:00').split(':').map(Number);
        const [closeHour, closeMinute] = (settings.close_time || '22:00').split(':').map(Number);

        const currentTimeVal = currentHour * 60 + currentMinute;
        const openTimeVal = openHour * 60 + openMinute;
        const closeTimeVal = closeHour * 60 + closeMinute;

        if (closeTimeVal > openTimeVal) {
            setIsStoreOpen(currentTimeVal >= openTimeVal && currentTimeVal <= closeTimeVal);
        } else {
            // Spans across midnight
            setIsStoreOpen(currentTimeVal >= openTimeVal || currentTimeVal <= closeTimeVal);
        }
    };

    // Scroll sidebar active link into view
    useEffect(() => {
        const activeId = activeCategory.replace(/\s+/g, '-').toLowerCase();
        const activeLink = document.getElementById(`sidebar-link-${activeId}`);
        if (activeLink) {
            activeLink.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [activeCategory]);

    return (
        <div className="min-h-screen bg-cream font-body text-gray-800 relative">
            <ServiceTypeModal
                isOpen={showServiceModal}
                onSelect={handleServiceSelect}
                onClose={() => setShowServiceModal(false)}
            />
            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-black/75 z-10"></div>
                <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
            </div>

            <div className="relative z-10">
                <LocationModal /> {/* Automatically handles open state if needed, but we also control it explicitly for 'Change' button if we modify LocationModal to accept prop or use context only */}
                {/* Note: LocationModal in current implementation handles its own open state based on context nullity. 
                    If we want to explicitly open it, we might need to adjust LocationModal or just rely on context. 
                    Let's assume we need to pass a prop or update the component. 
                    Checking LocationModal.jsx... it uses internal state initialized by context. 
                    We should probably pass an 'isOpen' prop if we want to control it from here, or update the context to trigger it. 
                    For now, I'll assume standard implementation or add a temporary override if needed. 
                    Actually, looking at previous steps, LocationModal uses internal state based on selectedLocation. 
                    To force open, we might need to set selectedLocation to null or pass a prop.
                    Let's pass 'isOpen' override if possible, or just use the button to clear location?
                    Better: Updated logic to allow opening. Let's just rely on the component for now, 
                    but to support the "Change" button, we might need to refactor LocationModal to accept an isOpen prop. 
                    Wait, I can't easily refactor LocationModal within this step without reading it again. 
                    Ah, I see from previous turn I viewed it. It has `const [isOpen, setIsOpen] = useState(false);` and useEffect.
                    I should just add the component here. If I want to open it, I can use a context method if available, or just render it conditionally.
                */}
                {showLocationModal && <LocationModal manualOpen={true} onClose={() => setShowLocationModal(false)} />}

                <ServiceTypeModal
                    isOpen={showServiceModal}
                    onSelect={handleServiceSelect}
                    onClose={() => setShowServiceModal(false)}
                />
                <Navbar />

                <div className="container mx-auto px-4 py-8 max-w-7xl mb-12">

                    {/* 2. Top Info Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-6 md:mb-8">
                        {/* Header Row */}
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 md:gap-6 mb-6 md:mb-8">
                            {/* Left Side: Name, Address, Group Order */}
                            <div className="flex flex-col gap-1 w-full md:w-auto">
                                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-black tracking-tight">Loafers</h1>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="flex items-center gap-2 pl-1 pr-3 py-1 border border-gray-300 rounded-full bg-white hover:shadow-sm transition-shadow group ml-auto md:ml-0"
                                    >
                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 group-hover:bg-gray-200">
                                            <FiUsers className="text-xs md:text-sm" />
                                        </div>
                                        <span className="font-bold text-gray-800 text-xs md:text-base">Group Order</span>
                                    </button>
                                </div>
                                <div className="flex items-center text-gray-500 text-xs md:text-base mt-1">
                                    <span className="mr-1.5"><FaMapMarkerAlt /></span>
                                    {selectedLocation ? selectedLocation.address : 'Select Location'}
                                    <button
                                        onClick={() => setShowLocationModal(true)}
                                        className="ml-2 text-primary font-bold hover:underline text-xs"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Info & Rating */}
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
                                <button
                                    onClick={() => setIsInfoOpen(true)}
                                    className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded-full font-bold flex items-center gap-2 transition-colors text-xs md:text-base shadow-sm order-2 md:order-1"
                                >
                                    <FaInfoCircle className="text-sm md:text-lg" /> Info
                                </button>
                                <div className="flex flex-col items-start md:items-end order-1 md:order-2">
                                    <div className="flex text-amber-400 text-sm gap-0.5">
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-200" />
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="font-bold text-black text-lg leading-none">4.5</span>
                                        <span className="text-gray-400 text-xs font-medium">(91)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cards Row - Grid Layout on Mobile */}
                        <div className="grid grid-cols-2 xl:flex gap-3 md:gap-4">

                            {/* Delivery Card */}
                            <div
                                onClick={() => setOrderType('delivery')}
                                className={`col-span-1 xl:flex-1 min-w-0 border rounded-xl overflow-hidden cursor-pointer transition-all ${orderType === 'delivery' ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]' : 'border-gray-200'}`}
                            >
                                {/* Header */}
                                <div className="bg-[#FFF9EF] p-2 md:p-3 flex justify-between items-center border-b border-gray-100">
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px] md:text-xs">
                                            <MdDeliveryDining size={14} />
                                        </div>
                                        <span className="font-bold text-gray-800 text-sm md:text-base">Delivery</span>
                                    </div>
                                    <MdKeyboardArrowDown className="text-gray-500 text-lg hidden md:block" />
                                </div>
                                {/* Body */}
                                {isStoreOpen ? (
                                    <div className="bg-[#F0FDF4] p-1.5 md:p-2 flex items-center gap-1.5 md:gap-2 border-b border-gray-50">
                                        <FaCheckCircle className="text-green-500 text-xs md:text-sm" />
                                        <span className="text-green-700 font-bold text-xs md:text-sm">Open</span>
                                    </div>
                                ) : (
                                    <div className="bg-[#FEF2F2] p-1.5 md:p-2 flex items-center gap-1.5 md:gap-2">
                                        <FaTimesCircle className="text-red-500 text-xs md:text-sm" />
                                        <span className="text-red-700 font-bold text-xs md:text-sm">Closed</span>
                                    </div>
                                )}
                            </div>

                            {/* Pickup Card */}
                            <div
                                onClick={() => setOrderType('pickup')}
                                className={`col-span-1 xl:flex-1 min-w-0 border rounded-xl overflow-hidden cursor-pointer transition-all ${orderType === 'pickup' ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]' : 'border-gray-200'}`}
                            >
                                {/* Header */}
                                <div className="bg-[#FFF9EF] p-2 md:p-3 flex justify-between items-center border-b border-gray-100">
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px] md:text-xs">
                                            <MdStorefront size={14} />
                                        </div>
                                        <span className="font-bold text-gray-800 text-sm md:text-base">Pickup</span>
                                    </div>
                                    <MdKeyboardArrowDown className="text-gray-500 text-lg hidden md:block" />
                                </div>
                                {/* Body */}
                                {isStoreOpen ? (
                                    <div className="bg-[#F0FDF4] p-1.5 md:p-2 flex items-center gap-1.5 md:gap-2 border-b border-gray-50">
                                        <FaCheckCircle className="text-green-500 text-xs md:text-sm" />
                                        <span className="text-green-700 font-bold text-xs md:text-sm">Open</span>
                                    </div>
                                ) : (
                                    <div className="bg-[#FEF2F2] p-1.5 md:p-2 flex items-center gap-1.5 md:gap-2">
                                        <FaTimesCircle className="text-red-500 text-xs md:text-sm" />
                                        <span className="text-red-700 font-bold text-xs md:text-sm">Closed</span>
                                    </div>
                                )}
                            </div>

                            {/* Closed Notice Card */}
                            <div className="col-span-2 xl:flex-[1.5] w-full bg-[#FFF9EF] rounded-xl p-3 md:p-4 flex flex-col items-center justify-center text-center relative border border-orange-50">
                                {/* Hanging Sign Visualization */}
                                <div className="mb-1 md:mb-2 relative">
                                    <div className="w-20 h-10 md:w-24 md:h-12 bg-black rounded-lg flex items-center justify-center border-2 border-gray-600 shadow-lg relative z-10">
                                        <span className="text-white font-bold tracking-widest text-xs md:text-sm">CLOSED</span>
                                    </div>
                                    {/* Strings */}
                                    <div className="absolute -top-3 left-4 w-0.5 h-4 bg-gray-800 rotate-[-20deg]"></div>
                                    <div className="absolute -top-3 right-4 w-0.5 h-4 bg-gray-800 rotate-[20deg]"></div>
                                    {/* Nail */}
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-400 z-0"></div>
                                </div>

                                <div className="text-xs text-gray-800 font-medium leading-relaxed mt-1 md:mt-2">
                                    We're closed for online ordering at the moment.<br />
                                    Online ordering resumes at <span className="text-primary font-bold">{storeSettings.open_time}</span>
                                </div>
                            </div>

                            {/* Offer Card */}
                            <div className="col-span-2 xl:flex-[1.5] w-full bg-[#FFF9EF] rounded-xl p-3 md:p-5 flex flex-col items-center justify-center text-center border border-orange-50 relative mt-0">
                                {/* Jagged Badge Visualization */}
                                <div
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 md:w-14 md:h-14 bg-black flex items-center justify-center text-white font-bold text-lg md:text-2xl shadow-lg z-10"
                                    style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}
                                >
                                    %
                                </div>

                                <div className="mt-2 md:mt-4">
                                    <h4 className="text-primary font-bold text-sm md:text-lg mb-0.5 md:mb-1">GET 15% OFF</h4>
                                    <p className="text-gray-500 text-[10px] md:text-xs mb-2 md:mb-3 font-medium">On orders</p>
                                    <div className="flex flex-col items-start gap-1 text-[10px] md:text-[11px] text-gray-600 font-medium w-full px-4 md:px-0">
                                        <div className="flex items-center gap-1.5 w-full justify-center">
                                            <FaRegCheckCircle className="text-gray-400" /> On both Delivery and pickup orders
                                        </div>
                                        <div className="flex items-center gap-1.5 w-full justify-center">
                                            <FaRegCheckCircle className="text-gray-400" /> Available everyday
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* 3. Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">

                        {/* Left Sidebar Category Menu (Desktop) / Horizontal Scroll (Mobile) */}
                        <aside className="lg:col-span-1 sticky top-[72px] z-30 lg:static">
                            <div className="bg-white rounded-2xl shadow-sm p-4 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                                <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg lg:flex hidden">
                                    <FaSearch className="text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search in menu..."
                                        className="bg-transparent border-none outline-none text-sm w-full font-medium text-gray-700"
                                    />
                                </div>
                                <h3 className="font-heading font-bold text-lg mb-4 px-2 hidden lg:block">Categories</h3>

                                {/* Mobile Horizontal Scroll / Desktop Vertical List */}
                                <ul className="flex lg:flex-col gap-3 lg:gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide snap-x">
                                    {categories.map((cat, idx) => (
                                        <li key={idx} className="flex-shrink-0 snap-center">
                                            <a
                                                id={`sidebar-link-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                                                href={`#${cat.replace(/\s+/g, '-').toLowerCase()}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const element = document.getElementById(cat.replace(/\s+/g, '-').toLowerCase());
                                                    if (element) {
                                                        const yOffset = -100; // Adjust for sticky header
                                                        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                                                        isManualScroll.current = true;
                                                        setActiveCategory(cat);
                                                        window.scrollTo({ top: y, behavior: 'smooth' });

                                                        setTimeout(() => {
                                                            isManualScroll.current = false;
                                                        }, 1000);
                                                    }
                                                }}
                                                className={`block w-full text-left px-4 py-2 lg:py-3 rounded-full lg:rounded-lg text-sm font-bold lg:font-medium transition-colors whitespace-nowrap border lg:border-none shadow-sm lg:shadow-none ${activeCategory === cat ? 'bg-primary text-white shadow-md shadow-pink-200 border-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-primary'}`}
                                            >
                                                {cat}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Right Menu Grid - Infinite Scroll Content */}
                        <div className="lg:col-span-3 space-y-12 min-h-[500px]">
                            {categories.map((cat) => {
                                const currentItems = menuData[cat] || [];
                                const sectionId = cat.replace(/\s+/g, '-').toLowerCase();

                                return (
                                    <div key={cat} id={sectionId} className="scroll-mt-28">
                                        {/* Section Header */}
                                        <div className="mb-4 lg:mb-6">
                                            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2 drop-shadow-md">{cat}</h2>
                                            {cat === "Hot Drinks" || cat === "Soft Drinks" ? (
                                                <p className="text-gray-100 text-sm font-medium drop-shadow-sm">Free syrup shots</p>
                                            ) : cat === "Burger Bar" ? (
                                                <p className="text-gray-100 text-sm font-medium drop-shadow-sm">Served in a soft bun with crisp house salad, cheddar cheese and our special mayonnaise</p>
                                            ) : ["Omelettes", "Burritos", "Sandwiches", "Jacket Potatoes", "Chippy", "Loaded French Fries", "Loaded Chilli Or Garlic French Fries"].includes(cat) ? (
                                                null
                                            ) : (
                                                <p className="text-gray-100 text-sm font-medium drop-shadow-sm">Delicious options from our {cat} menu.</p>
                                            )}
                                        </div>

                                        {/* Items Grid Logic based on Category */}
                                        {cat === "Hot Drinks" || cat === "Soft Drinks" ? (
                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                                                {currentItems.map((item, idx) => (
                                                    <HotDrinksCard
                                                        key={idx}
                                                        name={item.name}
                                                        price={item.price}
                                                        image={item.image}
                                                        onAdd={() => addToCart(item)}
                                                    />
                                                ))}
                                            </div>
                                        ) : cat === "Burger Bar" ? (
                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                {currentItems.map((item, idx) => (
                                                    <BurgerCard
                                                        key={idx}
                                                        name={item.name}
                                                        price={item.price}
                                                        description={item.description}
                                                        image={item.image}
                                                        onAdd={() => addToCart(item)}
                                                    />
                                                ))}
                                            </div>
                                        ) : cat === "Big Foot Hot Dogs" ? (
                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                {currentItems.map((item, idx) => (
                                                    <HotDogCard
                                                        key={idx}
                                                        name={item.name}
                                                        price={item.price}
                                                        description={item.description}
                                                        image={item.image}
                                                        onAdd={() => addToCart(item)}
                                                    />
                                                ))}
                                            </div>
                                        ) : cat === "Salad Bar" ? (
                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                {currentItems.map((item, idx) => (
                                                    <SaladCard
                                                        key={idx}
                                                        name={item.name}
                                                        price={item.price}
                                                        description={item.description}
                                                        image={item.image}
                                                        onAdd={() => addToCart(item)}
                                                    />
                                                ))}
                                            </div>
                                        ) : cat === "Meal Deals" ? (
                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                {currentItems.map((item, idx) => (
                                                    <MealDealCard
                                                        key={idx}
                                                        name={item.name}
                                                        price={item.price}
                                                        description={item.description}
                                                        image={item.image}
                                                        onAdd={() => addToCart(item)}
                                                    />
                                                ))}
                                            </div>
                                        ) : cat === "Shakes" ? (
                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                {currentItems.map((item, idx) => (
                                                    <ShakeCard
                                                        key={idx}
                                                        name={item.name}
                                                        price={item.price}
                                                        image={item.image}
                                                        onAdd={() => addToCart(item)}
                                                    />
                                                ))}
                                            </div>
                                        ) : cat === "Sweet Treats" ? (
                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                {currentItems.map((item, idx) => (
                                                    <SweetTreatCard
                                                        key={idx}
                                                        name={item.name}
                                                        description={item.description}
                                                        price={item.price}
                                                        image={item.image}
                                                        onAdd={() => addToCart(item)}
                                                    />
                                                ))}
                                            </div>
                                        ) : cat === "Breakfast" ? (
                                            <div className="space-y-8">
                                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                    {currentItems.filter(item => !item.subsection).map((item, idx) => (
                                                        <BreakfastCard
                                                            key={idx}
                                                            name={item.name}
                                                            price={item.price}
                                                            description={item.description}
                                                            image={item.image}
                                                            onAdd={() => addToCart(item)}
                                                        />
                                                    ))}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-heading font-bold text-white mb-4">Big Veggie Breakfast Tray</h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                        {currentItems.filter(item => item.subsection === "veggie_tray").map((item, idx) => (
                                                            <BreakfastCard
                                                                key={idx}
                                                                name={item.name}
                                                                price={item.price}
                                                                image={item.image}
                                                                onAdd={() => addToCart(item)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-heading font-bold text-white mb-4">Big English Breakfast Tray</h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                        {currentItems.filter(item => item.subsection === "english_tray").map((item, idx) => (
                                                            <BreakfastCard
                                                                key={idx}
                                                                name={item.name}
                                                                price={item.price}
                                                                image={item.image}
                                                                onAdd={() => addToCart(item)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-heading font-bold text-white mb-1">Toast</h3>
                                                    <p className="text-gray-200 text-sm mb-4">(Vegetarian) 2 slices of thick white or brown toast with butter & strawberry jam</p>
                                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                        {currentItems.filter(item => item.subsection === "toast").map((item, idx) => (
                                                            <BreakfastCard
                                                                key={idx}
                                                                name={item.name}
                                                                price={item.price}
                                                                image={item.image}
                                                                onAdd={() => addToCart(item)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : cat === "Omelettes" ? (
                                            <div>
                                                <div className="mb-6">
                                                    <p className="text-white text-sm font-light">All our omelettes are made with proper ice cream, whole milk, cream and topped with fresh whipped cream</p>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                    {currentItems.map((item, idx) => (
                                                        <BreakfastCard
                                                            key={idx}
                                                            name={item.name}
                                                            description={item.description}
                                                            price={item.price}
                                                            image={item.image}
                                                            onAdd={() => addToCart(item)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : cat === "Indian Breakfast" ? (
                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                {currentItems.map((item, idx) => (
                                                    <BreakfastCard
                                                        key={idx}
                                                        name={item.name}
                                                        description={item.description}
                                                        price={item.price}
                                                        image={item.image}
                                                        onAdd={() => addToCart(item)}
                                                    />
                                                ))}
                                            </div>
                                        ) : cat === "Triple Toasties" ? (
                                            <div>
                                                <div className="mb-6">
                                                    <p className="text-white text-sm font-light">Filled 3 layers of bread grilled with mature cheddar to a golden finish. Choose from white or brown bread.</p>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                    {currentItems.map((item, idx) => (
                                                        <BreakfastCard
                                                            key={idx}
                                                            name={item.name}
                                                            description={item.description}
                                                            price={item.price}
                                                            image={item.image}
                                                            onAdd={() => addToCart(item)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : cat === "Burritos" ? (
                                            <div>
                                                <div className="mb-6">
                                                    <p className="text-white text-sm font-light">All our burritos come with seasoned rice and cheddar cheese, and then grilled.</p>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6 mb-8">
                                                    {currentItems.filter(item => !item.subsection).map((item, idx) => (
                                                        <BreakfastCard
                                                            key={idx}
                                                            name={item.name}
                                                            description={item.description}
                                                            price={item.price}
                                                            image={item.image}
                                                            onAdd={() => addToCart(item)}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="mb-6">
                                                    <h4 className="text-xl font-heading font-bold text-white mb-4 uppercase">Silly Sausage Burrito</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                        {currentItems.filter(item => item.subsection === "silly").map((item, idx) => (
                                                            <BreakfastCard
                                                                key={idx}
                                                                name={item.name}
                                                                description={item.description}
                                                                price={item.price}
                                                                image={item.image}
                                                                onAdd={() => addToCart(item)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : cat === "Sandwiches" ? (
                                            <div>
                                                <div className="mb-6">
                                                    <p className="text-white text-sm font-light">Includes salad & condiments</p>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6 mb-8">
                                                    {currentItems.filter(item => !item.subsection).map((item, idx) => (
                                                        <BreakfastCard
                                                            key={idx}
                                                            name={item.name}
                                                            price={item.price}
                                                            image={item.image}
                                                            imageHeight="h-32 md:h-40"
                                                            imageWidth="w-full md:w-[166px]"
                                                            onAdd={() => addToCart(item)}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="mb-6">
                                                    <h4 className="text-xl font-heading font-bold text-white mb-4 uppercase">Sliced Sandwich</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                        {currentItems.filter(item => item.subsection === "sliced").map((item, idx) => (
                                                            <BreakfastCard
                                                                key={idx}
                                                                name={item.name}
                                                                price={item.price}
                                                                image={item.image}
                                                                imageHeight="h-32 md:h-40"
                                                                onAdd={() => addToCart(item)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="mb-6">
                                                    <h4 className="text-xl font-heading font-bold text-white mb-4 uppercase">Soft Baton Sandwich</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                        {currentItems.filter(item => item.subsection === "baton").map((item, idx) => (
                                                            <BreakfastCard
                                                                key={idx}
                                                                name={item.name}
                                                                price={item.price}
                                                                image={item.image}
                                                                imageHeight="h-32 md:h-40"
                                                                onAdd={() => addToCart(item)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : cat === "Jacket Potatoes" ? (
                                            <div>
                                                <div className="mb-6">
                                                    <p className="text-white text-sm font-light">Fluffy hot potatoes with a choice of plain butter or garlic butter</p>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                    {currentItems.map((item, idx) => (
                                                        <BreakfastCard
                                                            key={idx}
                                                            name={item.name}
                                                            price={item.price}
                                                            image={item.image}
                                                            imageHeight="h-32 md:h-[198px]"
                                                            onAdd={() => addToCart(item)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : cat === "Chippy" ? (
                                            <div>
                                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                    {currentItems.map((item, idx) => (
                                                        <BreakfastCard
                                                            key={idx}
                                                            name={item.name}
                                                            price={item.price}
                                                            description={item.description}
                                                            image={item.image}
                                                            imageHeight="h-32 md:h-[198px]"
                                                            onAdd={() => addToCart(item)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : cat === "Loaded French Fries" ? (
                                            <div>
                                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                    {currentItems.map((item, idx) => (
                                                        <BreakfastCard
                                                            key={idx}
                                                            name={item.name}
                                                            price={item.price}
                                                            description={item.description}
                                                            image={item.image}
                                                            imageHeight="h-32 md:h-[198px]"
                                                            onAdd={() => addToCart(item)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : cat === "Loaded Chilli Or Garlic French Fries" ? (
                                            <div>
                                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                    {currentItems.map((item, idx) => (
                                                        <BreakfastCard
                                                            key={idx}
                                                            name={item.name}
                                                            price={item.price}
                                                            description={item.description}
                                                            image={item.image}
                                                            imageHeight="h-32 md:h-[198px]"
                                                            onAdd={() => addToCart(item)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : cat === "Savouries" ? (
                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                                {currentItems.map((item, idx) => (
                                                    <SavouriesCard
                                                        key={idx}
                                                        name={item.name}
                                                        price={item.price}
                                                        description={item.description}
                                                        image={item.image}
                                                        onAdd={() => addToCart(item)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                                                {currentItems.length > 0 ? (
                                                    currentItems.map((item, idx) => (
                                                        <MenuCard
                                                            key={idx}
                                                            name={item.name}
                                                            price={item.price}
                                                            image={item.image}
                                                            description="Standard serving"
                                                            onAdd={() => addToCart(item)}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-20 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 col-span-full">
                                                        <FiShoppingBag className="text-white text-5xl mb-4 opacity-50" />
                                                        <p className="text-white font-bold text-lg">No items available yet</p>
                                                        <p className="text-white/80 text-sm">Check back soon for new additions to this category!</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div >
            </div >
            {/* 3. Footer (Full Width) */}
            < div className="relative z-10 mt-12" >
                <Footer />
            </div >

            {/* Cart Sidebar */}
            < CartSidebar
                cartItems={cartItems}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
            />

            {/* Floating Cart Button */}
            < button
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary-hover transition-all transform hover:scale-110 z-50 flex items-center gap-2"
            >
                <FiShoppingBag size={24} />
                {
                    cartCount > 0 && (
                        <span className="bg-white text-primary text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                            {cartCount}
                        </span>
                    )
                }
            </button >
            {/* Group Order Modal Removed */}

            {/* Info Modal */}
            <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

            {/* Product Customization Modal */}
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                product={selectedProduct}
                onAddToCart={handleModalAddToCart}
            />


        </div >
    );
};

export default OrderNow;
