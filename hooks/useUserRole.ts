import { useEffect, useState } from 'react';

export type UserRole = 'admin' | 'editor' | 'viewer' | 'sales';

export const useUserRole = () => {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const setupAuth = async () => {
            const { getFirebaseAuth, getFirestoreDb } = await import('../lib/firebase');
            const { onAuthStateChanged } = await import('firebase/auth');
            const { doc, getDoc } = await import('firebase/firestore');
            const auth = await getFirebaseAuth();
            const db = await getFirestoreDb();

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

                    // EMERGENCY OVERRIDE: Prevent lockout for main admins
                    if (userEmail === 'info@lasakedu.in' || userEmail === 'brindhaa.lasak@gmail.com') {
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
            return unsubscribe;
        };

        let unsubscribe: (() => void) | undefined;
        setupAuth().then(unsub => {
            unsubscribe = unsub;
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return {
        role,
        loading,
        email,
        isAdmin: role === 'admin',
        isEditor: role === 'editor' || role === 'admin',
        isViewer: role === 'viewer',
        isSales: role === 'sales',
        canEdit: role === 'admin' || role === 'editor',
        canManageUsers: role === 'admin',
    };
};
