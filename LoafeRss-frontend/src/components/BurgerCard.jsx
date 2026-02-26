import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

const BurgerCard = ({ image, name, description, price, tags = [], onAdd }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col-reverse md:flex-row h-full border border-transparent hover:border-pink-50 group relative"
        >
            {/* Left Side: Text Info */}
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <h3 className="font-heading font-bold text-gray-800 text-xl md:text-2xl leading-tight mb-2 group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
                        {description}
                    </p>
                </div>
                <div className="mt-3">
                    <span className="font-bold text-gray-900 text-xl">£{price}</span>
                </div>
            </div>

            {/* Right Side: Image & Action */}
            <div className="relative w-full h-56 md:w-44 md:h-60 flex-shrink-0 flex flex-col justify-center">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />

                {/* Tags Overlay */}
                {tags && tags.length > 0 && (
                    <div className="absolute top-0 right-0 flex flex-col gap-1 p-1 z-10 items-end">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm text-white ${tag === 'Trending' ? 'bg-orange-500' :
                                    tag === 'Most Ordered' ? 'bg-green-500' : 'bg-primary'
                                    }`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

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

export default BurgerCard;
