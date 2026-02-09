import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { registerUser } from '../authSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface RegisterFormProps {
    onSuccess?: () => void;
    switchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, switchToLogin }) => {
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
            if (onSuccess) onSuccess();
            navigate('/dashboard');
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
             <div className="text-center mb-8">
                 <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                 <p className="text-slate-500">Join the SmartLogi network</p>
             </div>

             {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm mb-6 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
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

                <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                    Register Now
                </Button>
            </form>

             {switchToLogin && (
                <p className="mt-8 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <button onClick={switchToLogin} className="text-orange-600 hover:text-orange-500 font-bold hover:underline">
                        Log in
                    </button>
                </p>
            )}
        </div>
    );
};

export default RegisterForm;
