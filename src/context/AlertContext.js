import React, { createContext, useState, useContext, useCallback } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const showAlert = useCallback((message, type = 'info') => {
        // Validation for the 4 soft types
        const validTypes = ['success', 'warning', 'destructive', 'info'];
        const toastType = validTypes.includes(type) ? type : 'info';

        const id = Date.now().toString();
        const newAlert = { id, message, type: toastType };

        setAlerts((prev) => [...prev, newAlert]);

        // Auto-dismiss after 6 seconds
        setTimeout(() => {
            removeAlert(id);
        }, 6000);
    }, []);

    const removeAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, removeAlert, alerts }}>
            {children}
        </AlertContext.Provider>
    );
};
