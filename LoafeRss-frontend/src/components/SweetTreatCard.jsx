import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

const SweetTreatCard = ({ image, name, description, price, onAdd }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col-reverse md:flex-row justify-between group h-auto md:h-[138px] border border-transparent hover:border-pink-50 overflow-hidden"
        >
            {/* Left Side: Text Info */}
            <div className="flex flex-col justify-center gap-1 h-full p-4 flex-1">
                <h3 className="font-heading font-bold text-gray-800 text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {name}
                </h3>
                {description && <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{description}</p>}
                <span className="font-bold text-gray-900 text-lg mt-1">£{price}</span>
            </div>

            {/* Right Side: Image & Action */}
            <div className="relative w-full h-48 md:w-[130px] md:h-full flex-shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>

                {/* Add Button Overlay */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd && onAdd();
                    }}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95 z-10 border border-gray-100"
                >
                    <FaPlus size={10} />
                </div>
            </div>
        </motion.div>
    );
};

export default SweetTreatCard;
