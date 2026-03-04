import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight } from 'lucide-react';
import { auth } from '../../lib/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
} from 'firebase/auth';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const normalizedEmail = email.trim().toLowerCase();
            const normalizedPassword = password.trim();

            if (isForgotPassword) {
                await sendPasswordResetEmail(auth, normalizedEmail);
                alert('Success! Please check your email for the password reset link.');
                setIsForgotPassword(false);
                return;
            }

            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, normalizedEmail, normalizedPassword);
                alert('Account created successfully! You can now sign in.');
                setIsSignUp(false);
            } else {
                console.log("Attempting Firebase sign in for:", normalizedEmail);

                await signInWithEmailAndPassword(auth, normalizedEmail, normalizedPassword);

                console.log("Sign-in successful");
                // navigate to dashboard
                navigate('/admin/dashboard', { replace: true });
            }
        } catch (error: any) {
            console.error("Auth Error:", error);

            let message = "Authentication failed. Please check your credentials.";

            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                message = "Invalid email or password.";
            } else if (error.code === 'auth/email-already-in-use') {
                message = "This email is already registered. Please sign in instead.";
            } else if (error.code === 'auth/weak-password') {
                message = "Password should be at least 6 characters.";
            } else if (error.code === 'auth/network-request-failed') {
                message = "Network error. Please check your internet connection.";
            } else if (error.message) {
                message = error.message;
            }

            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md z-10 border border-white/50"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {isForgotPassword ? 'Reset Password' : (isSignUp ? 'Create Account' : 'Admin Portal')}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {isForgotPassword ? 'Enter your email to receive a reset link' : (isSignUp ? 'Sign up to access the dashboard' : 'Sign in to manage Lasak Edu')}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    {!isForgotPassword && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                    required={!isForgotPassword}
                                    minLength={6}
                                />
                            </div>
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {isForgotPassword ? 'Send Reset Link' : (isSignUp ? 'Sign Up' : 'Sign In')}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>

                    <div className="text-center mt-4 space-y-3">
                        {!isForgotPassword && (
                            <button
                                type="button"
                                onClick={() => setIsForgotPassword(true)}
                                className="block w-full text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                            >
                                Forgot Password?
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                if (isForgotPassword) {
                                    setIsForgotPassword(false);
                                } else {
                                    setIsSignUp(!isSignUp);
                                }
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            {isForgotPassword
                                ? 'Back to Login'
                                : (isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up")}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
