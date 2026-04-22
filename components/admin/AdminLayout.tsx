
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [sessionLoading, setSessionLoading] = useState(true);
    const { loading: roleLoading } = useUserRole();

    useEffect(() => {
        const initAuth = async () => {
            const { getFirebaseAuth } = await import('../../lib/firebase');
            const { onAuthStateChanged } = await import('firebase/auth');
            const auth = await getFirebaseAuth();
            
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (!user) {
                    console.log('AdminLayout: No user found, redirecting...');
                    navigate('/admin/login', { replace: true });
                } else {
                    console.log('AdminLayout: User confirmed:', user.email);
                    setSessionLoading(false);
                }
            });
            return unsubscribe;
        };

        let unsubscribe: (() => void) | undefined;
        initAuth().then(unsub => { unsubscribe = unsub; });

        return () => { if (unsubscribe) unsubscribe(); };
    }, [navigate]);

    if (sessionLoading || roleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
