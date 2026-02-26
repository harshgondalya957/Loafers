import React, { useEffect, useState } from 'react';
import { FaTag, FaTrash, FaPlus } from 'react-icons/fa';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [form, setForm] = useState({ code: '', type: 'amount', value: '', expiry_date: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/store/coupons');
            if (res.ok) setCoupons(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            const res = await fetch(`http://localhost:5001/api/store/coupons/${id}`, { method: 'DELETE' });
            if (res.ok) fetchCoupons();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5001/api/store/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setForm({ code: '', type: 'amount', value: '', expiry_date: '' });
                fetchCoupons();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-heading font-bold text-primary tracking-tighter">Manage Coupons</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* List */}
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-pink-50">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Active Coupons</h3>
                    {loading ? <p>Loading...</p> : (
                        <ul className="space-y-2">
                            {coupons.map(c => (
                                <li key={c.id} className="p-4 bg-gray-50 rounded-xl hover:bg-pink-50/30 transition-colors flex justify-between items-center group">
                                    <div>
                                        <span className="font-bold text-lg text-primary block tracking-wider">{c.code}</span>
                                        <span className="text-sm font-bold text-gray-500">
                                            {c.type === 'bogo' ? 'Buy One Get One' : c.type === 'percentage' ? `${c.value}% Off` : `£${c.value} Off`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Expires</span>
                                            <span className="text-sm font-bold text-gray-600">{c.expiry_date || 'Never'}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="text-red-400 hover:text-red-600 bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete Coupon"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-50 h-fit">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        Create New Coupon
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Coupon Code</label>
                            <input type="text" required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold uppercase tracking-wider" placeholder="SAVE20" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Coupon Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold">
                                <option value="amount">Fixed Amount (£)</option>
                                <option value="percentage">Percentage (%)</option>
                                <option value="bogo">Buy One Get One Free</option>
                            </select>
                        </div>
                        {form.type !== 'bogo' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Value</label>
                                <input type="number" step="0.01" required value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Expiry Date</label>
                            <input type="date" value={form.expiry_date} onChange={e => setForm({ ...form, expiry_date: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold" />
                        </div>
                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                            <FaPlus /> Create Coupon
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Coupons;

