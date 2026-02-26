import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChartBar, FaShoppingCart, FaList, FaTags, FaUtensils, FaUsers, FaCog, FaMotorcycle, FaTicketAlt, FaSignOutAlt, FaLayerGroup, FaHamburger } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth(); // Assuming useAuth exists and provides logout

    const menuItems = [
        { path: '/admin', icon: <FaChartBar />, label: 'Dashboard' },
        { path: '/admin/orders', icon: <FaShoppingCart />, label: 'Orders' },
        { path: '/admin/items', icon: <FaHamburger />, label: 'Items' },
        { path: '/admin/categories', icon: <FaList />, label: 'Categories' },
        { path: '/admin/sub-categories', icon: <FaLayerGroup />, label: 'Sub Categories' },
        { path: '/admin/customization', icon: <FaUtensils />, label: 'Customization' },
        { path: '/admin/coupons', icon: <FaTicketAlt />, label: 'Coupons' },
        { path: '/admin/riders', icon: <FaMotorcycle />, label: 'Riders' },
        { path: '/admin/reports', icon: <FaChartBar />, label: 'Reports' },
        { path: '/admin/customers', icon: <FaUsers />, label: 'Customers' },
        { path: '/admin/settings', icon: <FaCog />, label: 'Store Settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-[#FFF5E5]">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-[#FFF5E5] border-r border-[#E6DCC8] overflow-y-auto z-50 shadow-sm hidden md:block">
                <div className="p-6 border-b border-[#E6DCC8] flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">L</div>
                    <span className="font-heading font-bold text-xl text-gray-800 tracking-tight">Loafers Admin</span>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-base transition-all duration-200 group ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-pink-200'
                                    : 'text-gray-600 hover:bg-white hover:text-primary hover:shadow-md'
                                    }`}
                            >
                                <span className={`text-xl ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-[#E6DCC8] bg-[#FFF5E5]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-lg transition-colors text-base"
                    >
                        <FaSignOutAlt className="text-xl" /> Logout
                    </button>
                    <div className="mt-2 text-center text-xs text-gray-400 font-bold">
                        Loafers Admin v1.0
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay (if needed later) could go here */}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen bg-[#FFF5E5]">
                {/* Header (Mobile only generally) */}
                <div className="md:hidden bg-[#FFF5E5] p-4 items-center justify-between flex border-b border-[#E6DCC8] sticky top-0 z-40">
                    <span className="font-heading font-bold text-xl text-gray-800">Loafers</span>
                    <button className="text-gray-600 text-2xl"><FaList /></button>
                </div>

                <div className="p-6 w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
