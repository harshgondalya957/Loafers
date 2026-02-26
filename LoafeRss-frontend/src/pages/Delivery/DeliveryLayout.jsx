import React, { useState } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';

const DeliveryLayout = () => {
    const [rider, setRider] = useState(() => {
        try {
            const saved = localStorage.getItem('loafers_rider');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            localStorage.removeItem('loafers_rider');
            return null;
        }
    });
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('loafers_rider');
        setRider(null);
        navigate('/delivery/login');
    };

    if (!rider && location.pathname !== '/delivery/login') {
        return <Navigate to="/delivery/login" replace />;
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-100 font-sans">
                {rider && location.pathname !== '/delivery/login' && (
                    <div className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-10">
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">Loafers Delivery</h1>
                            <p className="text-xs text-gray-500">Hi, {rider?.name || 'Rider'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}
                <div className="pb-20">
                    <Outlet context={{ rider, setRider }} />
                </div>
            </div>
        </ErrorBoundary>
    );
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Delivery Dashboard Error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-4">Please try refreshing the page.</p>
                    <details className="text-left bg-gray-100 p-4 rounded text-xs overflow-auto max-w-full w-full">
                        <summary className="font-bold cursor-pointer mb-2">Error Details</summary>
                        <pre className="whitespace-pre-wrap text-red-500">{this.state.error?.toString()}</pre>
                        <pre className="whitespace-pre-wrap text-gray-500 mt-2">{this.state.errorInfo?.componentStack}</pre>
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 bg-primary text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-primary/90"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default DeliveryLayout;
