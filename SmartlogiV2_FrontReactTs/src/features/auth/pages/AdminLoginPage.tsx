import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser } from '../authSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AdminLoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(loginUser({ email, password }));
        
        if (loginUser.fulfilled.match(result)) {
            console.log("Login successful, payload:", result.payload);
            navigate('/admin-dashboard');
        }
    };

    return (
        <div className="min-h-screen flex bg-stone-50 overflow-hidden font-sans">
             {/* Left Brand Panel - Admin Variant */}
             <div className="hidden lg:flex lg:w-1/2 bg-black relative justify-center items-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(234,88,12,0.1))]"></div>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ea580c 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                 <div className="relative z-10 text-center px-12">
                     <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-900 border border-stone-800 rounded-2xl mb-8 shadow-2xl">
                        <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                     </div>
                     <h2 className="text-4xl font-black text-white tracking-tight mb-4">Admin Command</h2>
                     <p className="text-stone-500 font-mono text-sm leading-relaxed max-w-md mx-auto">
                        SYSTEM_ACCESS_LEVEL_1 // RESTRICTED
                     </p>
                </div>
            </div>

             {/* Right Form Panel */}
             <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                         <h1 className="text-3xl font-bold text-slate-900 mb-2">System Login</h1>
                         <p className="text-slate-500">Please verify your credentials</p>
                    </div>

                    {error && (
                         <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm mb-6 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input 
                            type="email" 
                            label="Admin Email"
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
                        
                        <Button type="submit" variant="secondary" className="w-full bg-slate-900 hover:bg-black text-white shadow-none" isLoading={isLoading}>
                            Authenticate
                        </Button>
                    </form>
                </div>
             </div>
        </div>
    );
};

export default AdminLoginPage;
