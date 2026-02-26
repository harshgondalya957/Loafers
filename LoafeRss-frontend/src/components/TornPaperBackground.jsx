import React from 'react';
import paperEdge from '../assets/paper_edge.png';

const TornPaperBackground = ({ children, className = '', bgColor = '#FBE9D0', topEdge = true, bottomEdge = true }) => {
    return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ backgroundColor: bgColor }}>
            {/* Top Edge */}
            {topEdge && (
                <div className="absolute top-0 left-0 w-full z-10 leading-none pointer-events-none">
                    <img
                        src={paperEdge}
                        alt=""
                        className="w-full h-auto min-h-[48px] object-cover transform rotate-180 block"
                        style={{
                            filter: 'brightness(0) invert(1) drop-shadow(0px 2px 4px rgba(255, 248, 248, 0.05))',
                            opacity: 0.9
                        }}
                    />
                </div>
            )}

            {/* Content Container */}
            <div className="relative z-0 w-full h-full flex justify-center items-center min-h-[500px]" style={{ backgroundColor: bgColor }}>
                {/* Subtle texture overlay if needed, currently just color */}
                {children}
            </div>

            {/* Bottom Edge */}
            {bottomEdge && (
                <div className="absolute bottom-0 left-0 w-full z-10 leading-none pointer-events-none">
                    <img
                        src={paperEdge}
                        alt=""
                        className="w-full h-auto min-h-[48px] object-cover block"
                        style={{
                            filter: 'brightness(0) invert(1) drop-shadow(0px -2px 4px rgba(0,0,0,0.05))',
                            opacity: 0.9
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default TornPaperBackground;
