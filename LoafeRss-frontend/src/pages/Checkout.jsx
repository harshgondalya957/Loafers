import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaStore, FaMotorcycle, FaWalking, FaTags, FaChevronRight, FaEnvelope } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLocationContext } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const { currentUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems = [], subtotal = 0, deliveryFee: initialDeliveryFee = 0, total: initialTotal = 0 } = location.state || {};
    const { selectedLocation, setLocation: setStoreLocation } = useLocationContext();

    const [formData, setFormData] = useState({
        name: currentUser?.displayName || '',
        email: currentUser?.email || '',
        phone: '',
        address: '',
        postcode: '',
        instructions: ''
    });

    // Payment & Order State
    const [orderType, setOrderType] = useState('delivery'); // delivery | pickup
    const [paymentMethod, setPaymentMethod] = useState(''); // card | cash | upi
    const [upiId, setUpiId] = useState('');
    const [isUpiVerified, setIsUpiVerified] = useState(false);
    const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
    const [tipPercentage, setTipPercentage] = useState(0); // 0, 5, 10, 15, 'custom'
    const [customTip, setCustomTip] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // Scheduling & Store Hours
    const [storeSettings, setStoreSettings] = useState(null);
    const [isStoreOpen, setIsStoreOpen] = useState(true);
    const [deliveryTimeOption, setDeliveryTimeOption] = useState('asap'); // 'asap' | 'scheduled'
    const [scheduledTime, setScheduledTime] = useState('');

    useEffect(() => {
        // Fetch Store Settings Time Boundaries
        const fetchSettings = async () => {
            try {
                const res = await fetch('https://loafers.onrender.com/api/store/settings');
                if (res.ok) {
                    const data = await res.json();
                    setStoreSettings(data);

                    const now = new Date();
                    const currentTime = now.getHours() * 60 + now.getMinutes();

                    const openParts = (data.open_time || '09:00').split(':');
                    const closeParts = (data.close_time || '22:00').split(':');

                    const openMins = parseInt(openParts[0]) * 60 + parseInt(openParts[1]);
                    const closeMins = parseInt(closeParts[0]) * 60 + parseInt(closeParts[1]);

                    let isOpenNow = false;
                    if (closeMins > openMins) {
                        isOpenNow = currentTime >= openMins && currentTime <= closeMins;
                    } else {
                        // Past midnight
                        isOpenNow = currentTime >= openMins || currentTime <= closeMins;
                    }

                    setIsStoreOpen(isOpenNow);

                    if (!isOpenNow) {
                        setDeliveryTimeOption('scheduled');
                    }
                }
            } catch (err) {
                console.error("Failed to fetch store settings:", err);
            }
        };
        fetchSettings();
    }, []);

    // Redirect if no items
    useEffect(() => {
        if (!location.state || cartItems.length === 0) {
            // navigate('/order'); 
        }
    }, [location, cartItems, navigate]);

    // Calculations
    const currentDeliveryFee = orderType === 'pickup' ? 0 : initialDeliveryFee;

    const calculateTipAmount = () => {
        if (tipPercentage === 'custom') {
            return parseFloat(customTip) || 0;
        }
        return (subtotal * tipPercentage) / 100;
    };

    const tipAmount = calculateTipAmount();

    // Mock Discount Logic
    const discountAmount = appliedCoupon ? (subtotal * 0.1) : 0; // 10% discount check
    const serviceCharge = 1.50; // Fixed service charge

    const finalTotal = subtotal + currentDeliveryFee + serviceCharge + tipAmount - discountAmount;

    // Handlers
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = () => {
        if (couponCode.trim().toUpperCase() === 'SAVE10') {
            setAppliedCoupon({ code: 'SAVE10', discount: 10 });
        } else {
            alert('Invalid coupon code (Try SAVE10)');
        }
    };

    const handleVerifyUpi = () => {
        if (!upiId.includes('@')) {
            alert('Please enter a valid UPI ID');
            return;
        }
        setIsVerifyingUpi(true);
        setTimeout(() => {
            setIsVerifyingUpi(false);
            setIsUpiVerified(true);
        }, 1500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare order data
        // Prepare order data
        const orderData = {
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            store_id: selectedLocation ? selectedLocation.id : 1,
            total_amount: finalTotal,
            items: cartItems.map(item => ({
                id: item.id || 0,
                name: item.name,
                price: parseFloat(item.price),
                quantity: item.quantity
            })),
            order_type: orderType,
            payment_method: paymentMethod,
            delivery_address: formData.address + (formData.postcode ? ', ' + formData.postcode : ''),
            postcode: formData.postcode, // Send explicitly
            instructions: formData.instructions, // Send explicitly
            scheduled_time: deliveryTimeOption === 'scheduled' ? scheduledTime : 'ASAP'
        };

        try {
            const response = await fetch('https://loafers.onrender.com/api/shop/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Order placed:', data);

                // Clear cart from local storage
                localStorage.removeItem('cartItems');

                setIsSuccessOpen(true); // Show success modal
            } else {
                const errorData = await response.json();
                console.error('Failed to place order:', errorData);
                alert(`Order failed: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            // Wait, this catch block handles failures.
            // If fetch() throws, it is network error.
            if (error.message.includes('buffering timed out')) {
                alert('Server Connection Timeout. Please allow IP in MongoDB Atlas.');
            } else {
                alert(`System Error: ${error.message} (Is Backend Running?)`);
            }
        }
    };

    const isOrderValid = () => {
        // 0. Store Location
        if (!selectedLocation) return false;

        // 1. Common Fields
        const { name, email, phone } = formData;
        if (!name || !email || !phone) return false;

        // 2. Address (Delivery only)
        if (orderType === 'delivery') {
            const { address, postcode } = formData;
            if (!address || !postcode) return false;
        }

        // 3. Time Validation
        if (deliveryTimeOption === 'scheduled') {
            if (!scheduledTime) return false;
        }
        // Requirement: For Collection, time picker must be visible and selected.
        // If we force 'scheduled' for pickup, we check scheduledTime.
        if (orderType === 'pickup' && !scheduledTime) return false;

        // 4. Payment Method
        if (!paymentMethod) return false;
        if (paymentMethod === 'upi' && !isUpiVerified) return false;
        if (paymentMethod === 'card') {
            const { cardNumber, cardExpiry, cardCvc, cardName } = formData;
            if (!cardNumber || !cardExpiry || !cardCvc || !cardName) return false;
        }

        return true;
    };

    return (
        <div className="min-h-screen bg-gray-50 font-body text-gray-800">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Link to="/order" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#F43F97] mb-6 font-medium transition-colors">
                    <FaArrowLeft /> Back to Menu
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Checkout</h1>

                    {/* Store Location Indicator */}
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-[#F43F97]">
                            <FaStore />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Ordering From</p>
                            <p className="font-bold text-gray-900">{selectedLocation?.name || 'Select Store'}</p>
                        </div>
                        <button
                            onClick={() => setStoreLocation(null)}
                            className="ml-2 text-xs font-bold text-[#F43F97] hover:underline"
                        >
                            Change
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Delivery / Pickup Toggle */}
                        <div className="bg-gray-100 p-1.5 rounded-2xl shadow-inner flex">
                            <button
                                onClick={() => setOrderType('delivery')}
                                className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${orderType === 'delivery' ? 'bg-[#F43F97] text-white shadow-lg transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                            >
                                <FaMotorcycle size={22} /> Delivery
                            </button>
                            <button
                                onClick={() => setOrderType('pickup')}
                                className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${orderType === 'pickup' ? 'bg-[#F43F97] text-white shadow-lg transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                            >
                                <FaWalking size={20} /> Pickup
                            </button>
                        </div>

                        {/* Delivery Details Form */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
                            {/* Decorational element */}
                            <div className="absolute top-0 left-0 w-2 h-full bg-[#F43F97]"></div>

                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-800 flex items-center gap-4">
                                    <span className="w-10 h-10 rounded-full bg-pink-100 text-[#F43F97] flex items-center justify-center text-lg shadow-sm">1</span>
                                    {orderType === 'delivery' ? 'Delivery Details' : 'Pickup Details'}
                                </h2>
                                {orderType === 'delivery' && (
                                    <button className="text-sm font-bold text-[#F43F97] border-2 border-[#F43F97] px-4 py-1.5 rounded-full hover:bg-[#F43F97] hover:text-white transition-all">
                                        + Saved Address
                                    </button>
                                )}
                            </div>

                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                        <input type="text" name="name" required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-lg font-medium focus:outline-none focus:border-[#F43F97] focus:bg-white transition-all placeholder-gray-300" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                            <input type="email" name="email" required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-lg font-medium focus:outline-none focus:border-[#F43F97] focus:bg-white transition-all placeholder-gray-300" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                            <input type="tel" name="phone" required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-lg font-medium focus:outline-none focus:border-[#F43F97] focus:bg-white transition-all placeholder-gray-300" placeholder="+44 7700 900000" value={formData.phone} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>

                                {orderType === 'delivery' && (
                                    <div className="animate-fade-in-down space-y-6 pt-4 border-t border-gray-100">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Delivery Address</label>
                                            <div className="relative">
                                                <FaMapMarkerAlt className="absolute left-5 top-5 text-gray-400 text-xl" />
                                                <textarea name="address" required rows="3" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-lg font-medium focus:outline-none focus:border-[#F43F97] focus:bg-white transition-all resize-none placeholder-gray-300" placeholder="Street address, Apartment, etc." value={formData.address} onChange={handleChange}></textarea>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Postcode</label>
                                                <input type="text" name="postcode" required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-lg font-medium focus:outline-none focus:border-[#F43F97] focus:bg-white transition-all placeholder-gray-300" placeholder="M1 1AA" value={formData.postcode} onChange={handleChange} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Instructions</label>
                                                <input type="text" name="instructions" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-lg font-medium focus:outline-none focus:border-[#F43F97] focus:bg-white transition-all placeholder-gray-300" placeholder="Gate code etc." value={formData.instructions} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Scheduling Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 relative overflow-hidden mt-8">
                            <div className="absolute top-0 left-0 w-2 h-full bg-[#3B82F6]"></div>

                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-800 flex items-center gap-4">
                                    <span className="w-10 h-10 rounded-full bg-blue-100 text-[#3B82F6] flex items-center justify-center text-lg shadow-sm">2</span>
                                    {orderType === 'delivery' ? 'Delivery Time' : 'Pickup Time'}
                                </h2>
                                {!isStoreOpen && (
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200">
                                        Store Closed
                                    </span>
                                )}
                            </div>

                            {!isStoreOpen && (
                                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 rounded-r-lg">
                                    <p className="text-sm text-orange-800 font-bold">Store is currently closed. You can schedule your order for {storeSettings?.open_time || '09:00'} tomorrow.</p>
                                </div>
                            )}

                            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
                                {orderType === 'delivery' && (
                                    <button
                                        type="button"
                                        disabled={!isStoreOpen}
                                        onClick={() => setDeliveryTimeOption('asap')}
                                        className={`flex-1 py-3 rounded-xl font-bold text-base transition-all duration-300 ${!isStoreOpen ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400' : (deliveryTimeOption === 'asap' ? 'bg-white shadow-md text-[#3B82F6] transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200')}`}
                                    >
                                        Deliver ASAP
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setDeliveryTimeOption('scheduled')}
                                    className={`flex-1 py-3 rounded-xl font-bold text-base transition-all duration-300 ${deliveryTimeOption === 'scheduled' || orderType === 'pickup' || !isStoreOpen ? 'bg-white shadow-md text-[#3B82F6] transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {orderType === 'delivery' ? 'Schedule for Later' : 'Select Pickup Time'}
                                </button>
                            </div>

                            {(deliveryTimeOption === 'scheduled' || orderType === 'pickup' || !isStoreOpen) && (
                                <div className="animate-fade-in-down">
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Select Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-lg font-medium focus:outline-none focus:border-[#3B82F6] focus:bg-white transition-all text-gray-700"
                                        value={scheduledTime}
                                        min={new Date().toISOString().slice(0, 16)}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        required={orderType === 'pickup' || deliveryTimeOption === 'scheduled' || !isStoreOpen}
                                    />
                                    <p className="text-xs text-gray-500 mt-2 font-medium">Please select a time when the store is open ({storeSettings?.open_time || '09:00'} - {storeSettings?.close_time || '22:00'}).</p>
                                    {orderType === 'pickup' && !scheduledTime && (
                                        <p className="text-red-500 text-sm font-bold mt-2 ml-1">Pickup time is required.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tip Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-xl font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-pink-100 text-[#F43F97] flex items-center justify-center text-sm">3</span>
                                Add a Tip
                            </h2>
                            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                                {[0, 5, 10, 15].map((percent) => (
                                    <button
                                        key={percent}
                                        onClick={() => { setTipPercentage(percent); setCustomTip(''); }}
                                        className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm whitespace-nowrap transition-all border ${tipPercentage === percent ? 'bg-pink-50 border-[#F43F97] text-[#F43F97]' : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {percent === 0 ? 'No Tip' : `${percent}%`}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setTipPercentage('custom')}
                                    className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm whitespace-nowrap transition-all border ${tipPercentage === 'custom' ? 'bg-pink-50 border-[#F43F97] text-[#F43F97]' : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'}`}
                                >
                                    Other
                                </button>
                            </div>
                            {tipPercentage === 'custom' && (
                                <input
                                    type="number"
                                    placeholder="Enter Amount (£)"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#F43F97] transition-all"
                                    value={customTip}
                                    onChange={(e) => setCustomTip(e.target.value)}
                                />
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-xl font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-pink-100 text-[#F43F97] flex items-center justify-center text-sm">4</span>
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                {/* Card Option */}
                                <div
                                    onClick={() => setPaymentMethod('card')}
                                    className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-3 transition-all ${paymentMethod === 'card' ? 'border-[#F43F97] bg-pink-50 ring-1 ring-[#F43F97]' : 'border-gray-200 hover:border-pink-300'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#F43F97]' : 'border-gray-300'}`}>
                                            {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-[#F43F97]"></div>}
                                        </div>
                                        <FaCreditCard className="text-[#F43F97]" size={20} />
                                        <span className="font-bold text-gray-700">Credit / Debit Card</span>
                                    </div>

                                    {/* Card Details Expansion */}
                                    {paymentMethod === 'card' && (
                                        <div className="pl-9 animate-fade-in-down w-full space-y-3">
                                            <div>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    placeholder="Card Number"
                                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F43F97]"
                                                    value={formData.cardNumber || ''}
                                                    onChange={handleChange}
                                                    maxLength="19"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    name="cardExpiry"
                                                    placeholder="MM/YY"
                                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F43F97]"
                                                    value={formData.cardExpiry || ''}
                                                    onChange={handleChange}
                                                    maxLength="5"
                                                />
                                                <input
                                                    type="text"
                                                    name="cardCvc"
                                                    placeholder="CVC"
                                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F43F97]"
                                                    value={formData.cardCvc || ''}
                                                    onChange={handleChange}
                                                    maxLength="3"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                name="cardName"
                                                placeholder="Cardholder Name"
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F43F97]"
                                                value={formData.cardName || ''}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* UPI Option */}
                                <div
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-3 transition-all ${paymentMethod === 'upi' ? 'border-[#F43F97] bg-pink-50 ring-1 ring-[#F43F97]' : 'border-gray-200 hover:border-pink-300'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[#F43F97]' : 'border-gray-300'}`}>
                                            {paymentMethod === 'upi' && <div className="w-3 h-3 rounded-full bg-[#F43F97]"></div>}
                                        </div>
                                        <FaMoneyBillWave className="text-[#F43F97]" size={20} />
                                        <span className="font-bold text-gray-700">UPI Payment</span>
                                    </div>

                                    {/* UPI Expansion */}
                                    {paymentMethod === 'upi' && (
                                        <div className="pl-9 animate-fade-in-down w-full">
                                            <p className="text-xs text-gray-500 mb-2">Complete payment using your UPI app.</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="example@upi"
                                                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F43F97]"
                                                    value={upiId}
                                                    onChange={(e) => setUpiId(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyUpi}
                                                    disabled={isUpiVerified || isVerifyingUpi}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-all ${isUpiVerified ? 'bg-green-500' : 'bg-gray-800 hover:bg-black'}`}
                                                >
                                                    {isVerifyingUpi ? 'Verifying...' : isUpiVerified ? 'Verified' : 'Verify'}
                                                </button>
                                            </div>
                                            {isUpiVerified && (
                                                <div className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1">
                                                    <FaCheckCircle /> Payment Verified!
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Cash Option */}
                                <div
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-3 transition-all ${paymentMethod === 'cash' ? 'border-[#F43F97] bg-pink-50 ring-1 ring-[#F43F97]' : 'border-gray-200 hover:border-pink-300'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cash' ? 'border-[#F43F97]' : 'border-gray-300'}`}>
                                            {paymentMethod === 'cash' && <div className="w-3 h-3 rounded-full bg-[#F43F97]"></div>}
                                        </div>
                                        <FaMoneyBillWave className="text-[#F43F97]" size={20} />
                                        <span className="font-bold text-gray-700">Cash on Delivery</span>
                                    </div>
                                    {paymentMethod === 'cash' && (
                                        <div className="pl-9 animate-fade-in-down w-full">
                                            <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg flex gap-2 items-start">
                                                <FaStore className="mt-0.5 flex-shrink-0" />
                                                You will pay in cash at the time of delivery. Please keep exact change ready.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-xl font-heading font-bold text-gray-800 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            {item.image && (
                                                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-1.5 py-0.5 rounded">{item.quantity}x</span>
                                                    <span className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">£{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Section */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Promo Code</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <FaTags className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter Code"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#F43F97]"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={!!appliedCoupon}
                                        />
                                    </div>
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={!!appliedCoupon}
                                        className="bg-gray-900 text-white text-xs font-bold px-4 rounded-lg hover:bg-black disabled:opacity-50"
                                    >
                                        {appliedCoupon ? 'Applied' : 'Apply'}
                                    </button>
                                </div>
                                {appliedCoupon && <p className="text-xs text-green-600 font-bold mt-1">Code {appliedCoupon.code} applied!</p>}
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span>£{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Delivery Fee</span>
                                    <span>£{currentDeliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Service Charge</span>
                                    <span>£{serviceCharge.toFixed(2)}</span>
                                </div>
                                {tipAmount > 0 && (
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Tip</span>
                                        <span>£{tipAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600 font-bold text-sm">
                                        <span>Discount</span>
                                        <span>-£{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-8 pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span>£{finalTotal.toFixed(2)}</span>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={!isOrderValid()}
                                className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isOrderValid() ? 'bg-[#F43F97] hover:bg-[#d63383] text-white shadow-pink-200' : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}`}
                            >
                                Pay Now <span className="opacity-70">|</span> £{finalTotal.toFixed(2)}
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                By placing an order you agree to our <a href="#" className="underline">Terms</a>
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />

            {/* Success Modal */}
            {
                isSuccessOpen && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative animate-bounce-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaCheckCircle className="text-green-500 text-4xl" />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">Order Placed!</h3>
                            <p className="text-gray-600 mb-8">
                                Thank you, {formData.name.split(' ')[0]}! Your order has been received and is being prepared.
                            </p>
                            <Link
                                to="/"
                                className="block w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Checkout;

