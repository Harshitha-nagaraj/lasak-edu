import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, UserPlus, Shield, User, Save, X, Edit2, CheckCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useUserRole } from '../../hooks/useUserRole';

interface UserData {
    id: string;
    email: string;
    full_name?: string;
    phone_number?: string;
    role?: 'admin' | 'editor' | 'viewer';
    created_at: string;
}

const UserManager = () => {
    const { canManageUsers, loading: roleLoading } = useUserRole();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserFullName, setNewUserFullName] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRole, setEditRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
    const [editPassword, setEditPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // 1. Fetch all user roles (This is the source of truth for who has access)
            const rolesSnapshot = await getDocs(query(collection(db, 'user_roles'), orderBy('created_at', 'desc')));
            const roles = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

            // 2. Fetch all profiles
            const profilesSnapshot = await getDocs(collection(db, 'profiles'));
            const profiles = profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

            // 3. Combine data, using roles as the base
            const combinedData = (roles || []).map(role => {
                const profile = profiles?.find(p => p.email === role.email);
                return {
                    id: role.id, // Use the role ID as the primary key for the list
                    auth_id: profile?.id, // Keep the auth ID for profile-related actions
                    email: role.email,
                    full_name: profile?.full_name || role.full_name,
                    phone_number: profile?.phone_number,
                    role: role.role as 'admin' | 'editor' | 'viewer',
                    created_at: profile?.created_at || (role.created_at?.toDate ? role.created_at.toDate().toISOString() : role.created_at)
                };
            });

            setUsers(combinedData);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserEmail) return;

        try {
            // In Firebase client-side, we can't create another user's auth account without logging out.
            // But we can add them to 'user_roles' which will grant them permissions once they sign up.
            const userRoleData = {
                email: newUserEmail.trim().toLowerCase(),
                full_name: newUserFullName.trim(),
                role: newUserRole,
                created_at: serverTimestamp()
            };

            // Use email as doc ID to prevent duplicates
            const docId = newUserEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
            await setDoc(doc(db, 'user_roles', docId), userRoleData);

            alert(`✅ User role added! They will have ${newUserRole} access once they sign up with this email.`);

            setNewUserEmail('');
            setNewUserFullName('');
            setNewUserRole('viewer');
            setIsAdding(false);
            fetchUsers();
        } catch (error: any) {
            alert('Error adding user: ' + error.message);
        }
    };

    const handleDeleteUser = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove access for ${email}?`)) return;

        try {
            await deleteDoc(doc(db, 'user_roles', id));
            alert('✅ User role removed. Their account still exists in Auth, but they no longer have permissions.');
            fetchUsers();
        } catch (error: any) {
            console.error('Delete error:', error);
            alert('Error deleting user: ' + error.message);
        }
    };

    const startEdit = (user: UserData) => {
        setEditingId(user.id);
        setEditRole(user.role);
    };

    const handleSendPasswordReset = async (email: string) => {
        if (!confirm(`Are you sure you want to send a password reset email to ${email}?`)) return;
        try {
            await sendPasswordResetEmail(auth, email);
            alert(`✅ Password reset email sent to ${email}`);
        } catch (error: any) {
            console.error('Password reset error:', error);
            alert('Error sending password reset email: ' + error.message);
        }
    };

    const handleUpdateUser = async (user: UserData) => {
        try {
            await updateDoc(doc(db, 'user_roles', user.id), {
                role: editRole,
                full_name: user.full_name
            });

            setEditingId(null);
            fetchUsers();
            alert('User role updated successfully!');
        } catch (error: any) {
            alert('Error updating user: ' + error.message);
        }
    };

    if (roleLoading || loading) return <div className="p-8">Loading...</div>;

    if (!canManageUsers) {
        return (
            <div className="p-8 text-center text-red-500">
                <Shield size={48} className="mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p>You do not have permission to manage users.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">User Management</h1>
                    <p className="text-slate-500 mt-2">Manage admin access and roles.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                    {isAdding ? <X size={20} /> : <UserPlus size={20} />}
                    {isAdding ? 'Cancel' : 'Add User'}
                </button>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
                >
                    <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={newUserFullName}
                                onChange={(e) => setNewUserFullName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder="user@example.com"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newUserPassword}
                                    onChange={(e) => setNewUserPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                            <select
                                value={newUserRole}
                                onChange={(e) => setNewUserRole(e.target.value as any)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Save User
                        </button>
                    </form>
                </motion.div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User Details</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date Joined</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user.full_name || 'No Name'}</p>
                                            <p className="text-sm text-slate-500">{user.email}</p>
                                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID: {user.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-700">{user.phone_number || 'N/A'}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === user.id ? (
                                        <div className="space-y-2 py-1">
                                            <select
                                                value={editRole}
                                                onChange={(e) => setEditRole(e.target.value as any)}
                                                className="w-full px-3 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                                            >
                                                <option value="viewer">Viewer</option>
                                                <option value="editor">Editor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <input
                                                type="password"
                                                value={editPassword}
                                                onChange={(e) => setEditPassword(e.target.value)}
                                                placeholder="New Password (optional)"
                                                className="w-full px-3 py-1.5 text-xs border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    ) : (
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize border ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-700 border-purple-200'
                                            : user.role === 'editor'
                                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                : 'bg-slate-100 text-slate-400 border-slate-200'
                                            }`}>
                                            {user.role || 'No Access'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {editingId === user.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateUser(user)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Save"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Cancel"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleSendPasswordReset(user.email)}
                                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                                    title="Send Password Reset"
                                                >
                                                    <KeyRound size={18} />
                                                </button>
                                                <button
                                                    onClick={() => startEdit(user)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Role"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDeleteUser(user.id, user.email)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove Access"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                    <UserPlus size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No users found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;
