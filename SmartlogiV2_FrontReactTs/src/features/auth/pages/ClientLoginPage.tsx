import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser } from '../authSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ClientLoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(loginUser({ email, password }));
        
        if (loginUser.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    const handleOAuthLogin = (provider: 'google' | 'facebook' | 'github') => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    };

    return (
        <div className="min-h-screen flex bg-stone-50 overflow-hidden font-sans">
            {}
            <div className="hidden lg:flex lg:w-1/2 bg-amber-950 relative justify-center items-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/30 to-transparent opacity-70"></div>
                
                {}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="white" strokeWidth="0.5" />
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="white" strokeWidth="0.5" transform="translate(0, -10) scale(1.1)" />
                    </svg>
                </div>

                <div className="relative z-10 text-center px-12">
                     <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-8 shadow-2xl shadow-orange-500/40">
                         <span className="text-3xl font-black text-white">S</span>
                     </div>
                     <h2 className="text-4xl font-black text-white tracking-tight mb-4">Welcome Back</h2>
                     <p className="text-orange-100/60 leading-relaxed max-w-md mx-auto">
                        Manage your shipments, track deliveries in real-time, and access your logistics dashboard.
                     </p>
                </div>

                <div className="absolute bottom-8 left-8 text-orange-100/20 text-xs font-mono">
                    SECURE_TERMINAL_V2.0
                </div>
            </div>

            {}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md">
                     <div className="text-center lg:text-left mb-10">
                         <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
                         <p className="text-slate-500">Access the Client Portal</p>
                     </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm mb-6 flex items-center gap-2 animate-pulse">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input 
                            type="email" 
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        
                         <div className="space-y-1">
                            <Input 
                                type="password" 
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-xs font-semibold text-orange-600 hover:text-orange-500 hover:underline transition">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                     <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-stone-50 px-4 text-slate-400 font-bold">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                             type="button"
                             onClick={() => handleOAuthLogin('google')}
                             className="flex items-center justify-center py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-orange-200 transition-all duration-300 text-slate-700 font-semibold text-sm group"
                        >
                            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Google
                        </button>
                        <button 
                            type="button"
                            onClick={() => handleOAuthLogin('facebook')}
                             className="flex items-center justify-center py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-orange-200 transition-all duration-300 text-slate-700 font-semibold text-sm group"
                        >
                            <svg className="w-5 h-5 mr-2 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            Facebook
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-orange-600 hover:text-orange-500 font-bold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClientLoginPage;
