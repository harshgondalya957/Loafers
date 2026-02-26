import React from 'react';
import { useNavigate } from 'react-router-dom';
import omelette from '../assets/omelette.png';
import coffee from '../assets/coffee.jpg';
import burger from '../assets/BurgerBar/burger.jpg';
import sandwich from '../assets/sanwich.png';
import breakfast from '../assets/Breakfast/breakfast.png'
import friedChicken from '../assets/Burrito.png';

const MenuGrid = () => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 1, title: 'OMELETTE', image: omelette, category: 'Omelettes' },
        { id: 2, title: 'COFFEE', image: coffee, category: 'Hot Drinks' },
        { id: 3, title: 'BURGER', image: burger, category: 'Burger Bar' },
        { id: 4, title: 'SANDWICH', image: sandwich, category: 'Sandwiches' },
        { id: 5, title: 'BURRITO', image: friedChicken, category: 'Burritos' },
        { id: 6, title: 'BREAKFAST', image: breakfast, category: 'Breakfast' },
    ];

    const handleCardClick = (category) => {
        navigate(`/order?category=${encodeURIComponent(category)}`);
    };

    return (
        <div className="w-full px-6 md:px-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleCardClick(item.category)}
                        className="relative group h-60 sm:h-72 md:h-96 overflow-hidden cursor-pointer rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Image */}
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 group-hover:via-black/50 transition-colors duration-300"></div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                            <h3 className="text-white text-xl md:text-2xl font-heading font-bold tracking-widest uppercase text-center">
                                {item.title}
                            </h3>
                            <p className="text-gray-200 text-sm mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {item.category}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuGrid;