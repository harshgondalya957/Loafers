import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCreditCard, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaShoppingBag, FaTruck, FaEnvelope, FaMoneyBillWave, FaCheckCircle, FaStore } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { processCloverPayment, tokenizeCard } from '../services/cloverService';
import { useLocationContext } from '../context/LocationContext';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch cart from state or local storage
    const getStoredCart = () => {
        try {
            const stored = localStorage.getItem('cartItems');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Failed to parse cart items:", e);
            return [];
        }
    };

    const cartItems = location.state?.cartItems || getStoredCart();
    const initialServiceType = location.state?.serviceType || 'delivery';

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05; // Assuming 5% tax mock for demonstration

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { selectedLocation } = useLocationContext();

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [upiId, setUpiId] = useState('');
    const [isUpiVerified, setIsUpiVerified] = useState(false);
    const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);

    const [customer, setCustomer] = useState({
        name: location.state?.customerDetails?.name || '',
        email: location.state?.customerDetails?.email || '',
        phone: location.state?.customerDetails?.phone || '',
        address: location.state?.customerDetails?.address || '',
        serviceType: initialServiceType
    });

    const [card, setCard] = useState({
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const deliveryFee = customer.serviceType === 'delivery' ? 2.50 : 0;
    const finalTotal = subtotal + tax + deliveryFee;

    const handleCustomerChange = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });
    const handleCardChange = (e) => setCard({ ...card, [e.target.name]: e.target.value });

    // Format Card Number (adds spaces every 4 digits)
    const handleCardNumber = (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
        setCard({ ...card, cardNumber: formatted.substring(0, 19) }); // Max 16 digits + 3 spaces
    };

    // Format Expiry (MM/YY)
    const handleExpiry = (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (value.length >= 2 && !value.includes('/')) {
            value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
        }
        setCard({ ...card, expiry: value.substring(0, 5) });
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

    const handlePayment = async (e) => {
        e.preventDefault();
        setError('');

        if (cartItems.length === 0) return setError('Your cart is empty.');
        // Form validations
        if (!customer.name || !customer.phone || !customer.email || !customer.address) return setError('Please fill out all personal details (Name, Email, Phone, Address).');

        if (paymentMethod === 'card') {
            if (card.cardNumber.length < 16) return setError('Please enter a valid card number.');
            if (card.expiry.length < 5) return setError('Please enter a valid expiry date (MM/YY).');
            if (card.cvv.length < 3) return setError('Please enter a valid security code (CVV).');
        } else if (paymentMethod === 'upi') {
            if (!isUpiVerified) return setError('Please verify your UPI ID first.');
        }

        setLoading(true);

        try {
            let cloverOrderId = null;

            if (paymentMethod === 'card') {
                // Step 1: Securely Tokenize via Clover Service Layer
                const { token } = await tokenizeCard(card);

                // Step 2: Route Payment & Order Creation Payload to Backend
                const response = await processCloverPayment({
                    customer,
                    items: cartItems,
                    amount: finalTotal.toFixed(2),
                    sourceToken: token
                });

                if (!response.success) {
                    navigate('/payment-failure', { state: { message: response.message || 'Payment engine rejected the transaction.' } });
                    return;
                }
                cloverOrderId = response.orderId;
            }

            // Create Order on our backend
            const orderData = {
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                store_id: selectedLocation ? selectedLocation.id : 1,
                total_amount: finalTotal,
                items: cartItems.map(item => ({
                    id: item.id || 0,
                    name: item.name,
                    price: parseFloat(item.price),
                    quantity: item.quantity
                })),
                order_type: customer.serviceType,
                payment_method: paymentMethod,
                delivery_address: customer.address,
                scheduled_time: 'ASAP',
                clover_order_id: cloverOrderId
            };

            const backendRes = await fetch('https://loafers-backend-2.onrender.com/api/shop/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (backendRes.ok) {
                const data = await backendRes.json();
                localStorage.removeItem('cartItems'); // clear cart
                navigate('/payment-success', { state: { orderId: data._id || data.id || cloverOrderId || 'Success' } });
            } else {
                const errorData = await backendRes.json();
                setError(errorData.error || 'Failed to place order.');
            }

        } catch (err) {
            setError(err.message || 'An error occurred during order processing.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-body flex flex-col">
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 md:py-12">

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-500 mt-2">Complete your order securely using Clover.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* 1. Delivery Method */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                Service Type
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setCustomer({ ...customer, serviceType: 'delivery' })}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${customer.serviceType === 'delivery' ? 'border-primary bg-pink-50 text-primary' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                                >
                                    <FaTruck className="text-2xl" />
                                    <span className="font-bold">Delivery</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCustomer({ ...customer, serviceType: 'pickup' })}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${customer.serviceType === 'pickup' ? 'border-primary bg-pink-50 text-primary' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                                >
                                    <FaShoppingBag className="text-2xl" />
                                    <span className="font-bold">Pickup</span>
                                </button>
                            </div>
                        </div>

                        {/* 2. Customer Details */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                Your Details
                            </h2>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="text" name="name" value={customer.name} onChange={handleCustomerChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 font-medium" placeholder="John Doe" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="tel" name="phone" value={customer.phone} onChange={handleCustomerChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 font-medium" placeholder="+44 7700 900000" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="animate-fade-in-down">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="email" name="email" value={customer.email} onChange={handleCustomerChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 font-medium" placeholder="you@example.com" />
                                        </div>
                                    </div>
                                    <div className="animate-fade-in-down">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Address</label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />
                                            <textarea name="address" value={customer.address} onChange={handleCustomerChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 resize-none h-24 font-medium" placeholder="House number, Street, City, Postcode"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Payment Details */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold font-heading mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                    Payment Method
                                </div>
                            </h2>

                            {error && (
                                <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium mb-4 text-center border border-red-100 animate-pulse">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Card Option */}
                                <div
                                    onClick={() => setPaymentMethod('card')}
                                    className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-3 transition-all ${paymentMethod === 'card' ? 'border-primary bg-pink-50 ring-1 ring-primary' : 'border-gray-200 hover:border-pink-300'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-gray-300'}`}>
                                            {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                        </div>
                                        <FaCreditCard className="text-primary" size={20} />
                                        <span className="font-bold text-gray-700">Credit / Debit Card (Clover)</span>
                                    </div>

                                    {/* Card Details Expansion */}
                                    {paymentMethod === 'card' && (
                                        <div className="pl-9 animate-fade-in-down w-full space-y-4 pt-2">
                                            <div>
                                                <div className="relative">
                                                    <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="0000 0000 0000 0000"
                                                        value={card.cardNumber}
                                                        onChange={handleCardNumber}
                                                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 font-mono tracking-widest text-lg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        value={card.expiry}
                                                        onChange={handleExpiry}
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 font-mono text-center tracking-widest text-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="password"
                                                        placeholder="CVC"
                                                        maxLength={4}
                                                        value={card.cvv}
                                                        name="cvv"
                                                        onChange={handleCardChange}
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 font-mono text-center tracking-[0.3em] text-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* UPI Option */}
                                <div
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-3 transition-all ${paymentMethod === 'upi' ? 'border-primary bg-pink-50 ring-1 ring-primary' : 'border-gray-200 hover:border-pink-300'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary' : 'border-gray-300'}`}>
                                            {paymentMethod === 'upi' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                        </div>
                                        <FaMoneyBillWave className="text-primary" size={20} />
                                        <span className="font-bold text-gray-700">UPI Payment</span>
                                    </div>

                                    {/* UPI Expansion */}
                                    {paymentMethod === 'upi' && (
                                        <div className="pl-9 animate-fade-in-down w-full pt-2">
                                            <p className="text-xs text-gray-500 mb-2">Complete payment using your UPI app.</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="example@upi"
                                                    className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                                    value={upiId}
                                                    onChange={(e) => setUpiId(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyUpi}
                                                    disabled={isUpiVerified || isVerifyingUpi}
                                                    className={`px-5 py-3 rounded-xl text-sm font-bold text-white transition-all ${isUpiVerified ? 'bg-green-500' : 'bg-gray-800 hover:bg-black'}`}
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

                                {/* Cash on Delivery Option */}
                                <div
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-3 transition-all ${paymentMethod === 'cash' ? 'border-primary bg-pink-50 ring-1 ring-primary' : 'border-gray-200 hover:border-pink-300'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cash' ? 'border-primary' : 'border-gray-300'}`}>
                                            {paymentMethod === 'cash' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                        </div>
                                        <FaMoneyBillWave className="text-primary" size={20} />
                                        <span className="font-bold text-gray-700">{customer.serviceType === 'delivery' ? 'Cash on Delivery' : 'Pay at pickup'}</span>
                                    </div>
                                    {paymentMethod === 'cash' && (
                                        <div className="pl-9 animate-fade-in-down w-full pt-2">
                                            <div className="bg-gray-100 text-gray-700 text-xs p-3 rounded-xl flex gap-2 items-start font-medium">
                                                <FaStore className="mt-0.5 flex-shrink-0" />
                                                {customer.serviceType === 'delivery'
                                                    ? 'You will pay in cash at the time of delivery. Please keep exact change ready.'
                                                    : 'You will pay at the store when you pick up your order.'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={
                                    loading ||
                                    (paymentMethod === 'card' && (!card.cardNumber || !card.expiry || !card.cvv)) ||
                                    (paymentMethod === 'upi' && !isUpiVerified)
                                }
                                className="w-full mt-8 bg-primary text-white font-bold py-4 rounded-xl shadow-[0_8px_16px_rgba(244,63,151,0.2)] hover:bg-primary-hover hover:-translate-y-1 transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing Order...
                                    </>
                                ) : (
                                    <>
                                        Complete Order <span className="text-pink-200">|</span> £{finalTotal.toFixed(2)}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-6">
                            <h2 className="text-xl font-bold font-heading mb-6 border-b border-gray-100 pb-4">Order Summary</h2>

                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start">
                                        <div className="flex gap-3 items-center">
                                            <span className="font-bold text-gray-400 bg-gray-50 rounded px-1">{item.quantity}x</span>
                                            {item.image && (
                                                <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-900 whitespace-nowrap">£{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-dashed border-gray-200 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-800">£{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Tax (5%)</span>
                                    <span className="font-medium text-gray-800">£{tax.toFixed(2)}</span>
                                </div>
                                {customer.serviceType === 'delivery' && (
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Delivery Fee</span>
                                        <span className="font-medium text-gray-800">£{deliveryFee.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Due</p>
                                    <p className="text-4xl font-heading font-bold text-primary">£{finalTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentPage;
