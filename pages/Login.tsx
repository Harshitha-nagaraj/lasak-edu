import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, UserPlus, AlertCircle, CheckCircle2, KeyRound, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const signupSuccess = new URLSearchParams(location.search).get('signupSuccess') === 'true';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResetSuccess(false);
        try {
            const { getFirebaseAuth } = await import('../lib/firebase');
            const { signInWithEmailAndPassword, sendPasswordResetEmail } = await import('firebase/auth');
            const auth = await getFirebaseAuth();

            const normalizedEmail = email.trim().toLowerCase();

            if (isForgotPassword) {
                await sendPasswordResetEmail(auth, normalizedEmail);
                setResetSuccess(true);
                setError(null);
                return;
            }

            const normalizedPassword = password.trim();

            await signInWithEmailAndPassword(
                auth,
                normalizedEmail,
                normalizedPassword
            );

            // Handle redirect if source location is provided
            const from = (location.state as any)?.from?.pathname || new URLSearchParams(location.search).get('redirectTo') || '/';
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error("Login Error:", err);
            if (err.code === 'auth/user-not-found') {
                setError("No account found with this email address.");
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError("Invalid email or password.");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Too many attempts. Please try again later.");
            } else {
                setError(err.message || "An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden px-4">
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
                        {isForgotPassword ? 'Reset Password' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {isForgotPassword ? 'Enter your email to receive a password reset link' : 'Sign in to your Lasak Edu account'}
                    </p>
                </div>

                {signupSuccess && !isForgotPassword && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-start gap-3"
                    >
                        <CheckCircle2 className="w-6 h-6 shrink-0 text-green-500" />
                        <div>
                            <p className="font-bold">Account Created Successfully!</p>
                            <p className="text-sm">Please login with your email and password to continue.</p>
                        </div>
                    </motion.div>
                )}

                {resetSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-start gap-3"
                    >
                        <CheckCircle2 className="w-6 h-6 shrink-0 text-green-500" />
                        <div>
                            <p className="font-bold">Reset Link Sent!</p>
                            <p className="text-sm">Please check your email inbox (and spam folder) for the password reset link.</p>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 flex items-start gap-2 text-sm"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <button
                                    type="button"
                                    onClick={() => { setIsForgotPassword(true); setError(null); setResetSuccess(false); }}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {isForgotPassword ? (
                                    <><KeyRound className="w-5 h-5" /> Send Reset Link</>
                                ) : (
                                    <>Sign In <ArrowRight className="w-5 h-5" /></>
                                )}
                            </>
                        )}
                    </motion.button>

                    <div className="text-center mt-6 space-y-4">
                        {isForgotPassword ? (
                            <button
                                type="button"
                                onClick={() => { setIsForgotPassword(false); setError(null); setResetSuccess(false); }}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                ← Back to Login
                            </button>
                        ) : (
                            <p className="text-sm text-gray-500">
                                Don't have an account?{' '}
                                <Link to={`/signup${location.search}`} className="text-blue-600 hover:text-blue-800 font-bold flex items-center justify-center gap-1 mt-1">
                                    <UserPlus className="w-4 h-4" /> Create one now
                                </Link>
                            </p>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
