import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '' });
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/store/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editing
                ? `http://localhost:5001/api/store/categories/${editing}`
                : 'http://localhost:5001/api/store/categories';
            const method = editing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setForm({ name: '' });
                setEditing(null);
                fetchData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (cat) => {
        setForm({ name: cat.name });
        setEditing(cat._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await fetch(`http://localhost:5001/api/store/categories/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-heading font-bold text-primary tracking-tighter">Manage Categories</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* List */}
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-pink-50">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Existing Categories</h3>
                    {loading ? <p>Loading...</p> : (
                        <ul className="space-y-2">
                            {categories.map(cat => (
                                <li key={cat._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-pink-50/30 transition-colors">
                                    <span className="font-bold text-gray-700">{cat.name}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(cat)} className="text-blue-400 hover:text-blue-600 p-2"><FaEdit /></button>
                                        <button onClick={() => handleDelete(cat._id)} className="text-red-400 hover:text-red-600 p-2"><FaTrash /></button>
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
                        {editing ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Category Name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={e => setForm({ name: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-pink-200"
                                placeholder="e.g. Burgers"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 hover:-translate-y-1 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                                {editing ? <FaEdit /> : <FaPlus />} {editing ? 'Update' : 'Add'}
                            </button>
                            {editing && (
                                <button type="button" onClick={() => { setEditing(null); setForm({ name: '' }); }} className="px-6 py-3 bg-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-300 transition-colors">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Categories;
