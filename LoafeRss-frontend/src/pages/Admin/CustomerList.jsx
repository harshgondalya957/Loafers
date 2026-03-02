import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { FaDownload } from 'react-icons/fa';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all'); // all, date, month, year
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [filterType, filterValue, customers]);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/admin/customers'); // Fetch all
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
                setFilteredCustomers(data);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        if (filterType === 'all') {
            setFilteredCustomers(customers);
            return;
        }

        if (!filterValue) return;

        const filtered = customers.filter(customer => {
            const date = new Date(customer.created_at);
            if (filterType === 'date') {
                return date.toISOString().split('T')[0] === filterValue;
            } else if (filterType === 'month') {
                const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                return monthStr === filterValue;
            } else if (filterType === 'year') {
                return date.getFullYear().toString() === filterValue;
            }
            return true;
        });
        setFilteredCustomers(filtered);
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredCustomers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
        XLSX.writeFile(workbook, `Customers_${filterType}_${filterValue || 'all'}.xlsx`);
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-50">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-4xl font-heading font-bold text-primary tracking-tighter">Customer List</h2>
                <button
                    onClick={downloadExcel}
                    className="flex items-center px-6 py-3 bg-[#10B981] text-white font-bold rounded-xl hover:bg-[#059669] shadow-lg shadow-green-100 transition-all transform hover:scale-105"
                >
                    <FaDownload className="mr-2" /> Download Excel
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 items-end bg-cream p-6 rounded-2xl border border-pink-100">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Filter By</label>
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => { setFilterType(e.target.value); setFilterValue(''); }}
                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary bg-white font-medium text-gray-700 appearance-none"
                        >
                            <option value="all">All Time</option>
                            <option value="date">Specific Date</option>
                            <option value="month">Specific Month</option>
                            <option value="year">Specific Year</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {filterType === 'date' && (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Date</label>
                        <input
                            type="date"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary bg-white font-medium text-gray-700"
                        />
                    </div>
                )}
                {filterType === 'month' && (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Month</label>
                        <input
                            type="month"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary bg-white font-medium text-gray-700"
                        />
                    </div>
                )}
                {filterType === 'year' && (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Year</label>
                        <input
                            type="number"
                            min="2020" max="2030" step="1"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary bg-white font-medium text-gray-700"
                        />
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Joined At</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-pink-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-400">#{customer.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{customer.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{new Date(customer.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-sm font-medium text-gray-400">
                                        No customers found for this period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerList;

