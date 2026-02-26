import React from 'react';
import { motion } from 'framer-motion';
import heroBowl from '../assets/hero_bowl.png';
import heroSpoons from '../assets/hero_spoons.png';
import heroBgPattern from '../assets/hero_bg_pattern.jpg';

const Hero = () => {
    return (
        <section className="relative w-full min-h-[500px] lg:min-h-[750px] bg-[#FFF8F0] flex items-center justify-center overflow-hidden font-body px-4 md:px-6">

            {/* BACKGROUND PATTERN */}
            <div className="absolute inset-0 z-0">
                <img src={heroBgPattern} alt="Pattern" className="w-full h-full object-cover" />
            </div>

            {/* LEFT: MAIN BOWL IMAGE (Anchored to Left Edge - BIGGER) */}
            <div className="hidden lg:block absolute left-[-200px] xl:left-[-300px] top-[42%] -translate-y-1/2 z-20">
                <motion.img
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    src={heroBowl}
                    alt="Signature Bowl"
                    className="w-[450px] xl:w-[700px] 2xl:w-[900px] max-w-none object-contain drop-shadow-2xl"
                />
            </div>

            {/* CENTER: MAIN CONTENT (Centered Text) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center relative z-30 order-1 lg:order-2 mt-12 lg:-mt-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 flex flex-col items-center w-full"
                >
                    {/* TOP LINE */}
                    <p className="text-[#EC4899] font-bold tracking-[0.3em] uppercase text-[10px] md:text-sm mb-4 lg:mb-6">
                        Welcome to Loafers
                    </p>

                    <div className="relative mb-6 flex flex-col items-center">
                        {/* MAIN TEXT */}
                        <div className="relative">
                            <h1 className="hero-main-title text-3xl sm:text-4xl md:text-7xl lg:text-5xl xl:text-[7rem] font-heading font-bold text-[#1a1a1a] uppercase tracking-tighter leading-[0.85] text-center">
                                EXPERIENCE THE <br />
                                <span className="block mt-4 lg:mt-6">IN THE TOWN</span>
                            </h1>

                            {/* SIDE TEXT: BEST FOOD */}
                            <div className="hero-side-text absolute top-0 right-0 translate-x-[60%] translate-y-[15%] md:translate-y-[-20%] flex flex-col items-start pointer-events-none z-20">
                                <span className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-5xl xl:text-[6rem] text-outline leading-none transform -rotate-6">
                                    Best
                                </span>
                                <span className="font-script text-[#EC4899] text-3xl sm:text-4xl md:text-7xl lg:text-5xl xl:text-[6rem] leading-none transform -rotate-12 -mt-2 sm:-mt-4 ml-6 sm:ml-8"
                                    style={{ textShadow: '2px 2px 0px rgba(255,255,255,0.8)' }}>
                                    Food
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="hero-desc-text text-gray-600 text-sm md:text-base font-body font-normal mt-4 lg:mt-8 max-w-lg leading-relaxed px-4"
                >
                    Order food online from one of the finest takeaways in town. Here at Loafers in Greater, and are proud to serve the surrounding area.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 lg:mt-12"
                >
                    <a
                        href="order"
                        className="bg-[#EC4899] text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#333] transition-colors duration-300 shadow-xl inline-block"
                    >
                        View Menu
                    </a>
                </motion.div>
            </div>

            {/* RIGHT: SPICES IMAGE (Anchored to Right Edge) */}
            <div className="hidden lg:block absolute right-[-50px] bottom-[56px] z-10">
                <motion.img
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    src={heroSpoons}
                    alt="Spices"
                    className="w-[300px] xl:w-[510px] max-w-none object-contain drop-shadow-xl scale-x-[-1]"
                />
            </div>

            {/* RESPONSIVE MOBILE IMAGE - BOWL */}
            <img
                src={heroBowl}
                className="lg:hidden absolute -top-10 -left-16 w-60 opacity-100 rotate-12 z-0 pointer-events-none"
                alt="Decor"
            />

            {/* RESPONSIVE MOBILE IMAGE - SPOONS */}
            <img
                src={heroSpoons}
                className="lg:hidden absolute bottom-[30px] -right-10 w-48 opacity-100 z-10 pointer-events-none scale-x-[-1]"
                alt="Decor Spoons"
            />

            {/* BOTTOM WAVE (SNAKE TYPE) DIVIDER */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px] fill-white">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;