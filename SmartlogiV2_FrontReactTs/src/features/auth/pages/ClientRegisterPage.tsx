import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { registerUser } from '../authSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ClientRegisterPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return;
        }

        const result = await dispatch(registerUser(formData));
        
        if (registerUser.fulfilled.match(result)) {
            navigate('/verify-email', { state: { email: formData.email } });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
            {/* Cinematic Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: "url('/assets/images/hero-bg.png')" }}
            >
                 <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
            </div>

            {/* Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-500 m-4">
                
                {/* Visual Side (Left) */}
                <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-orange-600/90 to-amber-700/90 p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-400 rounded-full mix-blend-overlay blur-3xl opacity-50"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                             <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-xl border border-white/30">
                                S
                            </div>
                            <span className="text-xl font-bold tracking-tight">SMART<span className="text-orange-200">LOGI</span></span>
                        </div>
                        <h2 className="text-4xl font-black leading-tight mb-6">Start Your <br/> Journey.</h2>
                        <p className="text-orange-100/80 leading-relaxed font-medium">
                            Join thousands of businesses streamlining their logistics with our AI-powered global network.
                        </p>
                    </div>

                    <div className="relative z-10">
                         <div className="flex -space-x-4 mb-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-orange-500 bg-slate-200" style={{ backgroundImage: `url('https://i.pravatar.cc/150?img=${i + 10}')`, backgroundSize: 'cover' }}></div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-white flex items-center justify-center text-xs font-bold text-orange-600">+2k</div>
                        </div>
                        <p className="text-xs text-orange-100 font-bold uppercase tracking-widest">Trusted by Industry Leaders</p>
                    </div>
                </div>

                {/* Form Side (Right) */}
                <div className="w-full md:w-7/12 bg-white/95 p-8 md:p-12">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
                            <p className="text-slate-500 text-sm">Join SmartLogi today</p>
                        </div>
                        <Link to="/" className="text-xs font-bold text-slate-400 hover:text-orange-600 transition uppercase tracking-wider">
                            Back to Home
                        </Link>
                     </div>

                     {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm mb-6 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                         <div className="grid grid-cols-2 gap-4">
                             <Input 
                                type="text"
                                name="prenom"
                                label="First Name"
                                value={formData.prenom}
                                onChange={handleChange}
                                required
                             />
                             <Input 
                                type="text"
                                name="nom"
                                label="Last Name"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                             />
                         </div>

                        <Input 
                            type="email" 
                            name="email"
                            label="Email Address" 
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                type="tel" 
                                name="telephone"
                                label="Phone Number" 
                                value={formData.telephone}
                                onChange={handleChange}
                                required
                            />
                            <Input 
                                type="text" 
                                name="adresse"
                                label="Address" 
                                value={formData.adresse}
                                onChange={handleChange}
                                required
                            />
                        </div>

                         <div className="space-y-4 pt-2">
                            <Input 
                                type="password" 
                                name="password"
                                label="Password" 
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <Input 
                                type="password" 
                                name="confirmPassword"
                                label="Confirm Password" 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Button type="submit" variant="primary" className="w-full mt-2 shadow-xl shadow-orange-500/20" isLoading={isLoading}>
                            Register Now
                        </Button>
                    </form>

                     <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-orange-600 hover:text-orange-500 font-bold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClientRegisterPage;
