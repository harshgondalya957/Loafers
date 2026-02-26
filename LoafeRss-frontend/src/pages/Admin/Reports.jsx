import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
    const [reportType, setReportType] = useState('date'); // date, month, year
    const [orderData, setOrderData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [deliveryData, setDeliveryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, [reportType]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const [ordersRes, salesRes, deliveryRes] = await Promise.all([
                fetch(`https://loafers-backend-2.onrender.com/api/admin/reports/orders?type=${reportType}`),
                fetch(`https://loafers-backend-2.onrender.com/api/admin/reports/sales?type=${reportType}`),
                fetch(`https://loafers-backend-2.onrender.com/api/admin/reports/delivery`) // Currently all-time
            ]);

            if (ordersRes.ok && salesRes.ok && deliveryRes.ok) {
                setOrderData(await ordersRes.json());
                setSalesData(await salesRes.json());
                setDeliveryData(await deliveryRes.json());
            }
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#F43F97', '#6366F1', '#10B981', '#F59E0B', '#EF4444'];

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-heading font-bold text-primary tracking-tighter">Performance Reports</h2>

            <div className="flex space-x-4 mb-8">
                {['date', 'month', 'year'].map(type => (
                    <button
                        key={type}
                        onClick={() => setReportType(type)}
                        className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-200 ${reportType === type
                            ? 'bg-primary text-white shadow-lg shadow-pink-200 transform -translate-y-0.5'
                            : 'bg-white text-gray-500 hover:text-primary hover:bg-white shadow-sm'
                            }`}
                    >
                        By {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    {/* Order Reports */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-50">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-8 bg-primary rounded-full"></span>
                            Total Orders & Revenue
                        </h3>
                        <div className="h-80 mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={orderData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="period" stroke="#9CA3AF" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left" orientation="left" stroke="#F43F97" tick={{ fill: '#F43F97' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#6366F1" tick={{ fill: '#6366F1' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="total_orders" fill="#F43F97" name="Orders" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="total_revenue" fill="#6366F1" name="Revenue (£)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Delivery Reports */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-50">
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                Delivery Performance
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Rider</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Deliveries</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {deliveryData.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-pink-50/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{row.rider_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{row.total_deliveries}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">£{row.total_revenue?.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        {deliveryData.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-center text-gray-400">No delivery data available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-50 flex flex-col items-center justify-center">
                            <h3 className="text-xl font-bold mb-4 text-gray-800 w-full text-left">Deliveries Share</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={deliveryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="total_deliveries"
                                            nameKey="rider_name"
                                            label
                                        >
                                            {deliveryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Item Sales Reports */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-50">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-8 bg-primary rounded-full"></span>
                            Item Sales Count
                        </h3>
                        <div className="overflow-hidden rounded-xl border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Item Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Period</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Total Sold</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {salesData.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-pink-50/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{row.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.category || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">£{row.price?.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.period}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">{row.total_sold}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">£{row.total_revenue?.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reports;

