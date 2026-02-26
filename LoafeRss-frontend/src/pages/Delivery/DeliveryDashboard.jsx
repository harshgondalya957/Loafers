import React, { useState, useEffect } from 'react';
import {
    FaMotorcycle,
    FaClipboardList,
    FaClock,
    FaMapMarkerAlt,
    FaCheck,
    FaSpinner,
    FaArrowRight
} from 'react-icons/fa';
import { Link, useOutletContext } from 'react-router-dom';

const DeliveryDashboard = () => {
    const { rider } = useOutletContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (rider) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 10000); // Poll every 10s
            return () => clearInterval(interval);
        }
    }, [rider]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`https://loafers.onrender.com/api/delivery/orders/${rider.id}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'preparing': return 'bg-blue-100 text-blue-700';
            case 'ready': return 'bg-green-100 text-green-700';
            case 'delivery': return 'bg-indigo-100 text-indigo-700';
            case 'completed': return 'bg-gray-100 text-gray-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Waiting Store';
            case 'preparing': return 'Preparing';
            case 'ready': return 'Ready to Pickup';
            case 'delivery': return 'On The Way';
            case 'completed': return 'Delivered';
            default: return status;
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-heading font-extrabold text-[#F43F97] tracking-tight mb-6 flex items-center justify-between">
                <span>My Tasks ({orders.length})</span>
                <span className="text-sm font-bold text-gray-400 font-sans tracking-wide uppercase">Live Updates</span>
            </h2>

            {loading ? (
                <div className="flex justify-center py-10 text-gray-400 animate-pulse">
                    <FaSpinner className="animate-spin" size={24} />
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-16 px-6">
                    <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <FaClipboardList size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700">No Active Tasks</h3>
                    <p className="text-sm text-gray-500 mt-2">You don't have any assigned deliveries right now. Enjoy your break!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <Link
                            to={`/delivery/order/${order.id}`}
                            key={order.id}
                            className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group border border-gray-100"
                        >
                            {/* Status Stripe */}
                            <div className={`absolute top-0 left-0 w-2 h-full ${order.status === 'pending' ? 'bg-yellow-400' : order.status === 'ready' ? 'bg-green-500' : 'bg-primary'}`}></div>

                            <div className="p-6 pl-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 block">Order #{order.id}</span>
                                        <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">{order.customer_name}</h3>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        order.status === 'ready' ? 'bg-green-100 text-green-700' :
                                            'bg-pink-50 text-pink-600'
                                        }`}>
                                        {order.status === 'pending' ? 'WAITING STORE' : getStatusText(order.status)}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-6 flex justify-center">
                                            <FaMapMarkerAlt className="text-[#F43F97]" size={16} />
                                        </div>
                                        <span className="text-gray-600 font-bold text-base leading-relaxed bg-gray-50 p-2 rounded-lg -ml-2 -mt-1 w-full border border-gray-100">
                                            {order.delivery_address || 'No address provided'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 pl-1 text-sm text-gray-500 font-bold mt-2">
                                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                            <FaClock className="text-gray-400" />
                                            <span>{new Date(order.order_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span className="uppercase">{order.payment_method || 'Cash'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <span className="text-[#F43F97] font-bold text-sm tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all">
                                        View Details <FaArrowRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeliveryDashboard;
