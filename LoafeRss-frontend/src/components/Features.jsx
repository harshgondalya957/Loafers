import React from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiAward, FiCoffee } from 'react-icons/fi';

const features = [
    {
        icon: <FiTruck />,
        title: "Fast Delivery",
        desc: "Everything you order will be quickly delivered to your door."
    },
    {
        icon: <FiAward />,
        title: "Best Quality",
        desc: "We use only the best ingredients to cook the tasty fresh food for you."
    },
    {
        icon: <FiCoffee />,
        title: "Variety of Dishes",
        desc: "In our menu you'll find a wide variety of dishes, desserts and drinks."
    }
];

const Features = () => {
    return (
        <section className="py-14 bg-white">
            <div className="container mx-auto px-4">
                {/* MOBILE: 2 columns | DESKTOP: 3 columns */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6 text-center">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className={`flex flex-col items-center
                                ${index === 2 ? "col-span-2 md:col-span-1" : ""}
                            `}
                        >
                            {/* Icon */}
                            <div className="text-5xl text-pink-500 mb-4">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-2">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-500 text-sm max-w-[260px]">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
