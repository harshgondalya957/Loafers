import React, { useState } from 'react';

const CreateStore = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://loafers.onrender.com/api/admin/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, location })
            });

            if (response.ok) {
                setStatus('Store created successfully!');
                setName('');
                setLocation('');
            } else {
                setStatus('Failed to create store.');
            }
        } catch (error) {
            console.error(error);
            setStatus('Error creating store.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-pink-100">
            <h2 className="text-3xl font-heading font-bold mb-8 text-primary text-center">Create New Store</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Store Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium bg-gray-50"
                        required
                        placeholder="e.g. Manchester Center"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium bg-gray-50"
                        required
                        placeholder="e.g. 123 High Street, M1 1AA"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-pink-200 text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-[1.02]"
                >
                    Create Store
                </button>
                {status && <p className={`mt-4 text-center text-sm font-bold ${status.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{status}</p>}
            </form>
        </div>
    );
};

export default CreateStore;

