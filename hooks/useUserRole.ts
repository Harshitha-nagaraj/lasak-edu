import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export type UserRole = 'admin' | 'editor' | 'viewer';

export const useUserRole = () => {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        console.log('useUserRole: Setting up Auth listener...');
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (!user || !user.email) {
                    console.log('useUserRole: No user found');
                    setRole(null);
                    setEmail(null);
                    setLoading(false);
                    return;
                }

                const userEmail = user.email.toLowerCase();
                console.log('useUserRole: Found user:', userEmail);
                setEmail(userEmail);

                // EMERGENCY OVERRIDE: Prevent lockout for main admin
                if (userEmail === 'info@lasakedu.in') {
                    console.log('useUserRole: EMERGENCY BYPASS triggered');
                    setRole('admin');
                    setLoading(false);
                    return;
                }

                console.log('useUserRole: Querying Firestore for role...');
                const roleDoc = await getDoc(doc(db, 'user_roles', userEmail));

                if (roleDoc.exists()) {
                    const data = roleDoc.data();
                    console.log('useUserRole: Role found:', data.role);
                    setRole(data.role as UserRole);
                } else {
                    console.warn('useUserRole: No role document found for', userEmail);
                    setRole(null);
                }
            } catch (err: any) {
                console.error('useUserRole Error:', err.message || err);
                setRole(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return {
        role,
        loading,
        email,
        isAdmin: role === 'admin',
        isEditor: role === 'editor' || role === 'admin',
        isViewer: role === 'viewer',
        canEdit: role === 'admin' || role === 'editor',
        canManageUsers: role === 'admin',
    };
};
