import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

const MenuCard = ({ image, name, description, price, onAdd }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer border border-transparent hover:border-pink-100 flex flex-col h-full bg-white relative overflow-hidden"
        >
            <div className="flex gap-4 h-full relative z-10">
                {/* Image Area */}
                <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Dark Overlay on Hover (Optional, adds depth) */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col justify-between flex-grow py-1">
                    <div>
                        <h3 className="font-heading font-bold text-gray-800 text-lg leading-tight mb-1 group-hover:text-primary transition-colors">{name}</h3>
                        {description ? <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{description}</p> : <p className="text-gray-400 text-xs mt-1">Standard serving size</p>}
                    </div>

                    <div className="flex justify-between items-end mt-3">
                        <span className="font-bold text-gray-900 text-lg">£{price}</span>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onAdd && onAdd();
                            }}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                        >
                            <FaPlus size={12} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MenuCard;
