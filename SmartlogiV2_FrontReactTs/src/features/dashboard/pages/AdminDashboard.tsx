import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectUser, logout } from '../../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../../users/components/UserProfile';

const AdminDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'SETTINGS' | 'PROFILE'>('OVERVIEW');

    const handleLogout = () => {
        dispatch(logout());
        navigate('/admin-login');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-purple-500/30">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-indigo-500/20">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20">A</div>
                         <span className="font-bold text-lg tracking-tight">SmartLogi<span className="text-indigo-400">Admin</span></span>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                        <button onClick={() => setActiveTab('OVERVIEW')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'OVERVIEW' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                            📊 Vue d'ensemble
                        </button>
                        <button onClick={() => setActiveTab('USERS')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'USERS' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                            👥 Utilisateurs
                        </button>
                        <button onClick={() => setActiveTab('SETTINGS')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'SETTINGS' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                            ⚙️ Système
                        </button>
                    </div>

                    {/* Profile Trigger */}
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('PROFILE')}>
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-bold text-white">Admin</div>
                            <div className="text-[10px] uppercase tracking-widest text-indigo-400">System</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                            AD
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'OVERVIEW' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                            <h3 className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">Total Utilisateurs</h3>
                            <p className="text-4xl font-black text-white">2,543</p>
                        </div>
                        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                            <h3 className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">Revenu Mensuel</h3>
                            <p className="text-4xl font-black text-emerald-400">$45,200</p>
                        </div>
                        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                            <h3 className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">État Système</h3>
                            <p className="text-4xl font-black text-indigo-400">Opérationnel</p>
                        </div>
                    </div>
                )}
                
                {activeTab === 'USERS' && (
                    <div className="p-12 text-center bg-slate-800 rounded-xl border border-slate-700 animate-fadeIn">
                        <h2 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h2>
                        <p className="text-slate-400">Interface de gestion des utilisateurs à venir...</p>
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

export default AdminDashboard;
