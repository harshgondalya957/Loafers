import React, { useEffect, useState } from 'react';
import { FaChartBar, FaShoppingCart, FaRupeeSign, FaUsers, FaArrowRight, FaBoxOpen, FaClipboardCheck, FaMotorcycle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        activeOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, activeRes, customersRes, ridersRes] = await Promise.all([
                fetch('https://loafers-backend-2.onrender.com/api/admin/reports/orders?type=date'),
                fetch('https://loafers-backend-2.onrender.com/api/store/orders/active'),
                fetch('https://loafers-backend-2.onrender.com/api/admin/customers'),
                fetch('https://loafers-backend-2.onrender.com/api/store/riders')
            ]);

            if (ordersRes.ok && activeRes.ok && customersRes.ok) {
                const orders = await ordersRes.json();
                const active = await activeRes.json();
                const customers = await customersRes.json();
                const ridersList = ridersRes.ok ? await ridersRes.json() : [];

                setRiders(ridersList);

                const today = new Date().toISOString().split('T')[0];
                const todayStats = orders.find(o => o.period === today) || { total_orders: 0, total_revenue: 0 };

                setStats({
                    totalOrders: todayStats.total_orders || 0,
                    activeOrders: active.length,
                    totalRevenue: todayStats.total_revenue || 0,
                    totalCustomers: customers.length
                });
                setRecentOrders(active.slice(0, 10)); // Show top 10
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await fetch(`https://loafers-backend-2.onrender.com/api/store/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchDashboardData();
        } catch (error) {
            console.error(error);
        }
    };

    const assignRider = async (orderId, riderId) => {
        try {
            // Backend expects { status, rider_id } or just rider_id if handled?
            // checking storeController: updateOrderStatus uses body { status, rider_id }
            // If I just want to assign rider, I should keep current status or update it.
            // Let's assume we keep status 'preparing' or 'ready' but assign rider.
            // Or usually assigning rider implies 'out for delivery' or separate step?
            // Does updateOrderStatus allow passing rider_id WITHOUT changing status?
            // Controller: "UPDATE orders SET status = ?, rider_id = ? WHERE id = ?"
            // It REQUIRES status.

            // So I need to find the current status of the order to send it back, or update status to 'delivery' when assigning rider?
            // Let's update status to 'delivery' automatically if assigning rider? Or asking user?
            // Safer: Get current status from recentOrders list.
            const order = recentOrders.find(o => o.id === orderId);
            const currentStatus = order ? order.status : 'pending';

            await fetch(`https://loafers-backend-2.onrender.com/api/store/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: currentStatus, rider_id: riderId })
            });
            fetchDashboardData();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full text-pink-500 font-bold">Loading Dashboard...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-heading font-bold text-primary tracking-tighter">Store Dashboard</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-50 flex items-center justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Today's Orders</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalOrders}</h3>
                    </div>
                    <div className="bg-pink-100 p-4 rounded-full text-primary">
                        <FaShoppingCart size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-50 flex items-center justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Active Orders</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.activeOrders}</h3>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
                        <FaClipboardCheck size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-50 flex items-center justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Today's Revenue</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">£{stats.totalRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="bg-green-100 p-4 rounded-full text-green-600">
                        <FaRupeeSign size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-50 flex items-center justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Customers</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalCustomers}</h3>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                        <FaUsers size={24} />
                    </div>
                </div>
            </div>

            {/* Active Orders List */}
            <div className="bg-white rounded-3xl shadow-xl border border-pink-50 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        Active Orders
                    </h3>
                    <Link to="/admin/orders" className="text-primary font-bold hover:underline hover:scale-105 transition-transform flex items-center">
                        View All <FaArrowRight className="ml-2" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest rounded-l-lg">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Rider</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-primary/5 hover:scale-[1.005] transition-all duration-200 cursor-pointer bg-white">
                                    <td className="px-6 py-4 font-bold text-gray-600">#{order.id}</td>
                                    <td className="px-6 py-4 text-gray-800 font-bold">{order.customer_name || 'Guest'}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wide border border-gray-200">
                                            {order.order_type || 'Delivery'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-primary">£{order.total_amount?.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        {/* Rider Dropdown */}
                                        <div className="flex items-center gap-2">
                                            <FaMotorcycle className="text-gray-400" />
                                            <select
                                                value={order.rider_id || ''}
                                                onChange={(e) => assignRider(order.id, e.target.value)}
                                                className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg block w-full p-2.5 focus:ring-primary focus:border-primary font-bold"
                                            >
                                                <option value="">Select Rider</option>
                                                {riders.map(r => (
                                                    <option key={r.id} value={r.id} disabled={r.status !== 'available' && r.id !== order.rider_id}>
                                                        {r.name} ({r.status})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status || 'pending'}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer
                                                ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'}`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="preparing">Preparing</option>
                                            <option value="ready">Ready</option>
                                            <option value="delivery">Out for Delivery</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link to="/admin/orders" className="text-gray-400 hover:text-primary transition-colors">
                                            <FaBoxOpen size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400 font-bold">No active orders right now.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

