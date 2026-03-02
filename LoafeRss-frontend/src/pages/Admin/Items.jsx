import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaEye, FaEyeSlash, FaImage } from 'react-icons/fa';

const Items = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [customGroups, setCustomGroups] = useState([]);
    const [form, setForm] = useState({
        name: '', description: '', image: '', price: '',
        category_id: '', sub_category_id: '', customization_group_id: '',
        energy_kcal: '', tags: [], is_active: 1
    });
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [itemsRes, catRes, subRes, groupRes] = await Promise.all([
                fetch('http://localhost:5001/api/store/items'),
                fetch('http://localhost:5001/api/store/categories'),
                fetch('http://localhost:5001/api/store/sub-categories'),
                fetch('http://localhost:5001/api/store/customization-groups')
            ]);

            if (itemsRes.ok) setItems(await itemsRes.json());
            if (catRes.ok) setCategories(await catRes.json());
            if (subRes.ok) setSubCategories(await subRes.json());
            if (groupRes.ok) setCustomGroups(await groupRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTagChange = (tag) => {
        setForm(prev => {
            const tags = prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag];
            return { ...prev, tags };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editing
                ? `http://localhost:5001/api/store/items/${editing}`
                : 'http://localhost:5001/api/store/items';
            const method = editing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setForm({
                    name: '', description: '', image: '', price: '',
                    category_id: '', sub_category_id: '', customization_group_id: '',
                    energy_kcal: '', tags: [], is_active: 1
                });
                setEditing(null);
                fetchData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleStatus = async (item) => {
        try {
            const newStatus = item.is_active ? 0 : 1;
            await fetch(`http://localhost:5001/api/store/items/${item._id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: newStatus })
            });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await fetch(`http://localhost:5001/api/store/items/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    // Filter sub-cats based on selected category
    const filteredSubs = subCategories.filter(s => s.category_id == form.category_id);

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-heading font-bold text-primary tracking-tighter">Manage Items</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-xl border border-pink-50">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Item Catalogue</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <th className="p-4 rounded-l-lg">Name</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 rounded-r-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map(item => (
                                    <tr key={item._id} className="hover:bg-primary/5 hover:scale-[1.005] transition-all duration-200 cursor-pointer bg-white">
                                        <td className="p-4 font-bold text-gray-800">{item.name}</td>
                                        <td className="p-4 font-bold text-primary">£{item.price}</td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {categories.find(c => c._id === item.category_id)?.name || '-'}
                                        </td>
                                        <td className="p-4">
                                            <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(item); }} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-all transform hover:scale-105 ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {item.is_active ? <FaEye /> : <FaEyeSlash />} {item.is_active ? 'Live' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); setForm(item); setEditing(item._id); }} className="text-blue-400 hover:text-blue-600 transition-transform hover:scale-110"><FaEdit /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }} className="text-red-400 hover:text-red-600 transition-transform hover:scale-110"><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-50 h-fit">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        {editing ? 'Edit Item' : 'Add Item'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Name</label>
                            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-pink-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Image URL</label>
                            <div className="flex gap-2">
                                <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-pink-200" placeholder="https://..." />
                                {form.image && <img src={form.image} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Price (£)</label>
                                <input type="number" step="0.01" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Calories (kcal)</label>
                                <input type="number" value={form.energy_kcal} onChange={e => setForm({ ...form, energy_kcal: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Category</label>
                            <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold">
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Sub-Category</label>
                            <select value={form.sub_category_id} onChange={e => setForm({ ...form, sub_category_id: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold" disabled={!form.category_id}>
                                <option value="">Select Sub-Category</option>
                                {filteredSubs.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Customization Group</label>
                            <select value={form.customization_group_id} onChange={e => setForm({ ...form, customization_group_id: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold">
                                <option value="">None</option>
                                {customGroups.map(g => <option key={g._id} value={g._id}>{g.admin_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Description</label>
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold" rows="2"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Dietary Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {['Veg', 'Vegan', 'Gluten Free', 'Halal'].map(tag => (
                                    <button
                                        type="button"
                                        key={tag}
                                        onClick={() => handleTagChange(tag)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${form.tags.includes(tag) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary/50'}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-800">Publish Status</label>
                                <p className="text-xs text-gray-500">Enable to make this item visible to customers</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={form.is_active === 1} onChange={e => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 hover:-translate-y-1 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                                {editing ? <FaEdit /> : <FaPlus />} {editing ? 'Update Item' : 'Add Item'}
                            </button>
                            {editing && (
                                <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', image: '', price: '', category_id: '', sub_category_id: '', customization_group_id: '', energy_kcal: '', tags: [], is_active: 1 }); }} className="px-6 py-3 bg-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-300 transition-colors">
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

export default Items;
