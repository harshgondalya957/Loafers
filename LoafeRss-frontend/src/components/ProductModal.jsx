import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // Reset state when product changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setSelectedOptions([]);
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    // Define options based on product category or name (simplified for now)
    // In a real app, this would come from the product object itself
    const getOptionsForProduct = (prod) => {
        const lowerName = prod.name.toLowerCase();
        if (lowerName.includes('coffee') || lowerName.includes('latte') || lowerName.includes('cappuccino')) {
            return [
                { id: 'caramel', name: 'Caramel', price: 0.50 },
                { id: 'vanilla', name: 'Vanilla', price: 0.50 },
                { id: 'hazelnut', name: 'Hazelnut', price: 0.50 },
            ];
        }
        if (lowerName.includes('burger')) {
            return [
                { id: 'cheese', name: 'Extra Cheese', price: 1.00 },
                { id: 'bacon', name: 'Add Bacon', price: 1.50 },
                { id: 'onion', name: 'Extra Onions', price: 0.00 },
            ];
        }
        return []; // Default no options
    };

    const options = getOptionsForProduct(product);
    const basePrice = parseFloat(product.price);
    const optionsPrice = selectedOptions.reduce((acc, optId) => {
        const opt = options.find(o => o.id === optId);
        return acc + (opt ? opt.price : 0);
    }, 0);
    const totalPrice = (basePrice + optionsPrice) * quantity;

    const handleOptionToggle = (optionId) => {
        setSelectedOptions(prev => {
            if (prev.includes(optionId)) {
                return prev.filter(id => id !== optionId);
            } else {
                return [...prev, optionId];
            }
        });
    };

    const handleAddToCart = () => {
        onAddToCart({
            ...product, // Keep original product details
            quantity,
            selectedOptions: options.filter(o => selectedOptions.includes(o.id)),
            totalPrice: totalPrice.toFixed(2)
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-[#FFF9EF] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors shadow-sm"
                        >
                            <FaTimes size={20} />
                        </button>

                        {/* Left Side: Details & Options (Scrollable) */}
                        <div className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col h-full order-2 md:order-1">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-2xl md:text-4xl font-heading font-bold text-gray-900">{product.name}</h2>
                                <span className="text-xl md:text-2xl font-bold text-gray-900">£{product.price}</span>
                            </div>

                            {product.description && (
                                <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 border-b border-gray-200 pb-4 md:pb-6">{product.description}</p>
                            )}

                            {/* Options Section */}
                            {options.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-3 md:mb-4">
                                        <div>
                                            <h3 className="text-lg md:text-xl font-bold text-gray-800">Customise</h3>
                                            <p className="text-gray-500 text-xs md:text-sm">Choose extras</p>
                                        </div>
                                        <span className="text-[#F43F97] font-bold text-[10px] md:text-sm bg-pink-50 px-2 md:px-3 py-0.5 md:py-1 rounded-full">Optional</span>
                                    </div>

                                    <div className="space-y-3">
                                        {options.map((option) => (
                                            <label
                                                key={option.id}
                                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedOptions.includes(option.id)
                                                    ? 'border-[#F43F97] bg-pink-50/50'
                                                    : 'border-gray-100 hover:border-gray-200 bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded border flex items-center justify-center transition-colors ${selectedOptions.includes(option.id)
                                                        ? 'bg-[#F43F97] border-[#F43F97] text-white'
                                                        : 'border-gray-300 bg-white'
                                                        }`}>
                                                        {selectedOptions.includes(option.id) && <FaPlus size={10} />}
                                                    </div>
                                                    <span className="font-bold text-sm md:text-base text-gray-700">{option.name}</span>
                                                </div>
                                                <span className="text-gray-500 font-medium text-sm md:text-base">
                                                    {option.price > 0 ? `+£${option.price.toFixed(2)}` : 'Free'}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedOptions.includes(option.id)}
                                                    onChange={() => handleOptionToggle(option.id)}
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bottom Actions (Sticky on mobile if needed, but here inline) */}
                            <div className="mt-auto pt-6 border-t border-gray-200">
                                <div className="flex items-stretch gap-4 h-14">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-between bg-white border border-gray-300 rounded-full px-4 min-w-[140px]">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                                            disabled={quantity <= 1}
                                        >
                                            <FaMinus size={14} />
                                        </button>
                                        <span className="font-bold text-xl w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                                        >
                                            <FaPlus size={14} />
                                        </button>
                                    </div>

                                    {/* Add Button */}
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-black hover:bg-gray-800 text-white font-bold rounded-full transition-colors flex items-center justify-between px-6 shadow-lg hover:shadow-xl transform active:scale-95 transition-all"
                                    >
                                        <span>ADD TO ORDER</span>
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                            £{totalPrice.toFixed(2)}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Image (Full height on desktop) */}
                        <div className="w-full md:w-2/5 h-52 md:h-auto bg-white relative order-1 md:order-2 flex items-center justify-center p-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                            {/* Removed gradient overlay as we want full visibility */}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;
