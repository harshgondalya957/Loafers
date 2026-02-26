import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft,
    FaMapMarkedAlt,
    FaPhone,
    FaShoppingBag,
    FaCheckCircle,
    FaBox,
    FaMotorcycle,
    FaFlagCheckered
} from 'react-icons/fa';
import Footer from '../../components/Footer';

const DeliveryOrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetails();
    }, [orderId]);

    const fetchDetails = async () => {
        try {
            const res = await fetch(`https://loafers.onrender.com/api/delivery/order/${orderId}`);
            if (res.ok) setOrder(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (status) => {
        try {
            const res = await fetch(`https://loafers.onrender.com/api/delivery/order/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchDetails();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="flex justify-center h-screen items-center text-primary font-bold">Loading Order...</div>;
    if (!order) return <div className="text-center p-8 text-gray-500">Order not found.</div>;

    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.delivery_address || 'London, UK')}`;

    return (
        <div className="bg-gray-50 min-h-screen pb-20 overflow-hidden">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="text-gray-600 p-2 rounded-full hover:bg-gray-100">
                    <FaArrowLeft size={18} />
                </button>
                <h1 className="text-lg font-bold text-gray-800">Order #{order.id}</h1>
                <div className="w-8"></div> {/* Spacer */}
            </div>

            {/* Customer Info Card */}
            <div className="p-4 space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Details</h2>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{order.customer_name}</h3>
                            <a href={`tel:${order.customer_phone}`} className="flex items-center gap-2 text-primary text-sm font-bold mt-1">
                                <FaPhone size={12} /> {order.customer_phone}
                            </a>
                        </div>
                        <a href={`tel:${order.customer_phone}`} className="bg-green-100 text-green-600 p-3 rounded-full hover:bg-green-200 transition-colors">
                            <FaPhone size={18} />
                        </a>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-2">
                        <p className="text-sm font-medium text-gray-600 whitespace-pre-line leading-relaxed">
                            {order.delivery_address || 'No address provided'}
                        </p>
                    </div>

                    <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-100 transition-colors w-full"
                    >
                        <FaMapMarkedAlt /> Open Maps
                    </a>
                </div>

                {/* Map View (Embedded) */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-48 border border-gray-200">
                    <iframe
                        title="Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(order.delivery_address || 'London')}`}
                        allowFullScreen
                    ></iframe>
                    {/* Note: Google Maps Embed API requires a key. For demo, simplified link acts as main. */}
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center pointer-events-none opacity-0">
                        {/* Placeholder if embed fails or no key */}
                        <span className="text-gray-400 text-xs">Map Preview</span>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items ({order.items.length})</h2>
                    <ul className="space-y-4">
                        {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className="bg-gray-100 text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold">
                                        {item.quantity}x
                                    </span>
                                    <span className="font-bold text-gray-700 text-sm">{item.item_name}</span>
                                </div>
                                <span className="text-gray-400 font-medium text-sm">£{(item.price || 0).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-500">Total</span>
                        <span className="text-xl font-bold text-primary">£{order.total_amount?.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 flex justify-between">
                        <span className="font-bold uppercase tracking-wider">Payment</span>
                        <span className="font-bold text-gray-600">{order.payment_method || 'Cash'}</span>
                    </div>
                </div>

                {/* Status Actions */}
                <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] border-t border-gray-100 p-6 fixed bottom-0 left-0 right-0 z-20">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Status</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {order.status.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {order.status === 'assigned' && (
                            <button onClick={() => updateStatus('accepted')} className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                                <FaCheckCircle /> Accept Delivery
                            </button>
                        )}
                        {/* If status is 'pending' or 'preparing', rider waits. Often admin assigns 'ready'. 
                            Let's assume flow: assigned -> accepted -> picked_up -> on_the_way -> delivered 
                            Or simple: ready -> picked_up -> delivered
                        */}

                        {(order.status === 'ready' || order.status === 'accepted' || order.status === 'preparing') && (
                            <button onClick={() => updateStatus('delivery')} className="w-full bg-yellow-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2">
                                <FaBox /> Picked Up - Start Delivery
                            </button>
                        )}

                        {order.status === 'delivery' && (
                            <button onClick={() => updateStatus('completed')} className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                                <FaFlagCheckered /> Mark Delivered
                            </button>
                        )}
                    </div>
                </div>
                <div className="h-25"></div> {/* Spacer for fixed footer */}
            </div>
        </div>
    );
};

export default DeliveryOrderDetails;
