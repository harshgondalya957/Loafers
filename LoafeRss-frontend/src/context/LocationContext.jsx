import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => {
    return useContext(LocationContext);
};

export const locations = {
    denton: {
        id: 'denton',
        name: 'Denton',
        address: '77 Stockport Rd, Greater, Denton, Manchester M34 6DD, United Kingdom',
        phone: '0161 320 7744',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=77+Stockport+Rd,+Greater,+Denton,+M34+6DD'
    },
    ashton: {
        id: 'ashton',
        name: 'Ashton',
        address: '200 Stockport Rd, Ashton-under-Lyne OL7 0NS, United Kingdom',
        phone: '0161 330 6655', // Placeholder phone, user didn't provide.
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=200+Stockport+Rd,+Ashton-under-Lyne+OL7+0NS'
    }
};

export const LocationProvider = ({ children }) => {
    // Initialize from localStorage or default to null (force choice)
    const [selectedLocation, setSelectedLocation] = useState(() => {
        const saved = localStorage.getItem('loafers_location');
        return saved ? locations[saved] : null; // If saved ID exists, return full object, else null
    });

    const setLocation = (locationId) => {
        if (locationId === null) {
            setSelectedLocation(null);
            localStorage.removeItem('loafers_location');
        } else if (locations[locationId]) {
            setSelectedLocation(locations[locationId]);
            localStorage.setItem('loafers_location', locationId);
        }
    };

    const value = {
        selectedLocation,
        setLocation,
        locations
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};
