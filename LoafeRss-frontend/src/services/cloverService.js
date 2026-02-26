const API_URL = 'https://loafers.onrender.com/api';

/**
 * Tokenizes card details securely.
 * Note: In a real production application, you MUST use Clover's iframe (Clover Elements API)
 * to securely collect and tokenize card details to maintain PCI compliance.
 * This function simulates tokenization for sandbox and development purposes.
 */
export const tokenizeCard = async (cardDetails) => {
    return new Promise((resolve, reject) => {
        if (cardDetails.cardNumber && cardDetails.expiry && cardDetails.cvv) {
            // For backend proxy flow, return the cardDetails directly 
            // the backend server will tokenize and charge
            resolve({ token: cardDetails });
        } else {
            reject(new Error('Invalid card details provided.'));
        }
    });
};

/**
 * Sends the tokenized payment information and order details to the backend to create a Clover charge.
 */
export const processCloverPayment = async (orderPayload) => {
    try {
        const response = await fetch(`${API_URL}/shop/clover/charge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Payment failed on server.');
        }

        return data;
    } catch (error) {
        console.error('Clover Payment Service Error:', error);
        throw error;
    }
};
