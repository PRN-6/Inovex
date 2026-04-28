import React, { createContext, useContext, useState, useCallback } from 'react';
import { Shield, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });

    const showNotify = useCallback((message, type = 'error') => {
        setNotification({ show: true, message, type });
        // Auto-hide after 5 seconds
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 5000);
    }, []);

    const hideNotify = useCallback(() => {
        setNotification(prev => ({ ...prev, show: false }));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotify }}>
            {children}
            {notification.show && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md animate-in zoom-in fade-in duration-300">
                    <div className={`p-5 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl border flex items-start gap-4 ${notification.type === 'error' ? 'bg-red-600/90 border-red-500/50' : 'bg-amber-600/90 border-amber-500/50'}`}>
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Shield size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-[10px] font-black tracking-[0.3em] text-white/60 uppercase mb-1">System Alert</h4>
                            <p className="text-xs font-bold tracking-wider text-white uppercase leading-relaxed">{notification.message}</p>
                        </div>
                        <button onClick={hideNotify} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <X size={18} className="text-white/60 hover:text-white" />
                        </button>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};
