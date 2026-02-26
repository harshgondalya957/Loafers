import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

const BreakfastCard = ({ image, name, description, price, onAdd, fullWidth = false, imageHeight = "h-52", imageWidth = "w-44" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col-reverse md:flex-row h-full border border-transparent hover:border-pink-50 group min-h-[120px] ${fullWidth ? 'w-full' : ''}`}
        >
            {/* Left Side: Text Info */}
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <h3 className="font-heading font-bold text-gray-800 text-xl  md:text-xl leading-tight mb-2 group-hover:text-[#F43F97] transition-colors">
                        {name}
                    </h3>
                    {description && (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
                            {description}
                        </p>
                    )}
                </div>
                <div className="mt-3">
                    <span className="font-bold text-gray-900 text-xl">£{price}</span>
                </div>
            </div>

            {/* Right Side: Image & Action */}
            <div className={`relative w-full md:${fullWidth ? 'w-64' : imageWidth} h-56 md:${imageHeight} flex-shrink-0 flex flex-col justify-center`}>
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover`}
                />

                {/* Add Button Overlay */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd && onAdd();
                    }}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#F43F97] hover:bg-[#F43F97] hover:text-white transition-all transform hover:scale-110 active:scale-95 z-10 border border-gray-100"
                >
                    <FaPlus size={10} />
                </div>
            </div>
        </motion.div>
    );
};

export default BreakfastCard;
