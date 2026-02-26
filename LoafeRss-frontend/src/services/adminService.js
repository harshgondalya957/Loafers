const API_URL = 'http://localhost:5001/api/admin';

export const createStore = async (storeData) => {
    try {
        const response = await fetch(`${API_URL}/store`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(storeData),
        });
        if (!response.ok) throw new Error('Failed to create store');
        return await response.json();
    } catch (error) {
        console.error("Error creating store:", error);
        throw error;
    }
};

export const getOrderReports = async (type = 'date') => {
    try {
        const response = await fetch(`${API_URL}/reports/orders?type=${type}`);
        if (!response.ok) throw new Error(`Orders report failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error creating store:", error);
        throw error;
    }
};

export const getSalesReports = async (type = 'date') => {
    try {
        const response = await fetch(`${API_URL}/reports/sales?type=${type}`);
        if (!response.ok) throw new Error(`Sales report failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error creating store:", error);
        throw error;
    }
};

export const getCustomers = async (type = 'date') => {
    try {
        const response = await fetch(`${API_URL}/customers?type=${type}`);
        if (!response.ok) throw new Error(`Customer list failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error creating store:", error);
        throw error;
    }
};

