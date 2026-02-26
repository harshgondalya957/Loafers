import React from 'react';
import { motion } from 'framer-motion';

const PromoSection = ({ title, subtitle, desc, image, reverse, highlightWord, textClassName = '' }) => {
    return (
        <section className="promo-section-wrapper py-4 md:py-20 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className={`flex flex-col-reverse md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} items-center gap-16`}>

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative">
                            {/* Texture/Blob background */}
                            <div className="absolute inset-0 bg-orange-100 rounded-full scale-110 blur-3xl opacity-40 -z-10"></div>
                            <img
                                src={image}
                                alt={title}
                                className="w-full max-w-xl md:max-w-[41rem] mx-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`promo-text-container w-full md:w-1/2 text-center md:text-left ${textClassName}`}
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-6 leading-tight">
                            {title.split(highlightWord)[0]}
                            <span className="relative inline-block px-1">
                                <span className="relative z-10">{highlightWord}</span>
                                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary -rotate-1 -z-0 rounded-sm mix-blend-multiply opacity-80"></span>
                            </span>
                            {title.split(highlightWord)[1]}
                        </h2>
                        <p className="text-gray-500 font-body leading-relaxed mb-8">
                            {desc}
                        </p>
                        <a href="/order" className="inline-block mt-4 md:mt-2 border-2 border-dark text-dark font-heading font-bold uppercase tracking-widest py-3 px-8 hover:bg-dark hover:text-white transition-all duration-300">
                            Explore Menu
                        </a>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default PromoSection;