import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaTrash, FaMotorcycle } from 'react-icons/fa';

const Riders = () => {
    const [riders, setRiders] = useState([]);
    const [form, setForm] = useState({ name: '', phone: '', vehicle_no: '' });
    const [loading, setLoading] = useState(true);

    const fetchRiders = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/store/riders');
            if (res.ok) {
                const data = await res.json();
                setRiders(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5001/api/store/riders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setForm({ name: '', phone: '', vehicle_no: '' });
                await fetchRiders(); // ensures latest data is retrieved immediately
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.error || 'Failed to add rider'}`);
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Network error: Could not add rider");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this rider?")) return;
        try {
            await fetch(`http://localhost:5001/api/store/riders/${id}`, { method: 'DELETE' });
            fetchRiders();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-heading font-bold text-primary tracking-tighter">Manage Delivery Riders</h2>

            {/* Rider List */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-pink-50">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest rounded-l-lg">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Vehicle No</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest rounded-r-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {riders.map(rider => (
                            <tr key={rider.id} className="hover:bg-pink-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-2">
                                    <FaMotorcycle className="text-gray-400" />
                                    {rider.name}
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium">{rider.phone}</td>
                                <td className="px-6 py-4 text-gray-600 font-medium uppercase">{rider.vehicle_no}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                        ${rider.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {rider.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleDelete(rider.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {riders.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-400 font-bold">No riders added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Rider Form */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-50">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    Add New Rider
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Rider Name</label>
                        <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-pink-200" placeholder="John Rider" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Phone Number</label>
                        <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-pink-200" placeholder="+44 7700 900000" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Vehicle No</label>
                        <input type="text" required value={form.vehicle_no} onChange={e => setForm({ ...form, vehicle_no: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-pink-200" placeholder="AB12 CDE" />
                    </div>
                    <div className="md:col-span-3">
                        <button type="submit" className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:-translate-y-1 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                            <FaUserPlus /> Add Rider
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Riders;

