import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';

const Customization = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupItems, setGroupItems] = useState([]);

    // Group Form
    const [groupForm, setGroupForm] = useState({
        admin_name: '',
        customer_name: '',
        min_selection: 0,
        max_selection: 1,
        is_required: false
    });

    // Item Form
    const [itemForm, setItemForm] = useState({
        name: '',
        price: '',
        calories: ''
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchGroupItems(selectedGroup.id);
        } else {
            setGroupItems([]);
        }
    }, [selectedGroup]);

    const fetchGroups = async () => {
        try {
            const res = await fetch('https://loafers.onrender.com/api/store/customization-groups');
            if (res.ok) setGroups(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupItems = async (groupId) => {
        try {
            const res = await fetch(`https://loafers.onrender.com/api/store/customization-groups/${groupId}/items`);
            if (res.ok) setGroupItems(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    // --- Group Actions ---
    const handleGroupSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://loafers.onrender.com/api/store/customization-groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(groupForm)
            });
            if (res.ok) {
                setGroupForm({ admin_name: '', customer_name: '', min_selection: 0, max_selection: 1, is_required: false });
                fetchGroups();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteGroup = async (id) => {
        if (!window.confirm("Are you sure? This will delete the group and all its items.")) return;
        try {
            const res = await fetch(`https://loafers.onrender.com/api/store/customization-groups/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchGroups();
                if (selectedGroup && selectedGroup.id === id) setSelectedGroup(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // --- Item Actions ---
    const handleItemSubmit = async (e) => {
        e.preventDefault();
        if (!selectedGroup) return;

        try {
            const res = await fetch(`https://loafers.onrender.com/api/store/customization-groups/${selectedGroup.id}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemForm)
            });

            if (res.ok) {
                setItemForm({ name: '', price: '', calories: '' });
                fetchGroupItems(selectedGroup.id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("Delete this option?")) return;
        try {
            await fetch(`https://loafers.onrender.com/api/store/customization-items/${itemId}`, { method: 'DELETE' });
            if (selectedGroup) fetchGroupItems(selectedGroup.id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <h2 className="text-3xl font-heading font-bold text-primary tracking-tighter">Customization Manager</h2>

            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">

                {/* Left Column: Groups List & Create Form */}
                <div className="col-span-12 md:col-span-5 flex flex-col gap-6 overflow-hidden">

                    {/* Create Group Form */}
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-pink-50 flex-shrink-0">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full"></span> New Group
                        </h3>
                        <form onSubmit={handleGroupSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" required value={groupForm.admin_name} onChange={e => setGroupForm({ ...groupForm, admin_name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold" placeholder="Admin Name (e.g. Size)" />
                                <input type="text" required value={groupForm.customer_name} onChange={e => setGroupForm({ ...groupForm, customer_name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold" placeholder="Customer Title" />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Min</label>
                                    <input type="number" min="0" value={groupForm.min_selection} onChange={e => setGroupForm({ ...groupForm, min_selection: parseInt(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Max</label>
                                    <input type="number" min="1" value={groupForm.max_selection} onChange={e => setGroupForm({ ...groupForm, max_selection: parseInt(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold" />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={groupForm.is_required} onChange={e => setGroupForm({ ...groupForm, is_required: e.target.checked })} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                                        <span className="text-xs font-bold text-gray-700">Required</span>
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary text-white font-bold py-2.5 rounded-xl shadow-lg shadow-pink-200 uppercase tracking-widest text-xs">Create Group</button>
                        </form>
                    </div>

                    {/* Groups List (Scrollable) */}
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-pink-50 flex-1 overflow-y-auto min-h-0">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Groups ({groups.length})</h3>
                        <ul className="space-y-2">
                            {groups.map(g => (
                                <li
                                    key={g.id}
                                    onClick={() => setSelectedGroup(g)}
                                    className={`p-4 rounded-xl transition-all cursor-pointer border ${selectedGroup?.id === g.id ? 'bg-primary text-white border-primary shadow-lg shadow-pink-200' : 'bg-gray-50 hover:bg-pink-50 border-transparent'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-base">{g.admin_name}</div>
                                            <div className={`text-xs mt-1 ${selectedGroup?.id === g.id ? 'text-pink-100' : 'text-gray-500'}`}>
                                                {g.customer_name} • {g.is_required ? 'Req' : 'Opt'} ({g.min_selection}-{g.max_selection})
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteGroup(g.id); }}
                                            className={`p-2 rounded-lg transition-colors ${selectedGroup?.id === g.id ? 'text-white hover:bg-white/20' : 'text-gray-400 hover:text-red-500 hover:bg-white'}`}
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Items Manager */}
                <div className="col-span-12 md:col-span-7 bg-white rounded-3xl shadow-xl border border-pink-50 flex flex-col min-h-0 overflow-hidden">
                    {selectedGroup ? (
                        <>
                            {/* Group Header */}
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-2xl font-bold text-gray-800">{selectedGroup.admin_name} <span className="text-gray-400 font-normal text-sm">/ Items</span></h3>
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Select {selectedGroup.min_selection} - {selectedGroup.max_selection}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Customer sees: "{selectedGroup.customer_name}"</p>
                            </div>

                            {/* Add Item Form */}
                            <div className="p-6 bg-pink-50/30 border-b border-pink-100">
                                <h4 className="text-sm font-bold text-gray-600 uppercase mb-3">Add Option to Group</h4>
                                <form onSubmit={handleItemSubmit} className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-400 mb-1 block">Option Name</label>
                                        <input type="text" required value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Extra Cheese" />
                                    </div>
                                    <div className="w-24">
                                        <label className="text-xs font-bold text-gray-400 mb-1 block">Price (+)</label>
                                        <input type="number" step="0.01" min="0" value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" placeholder="0.00" />
                                    </div>
                                    <div className="w-24">
                                        <label className="text-xs font-bold text-gray-400 mb-1 block">Cals</label>
                                        <input type="number" min="0" value={itemForm.calories} onChange={e => setItemForm({ ...itemForm, calories: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" placeholder="0" />
                                    </div>
                                    <button type="submit" className="bg-gray-800 text-white font-bold h-[38px] px-4 rounded-xl shadow-lg hover:bg-gray-700 transition-colors flex items-center justify-center">
                                        <FaPlus />
                                    </button>
                                </form>
                            </div>

                            {/* Items List */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {groupItems.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <span className="text-4xl mb-2">🥗</span>
                                        <p className="font-bold">No options added yet.</p>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                <th className="pb-3 pl-2">Option Name</th>
                                                <th className="pb-3 text-right">Price</th>
                                                <th className="pb-3 text-right">Calories</th>
                                                <th className="pb-3 pr-2 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {groupItems.map(item => (
                                                <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 pl-2 font-bold text-gray-700">{item.name}</td>
                                                    <td className="py-3 text-right font-bold text-primary">
                                                        {item.price > 0 ? `+£${parseFloat(item.price).toFixed(2)}` : 'Free'}
                                                    </td>
                                                    <td className="py-3 text-right text-gray-500 font-medium text-sm">
                                                        {item.calories ? `${item.calories} kcal` : '-'}
                                                    </td>
                                                    <td className="py-3 pr-2 text-right">
                                                        <button
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                            <span className="text-4xl mb-4 text-gray-300">👈</span>
                            <p className="font-bold text-lg text-gray-500">Select a group to manage options</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Customization;
