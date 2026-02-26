import React, { useState, useEffect, useRef } from 'react';
import { FaTrash, FaExclamationTriangle, FaArrowRight, FaPrint } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import { menuData } from '../../data/products';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Setup for printing the receipt Modal
    const receiptRef = useRef();
    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: `Order_Receipt_${selectedOrder?.id || Date.now()}`,
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('https://loafers-backend-2.onrender.com/api/admin/orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (id) => {
        try {
            const res = await fetch(`https://loafers-backend-2.onrender.com/api/admin/orders/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedOrder(data);
                setShowModal(true);
            }
        } catch (error) {
            console.error("Failed to fetch order details", error);
        }
    };

    const handleDeleteOrder = async (id) => {
        if (window.confirm('Are you sure you want to cancel/delete this order?')) {
            try {
                const response = await fetch(`https://loafers-backend-2.onrender.com/api/admin/orders/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setOrders(orders.filter(order => order.id !== id));
                    if (selectedOrder && selectedOrder.id === id) setShowModal(false);
                } else {
                    alert('Failed to delete order');
                }
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        }
    };

    const handleDeleteAllOrders = async () => {
        if (window.confirm('WARNING: This will delete ALL orders. Are you sure?')) {
            try {
                const response = await fetch(`https://loafers-backend-2.onrender.com/api/admin/orders/all`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setOrders([]);
                    setShowModal(false);
                    alert('All orders deleted successfully');
                } else {
                    alert('Failed to delete all orders');
                }
            } catch (error) {
                console.error("Error deleting all orders:", error);
            }
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-50 relative">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-4xl font-heading font-bold text-primary tracking-tighter">Orders</h2>
                <button
                    onClick={handleDeleteAllOrders}
                    className="flex items-center px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-100 transition-all transform hover:scale-105"
                >
                    <FaExclamationTriangle className="mr-2" /> Delete All Demo Orders
                </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-sm font-medium text-gray-400">
                                        Loading...
                                    </td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-primary/5 hover:scale-[1.005] transition-all duration-200 cursor-pointer bg-white" onClick={() => fetchOrderDetails(order.id)}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-400">#{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                                            {new Date(order.created_at || order.order_date).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {order.customer_name || 'Guest'}
                                            <div className="text-xs font-normal text-gray-400">{order.customer_email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">£{order.total_amount?.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); fetchOrderDetails(order.id); }}
                                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all hover:scale-110"
                                                title="View Details">
                                                <FaArrowRight />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }}
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all hover:scale-110"
                                                title="Cancel Order"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-sm font-medium text-gray-400">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn" onClick={e => e.stopPropagation()}>

                        {/* Printable Area starts below */}
                        <div ref={receiptRef} className="p-0 bg-white" style={{ padding: '0', margin: '0' }}>
                            {/* We re-add a special print-only header here for the receipt paper if needed.
                                For now we will print the content inside the modal directly. */}

                            <div className="bg-primary p-6 text-white flex justify-between items-center print:bg-black font-sans">
                                <div>
                                    <h3 className="text-2xl font-heading font-bold">Order #{selectedOrder.id}</h3>
                                    <p className="text-white/80 text-sm">{new Date(selectedOrder.created_at || selectedOrder.order_date).toLocaleString()}</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors print:hidden">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-6 max-h-[70vh] overflow-y-auto print:max-h-none print:overflow-visible">
                                {/* Customer Info */}
                                <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 print:bg-white print:border-black">
                                    <h4 className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-wider print:text-black">Customer Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 print:text-gray-800">Name</p>
                                            <p className="font-bold text-gray-800 print:text-black">{selectedOrder.customer_name || 'Guest'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 print:text-gray-800">Email</p>
                                            <p className="font-bold text-gray-800 print:text-black">{selectedOrder.customer_email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 print:text-gray-800">Phone</p>
                                            <p className="font-bold text-gray-800 print:text-black">{selectedOrder.customer_phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-wider border-b pb-2 print:border-black print:text-black">Items Ordered</h4>
                                    <div className="space-y-4">
                                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                            selectedOrder.items.map((item, idx) => {
                                                const getParsedName = () => {
                                                    if (item.name && item.name !== 'Unknown Item') return item.name;
                                                    if (typeof item.item_id === 'string' && item.item_id.includes('-')) {
                                                        const parts = item.item_id.split('-');
                                                        const lastPart = parts[parts.length - 1];
                                                        if (!isNaN(lastPart) && lastPart.length > 8) {
                                                            return parts.slice(0, -1).join('-');
                                                        }
                                                    }
                                                    return item.name || `Item #${item.item_id}`;
                                                };

                                                const itemName = getParsedName();
                                                const getProductImage = (name) => {
                                                    if (item.image) return item.image;
                                                    if (!name) return null;
                                                    for (const category of Object.values(menuData)) {
                                                        const found = category.find(p => p.name === name);
                                                        if (found && found.image) return found.image;
                                                    }
                                                    return null;
                                                };
                                                const displayImage = getProductImage(itemName);

                                                return (
                                                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow print:border-b print:border-l-0 print:border-r-0 print:border-t-0 print:rounded-none">
                                                        <div className="flex items-center gap-4">
                                                            {/* Image */}
                                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 print:hidden">
                                                                {displayImage ? (
                                                                    <img src={displayImage} alt={itemName} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                                                                )}
                                                            </div>

                                                            {/* Quantity Badge */}
                                                            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 print:bg-white print:text-black print:w-auto print:h-auto print:mr-2">
                                                                {item.quantity}x
                                                            </div>

                                                            {/* Details */}
                                                            <div>
                                                                <p className="font-bold text-gray-800 print:text-black">{itemName}</p>
                                                                <p className="text-xs text-gray-500 uppercase">{item.category || 'General'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="font-bold text-gray-900 print:text-black">
                                                            £{((item.price_at_sale || item.price || 0) * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-gray-400 text-center py-4">No items details found.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Total Footer */}
                                <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center print:border-black">
                                    <span className="text-gray-500 font-medium print:text-black">Total Amount</span>
                                    <span className="text-3xl font-heading font-bold text-primary print:text-black">£{selectedOrder.total_amount?.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="hidden print:block text-center mt-12 mb-8 text-sm text-gray-500">
                                Thank you for ordering with Loafers!
                            </div>
                        </div>
                        {/* Printable Area ends */}

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 print:hidden">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                Close
                            </button>
                            <button
                                onClick={() => handlePrint()}
                                className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                            >
                                <FaPrint /> Print Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
