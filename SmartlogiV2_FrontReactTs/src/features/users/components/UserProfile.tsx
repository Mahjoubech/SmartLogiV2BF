
import React, { useState } from 'react';
import type { User } from '../../auth/authSlice';
import { useAppDispatch } from '../../../store/hooks';
import { updatePassword } from '../../auth/authSlice';

interface UserProfileProps {
    user: User | null;
    onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
    const dispatch = useAppDispatch();
    const [passwords, setPasswords] = useState({
        current: '',
        newPwd: '',
        confirm: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    const initials = user?.prenom && user?.nom 
        ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}` 
        : 'U';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (passwords.newPwd !== passwords.confirm) {
            setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
            return;
        }

        setLoading(true);
        try {
            await dispatch(updatePassword({
                currentPassword: passwords.current,
                newPassword: passwords.newPwd
            })).unwrap();
            setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès.' });
            setPasswords({ current: '', newPwd: '', confirm: '' });
        } catch (err: any) {
            setMessage({ type: 'error', text: typeof err === 'string' ? err : 'Échec de la mise à jour.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-stone-200 rounded-3xl p-8 max-w-4xl w-full shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 mx-auto">
             
             {}
             <div className="flex-1">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center text-3xl shadow-sm text-orange-600 font-bold uppercase">
                        {initials}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{user?.prenom} {user?.nom}</h2>
                        <span className="px-2 py-0.5 bg-orange-50 rounded text-xs text-orange-600 font-mono uppercase border border-orange-100">{user?.role?.name}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-[10px] uppercase text-slate-500 tracking-widest mb-1">Adresse Email</span>
                        <div className="text-slate-900 font-medium">{user?.email}</div>
                    </div>
                     <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-[10px] uppercase text-slate-500 tracking-widest mb-1">Numéro de Téléphone</span>
                        <div className="text-slate-900 font-medium">{user?.telephone || 'N/A'}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                            <span className="block text-[10px] uppercase text-slate-500 tracking-widest mb-1">Rôle</span>
                            <div className="text-slate-900 font-bold">{user?.role?.name}</div>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                            <span className="block text-[10px] uppercase text-slate-500 tracking-widest mb-1">ID Utilisateur</span>
                            <div className="text-slate-900 font-mono text-xs truncate" title={user?.id}>{user?.id?.substring(0,8)}...</div>
                        </div>
                    </div>
                </div>
             </div>

             {}
             <div className="flex-1 border-t md:border-t-0 md:border-l border-stone-200 pt-8 md:pt-0 md:pl-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Sécurité</h3>
                
                {message && (
                    <div className={`mb-4 p-3 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Mot de passe actuel</label>
                        <input name="current" type="password" value={passwords.current} onChange={handleChange} required className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-slate-900 focus:border-orange-500 outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Nouveau mot de passe</label>
                        <input name="newPwd" type="password" value={passwords.newPwd} onChange={handleChange} required className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-slate-900 focus:border-orange-500 outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Confirmer le mot de passe</label>
                        <input name="confirm" type="password" value={passwords.confirm} onChange={handleChange} required className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-slate-900 focus:border-orange-500 outline-none transition" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg hover:bg-orange-100 transition font-bold disabled:opacity-50">
                            {loading ? 'Mise à jour...' : 'Mettre à jour'}
                        </button>
                    </div>
                </form>

                <div className="mt-12 pt-8 border-t border-stone-200">
                     <button className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold border border-red-100 hover:bg-red-100 transition flex items-center justify-center gap-2" onClick={onLogout}>
                        <span className="text-lg">🚪</span> Se Déconnecter
                     </button>
                </div>
             </div>

        </div>
    );
};

export default UserProfile;
