import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';

const CartSidebar = ({ cartItems, updateQuantity, removeFromCart, isOpen, onClose }) => {
    const navigate = useNavigate();
    const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    const deliveryFee = 2.50;
    const total = subtotal + deliveryFee;

    const handleCheckout = () => {
        onClose();
        navigate('/checkout', { state: { cartItems, subtotal, deliveryFee, total } });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className="fixed top-0 right-0 h-full w-full lg:max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="font-heading font-bold text-xl text-gray-800 flex items-center gap-2">
                        <FaShoppingBag className="text-[#F43F97]" /> Your Order
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            <FiShoppingBag size={48} className="mb-4 opacity-20" />
                            <p className="font-medium">Your basket is empty</p>
                            <p className="text-sm">Add some tasty items from the menu!</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                {/* Image */}
                                <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <span className="font-bold text-[#F43F97]">£{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>

                                        {/* Quantity Control */}
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-5 h-5 rounded-full bg-white text-gray-600 flex items-center justify-center shadow-sm hover:text-[#F43F97] disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <FaMinus size={8} />
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-5 h-5 rounded-full bg-white text-gray-600 flex items-center justify-center shadow-sm hover:text-[#F43F97]"
                                            >
                                                <FaPlus size={8} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {cartItems.length > 0 && (
                    <div className="p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <div className="space-y-2 mb-4 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>£{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>£{deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-dashed">
                                <span>Total</span>
                                <span>£{total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-[#F43F97] hover:bg-[#d63383] text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            Checkout <span className="text-pink-200">|</span> £{total.toFixed(2)}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
