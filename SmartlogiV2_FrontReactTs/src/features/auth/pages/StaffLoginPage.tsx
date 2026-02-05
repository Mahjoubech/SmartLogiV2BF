import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser } from '../authSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const StaffLoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [role, setRole] = useState<'MANAGER' | 'LIVREUR'>('MANAGER');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(loginUser({ email, password }));
        
        if (loginUser.fulfilled.match(result)) {
            // Role-based redirect
            if (role === 'MANAGER') navigate('/manager-dashboard');
            else navigate('/livreur-dashboard');
        }
    };

    return (
        <div className="min-h-screen flex bg-stone-50 overflow-hidden font-sans">
             {/* Left Brand Panel - Staff Variant */}
             <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative justify-center items-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-900/50 to-transparent opacity-60"></div>
                
                 <div className="relative z-10 text-center px-12">
                     <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-2xl mb-8 backdrop-blur-sm">
                        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                     </div>
                     <h2 className="text-4xl font-black text-white tracking-tight mb-4">Staff Portal</h2>
                     <p className="text-slate-400 leading-relaxed max-w-md mx-auto">
                        Authorized access for Managers and Delivery Personnel. Secure. Efficient. Connected.
                     </p>
                </div>
            </div>

             {/* Right Form Panel */}
             <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                         <h1 className="text-3xl font-bold text-slate-900 mb-2">Staff Sign In</h1>
                         <p className="text-slate-500">Select your role to continue</p>
                    </div>

                    {error && (
                         <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm mb-6 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            {error}
                        </div>
                    )}

                    {/* Role Selector */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-stone-200 rounded-xl mb-8">
                        <button 
                            className={`py-2 text-sm font-bold rounded-lg transition-all ${role === 'MANAGER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setRole('MANAGER')}
                        >
                            Manager
                        </button>
                        <button 
                            className={`py-2 text-sm font-bold rounded-lg transition-all ${role === 'LIVREUR' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setRole('LIVREUR')}
                        >
                            Driver
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input 
                            type="email" 
                            label="Employee Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input 
                            type="password" 
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Access Dashboard
                        </Button>
                    </form>
                </div>
             </div>
        </div>
    );
};

export default StaffLoginPage;
