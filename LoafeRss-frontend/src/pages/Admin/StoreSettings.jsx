import React, { useEffect, useState } from 'react';
import { FaClock, FaToggleOn, FaToggleOff, FaPrint } from 'react-icons/fa';

const StoreSettings = () => {
    const [settings, setSettings] = useState({
        open_time: '09:00',
        close_time: '22:00',
        delivery_enabled: 1,
        pickup_enabled: 1,
        auto_print_enabled: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('https://loafers-backend-2.onrender.com/api/store/settings');
            if (res.ok) {
                const data = await res.json();
                if (data && data.open_time) setSettings(data);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch('https://loafers-backend-2.onrender.com/api/store/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert("Settings Updated!");
            }
        } catch (error) {
            console.error("Save failed", error);
        }
    };

    const toggle = (field) => {
        setSettings(prev => ({ ...prev, [field]: prev[field] ? 0 : 1 }));
    };

    if (loading) return <div className="text-center py-20 font-bold text-gray-400">Loading Settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl font-heading font-bold text-primary tracking-tighter">Store Settings</h2>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-50 space-y-8">
                {/* Timings */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaClock className="text-pink-400" /> Store Timings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Open Time</label>
                            <input
                                type="time"
                                value={settings.open_time}
                                onChange={(e) => setSettings({ ...settings, open_time: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">Close Time</label>
                            <input
                                type="time"
                                value={settings.close_time}
                                onChange={(e) => setSettings({ ...settings, close_time: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100"></div>

                {/* Toggles */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Operations</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-pink-50/30 transition-colors">
                            <span className="font-bold text-gray-700">Delivery Service</span>
                            <button onClick={() => toggle('delivery_enabled')} className={`text-3xl transition-colors ${settings.delivery_enabled ? 'text-green-500' : 'text-gray-300'}`}>
                                {settings.delivery_enabled ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-pink-50/30 transition-colors">
                            <span className="font-bold text-gray-700">Pickup Service</span>
                            <button onClick={() => toggle('pickup_enabled')} className={`text-3xl transition-colors ${settings.pickup_enabled ? 'text-green-500' : 'text-gray-300'}`}>
                                {settings.pickup_enabled ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100"></div>

                {/* Printing */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaPrint className="text-blue-400" /> Auto Print
                    </h3>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-pink-50/30 transition-colors">
                        <div>
                            <span className="block font-bold text-gray-700">Auto Print Receipt</span>
                            <span className="text-xs text-gray-500 font-medium">Automatically print order slip when new order arrives</span>
                        </div>
                        <button onClick={() => toggle('auto_print_enabled')} className={`text-3xl transition-colors ${settings.auto_print_enabled ? 'text-green-500' : 'text-gray-300'}`}>
                            {settings.auto_print_enabled ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        onClick={handleSave}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 uppercase tracking-widest text-sm"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoreSettings;

