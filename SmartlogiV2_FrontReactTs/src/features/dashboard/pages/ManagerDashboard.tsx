import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectUser, logout } from '../../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../../users/components/UserProfile';

const ManagerDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const [activeTab, setActiveTab] = useState<'OPERATIONS' | 'ASSIGNMENTS' | 'TEAM' | 'PROFILE'>('OPERATIONS');

    const handleLogout = () => {
        dispatch(logout());
        navigate('/staff-login');
    };

    return (
        <div className="min-h-screen bg-teal-50 text-teal-900 font-sans">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-teal-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center font-black text-xl shadow-lg shadow-teal-500/20 text-white">M</div>
                         <span className="font-bold text-lg tracking-tight text-teal-900">SmartLogi<span className="text-teal-600">Manager</span></span>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-teal-100/50 p-1 rounded-lg border border-teal-200">
                        <button onClick={() => setActiveTab('OPERATIONS')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'OPERATIONS' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-600 hover:bg-teal-200'}`}>
                            📡 Opérations
                        </button>
                        <button onClick={() => setActiveTab('ASSIGNMENTS')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'ASSIGNMENTS' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-600 hover:bg-teal-200'}`}>
                            📋 Affectations
                        </button>
                        <button onClick={() => setActiveTab('TEAM')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'TEAM' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-600 hover:bg-teal-200'}`}>
                            👷 Équipe
                        </button>
                    </div>

                    {/* Profile Trigger */}
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('PROFILE')}>
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-bold text-teal-900">{user?.prenom} {user?.nom}</div>
                            <div className="text-[10px] uppercase tracking-widest text-teal-600">Manager</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
                            {user?.prenom?.charAt(0)}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'OPERATIONS' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
                         <div className="p-6 bg-white rounded-xl border border-teal-100 shadow-sm">
                            <h3 className="text-teal-500 text-xs uppercase font-bold tracking-wider mb-2">Colis en Attente</h3>
                            <p className="text-3xl font-black text-slate-800">124</p>
                        </div>
                        <div className="p-6 bg-white rounded-xl border border-teal-100 shadow-sm">
                            <h3 className="text-teal-500 text-xs uppercase font-bold tracking-wider mb-2">Livreurs Actifs</h3>
                            <p className="text-3xl font-black text-slate-800">18</p>
                        </div>
                         <div className="p-6 bg-white rounded-xl border border-teal-100 shadow-sm">
                            <h3 className="text-teal-500 text-xs uppercase font-bold tracking-wider mb-2">Incidents</h3>
                            <p className="text-3xl font-black text-red-500">2</p>
                        </div>
                         <div className="p-6 bg-white rounded-xl border border-teal-100 shadow-sm">
                            <h3 className="text-teal-500 text-xs uppercase font-bold tracking-wider mb-2">Taux de Service</h3>
                            <p className="text-3xl font-black text-emerald-500">98%</p>
                        </div>
                    </div>
                )}
                
                {activeTab === 'ASSIGNMENTS' && (
                    <div className="p-12 text-center bg-white rounded-xl border border-teal-100 shadow-sm animate-fadeIn">
                        <h2 className="text-2xl font-bold mb-4 text-teal-900">Affectation des Colis</h2>
                        <p className="text-teal-600">Interface de glisser-déposer pour l'affectation à venir...</p>
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

export default ManagerDashboard;
