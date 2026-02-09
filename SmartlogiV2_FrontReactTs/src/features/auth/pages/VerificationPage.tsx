import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { verifyAccount } from '../authSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const VerificationPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const email = location.state?.email;
    const [code, setCode] = useState('');

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        const result = await dispatch(verifyAccount({ email, code }));
        
        if (verifyAccount.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
             {}
             <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: "url('/assets/images/hero-bg.png')" }}
            >
                 <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
            </div>

            {}
            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                     <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-6 border border-orange-500/30">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                     </div>
                    <h1 className="text-3xl font-black text-white mb-2">Check your Email</h1>
                    <p className="text-orange-100/80">
                        We've sent a verification code to <br/>
                        <span className="font-bold text-white">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-200 p-4 rounded-xl border border-red-500/30 text-sm mb-6 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input 
                            type="text" 
                            label="Verification Code" 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                            required
                            className="text-center text-2xl tracking-widest font-mono !bg-white/90"
                            maxLength={6}
                        />
                    </div>

                    <Button type="submit" variant="primary" className="w-full shadow-orange-500/20" isLoading={isLoading}>
                        Verify Account
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-orange-100/60 mb-2">Didn't receive the code?</p>
                    <button className="text-white hover:text-orange-400 font-bold text-sm transition tracking-wide uppercase">
                        Resend Code
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;
