import React from 'react';
import { FaStar } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import testimonialUser1 from '../assets/testimonial_user_1.png';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
    {
        name: "Amanda Evens",
        role: "Food Expert",
        img: testimonialUser1,
        text: "A little cafe, the food is amazing, very fresh and reasonably priced.",
        rating: 5
    },
    {
        name: "Artisan resin Driveways",
        role: "Customer",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
        text: "Brilliant the owner is always happy to see u food is band on keep up the great work",
        rating: 5
    },
    {
        name: "Ashlie an Smith",
        role: "Food Blogger",
        img: "https://randomuser.me/api/portraits/men/44.jpg",
        text: "Amazing food especially the triple burger. Great services and fantastic value.",
        rating: 4
    },
    {
        name: "John Doe",
        role: "Food Lover",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Absolutely delicious! The best breakfast I've had in a long time.",
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-white font-body text-center">
            <div className="container mx-auto px-4 md:px-8">

                {/* Section Title */}
                <div className="mb-16 relative inline-block">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 relative z-10">
                        Testimonials
                    </h2>
                    {/* Pink Underline Accent */}
                    <div className="absolute left-0 right-0 -bottom-2 h-3 bg-[#EC4899] -rotate-1 opacity-80 rounded-full z-0 transform scale-x-110"></div>
                </div>

                {/* Swiper Carousel */}
                <div className="max-w-6xl mx-auto mt-8">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="pb-12"
                    >
                        {testimonials.map((item, index) => (
                            <SwiperSlide key={index} className="h-auto">
                                <div className="bg-[#FFF5E5] rounded-xl p-8 shadow-sm flex flex-col items-center h-full min-h-[300px] border border-gray-100">
                                    {/* 1. Circular User Image */}
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-24 h-24 rounded-full object-cover mb-8 bg-gray-100"
                                    />

                                    {/* 2. Testimonial Text (Italic) */}
                                    <p className="text-gray-500 italic leading-relaxed mb-8 flex-grow">
                                        {item.text}
                                    </p>

                                    {/* 3. User Name & Role (Pink text combination) */}
                                    <h4 className="font-heading font-bold text-sm text-[#EC4899] mb-1 text-center">
                                        <span className="text-gray-900 border-b border-gray-300 pb-0.5 mr-2">{item.name}</span>
                                        <br className="md:hidden" />
                                        ({item.role})
                                    </h4>

                                    {/* 5. Optional Star Rating (Black outline style in user image usually) */}
                                    <div className="flex gap-1 text-black mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} size={16} className={i < item.rating ? "opacity-100" : "opacity-30"} />
                                        ))}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;