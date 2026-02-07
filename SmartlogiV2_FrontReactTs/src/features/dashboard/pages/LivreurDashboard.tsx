import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectUser, logout } from '../../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../../users/components/UserProfile';

const LivreurDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const [activeTab, setActiveTab] = useState<'MISSIONS' | 'HISTORY' | 'PROFILE'>('MISSIONS');

    const handleLogout = () => {
        dispatch(logout());
        navigate('/staff-login');
    };

    return (
        <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-emerald-600 shadow-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center gap-2">
                         <span className="font-bold text-lg tracking-tight text-white">SmartLogi<span className="text-emerald-200">Driver</span></span>
                    </div>

                    {/* Tabs - Mobile Friendly */}
                    <div className="flex bg-emerald-700/50 p-1 rounded-lg">
                        <button onClick={() => setActiveTab('MISSIONS')} className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'MISSIONS' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:bg-emerald-600'}`}>
                            Missions
                        </button>
                        <button onClick={() => setActiveTab('HISTORY')} className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'HISTORY' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:bg-emerald-600'}`}>
                            Historique
                        </button>
                    </div>

                    {/* Profile Trigger */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('PROFILE')}>
                        <div className="w-8 h-8 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center text-white font-bold text-xs">
                            {user?.prenom?.charAt(0)}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 py-6">
                {activeTab === 'MISSIONS' && (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200">
                             <h2 className="text-lg font-bold mb-2">Aujourd'hui</h2>
                             <div className="text-slate-500 text-sm">Aucune mission active assignée.</div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'HISTORY' && (
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 animate-fadeIn">
                        <h2 className="text-lg font-bold mb-4">Historique de livraison</h2>
                        <p className="text-slate-500">Vos livraisons passées apparaîtront ici.</p>
                    </div>
                )}

                 {activeTab === 'PROFILE' && (
                    <div className="animate-fadeIn">
                         <UserProfile user={user} onLogout={handleLogout} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default LivreurDashboard;
