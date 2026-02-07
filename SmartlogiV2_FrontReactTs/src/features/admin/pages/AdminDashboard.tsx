import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout } from '../../auth/authSlice';
import { fetchAllUsers, fetchAllManagers, fetchAllRoles, fetchAllPermissions } from '../adminSlice';

import AdminOverview from '../components/AdminOverview';
import ClientDirectory from '../components/ClientDirectory';
import ManagerDirectory from '../components/ManagerDirectory';
import RolesPermissions from '../components/RolesPermissions';

// Icons
const Icons = {
    overview: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
    ),
    clients: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    ),
    managers: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    ),
    roles: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
    logout: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
    )
};

const AdminDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CLIENTS' | 'MANAGERS' | 'ROLES'>('OVERVIEW');

    useEffect(() => {
        // Initial fetch
        dispatch(fetchAllUsers({ page: 0, size: 100 })); // Fetch more to get good stats
        dispatch(fetchAllManagers({ page: 0, size: 100 }));
        dispatch(fetchAllRoles());
        dispatch(fetchAllPermissions());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-black tracking-tighter">
                        SMART<span className="text-cyan-500">LOGI</span>
                        <span className="block text-xs text-slate-500 font-medium tracking-normal mt-1">SUPER ADMIN</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => setActiveTab('OVERVIEW')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all group ${activeTab === 'OVERVIEW' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        {Icons.overview}
                        Overview
                    </button>

                    <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">User Management</div>

                    <button
                        onClick={() => setActiveTab('CLIENTS')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all group ${activeTab === 'CLIENTS' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        {Icons.clients}
                        Clients
                    </button>

                    <button
                        onClick={() => setActiveTab('MANAGERS')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all group ${activeTab === 'MANAGERS' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        {Icons.managers}
                        Managers
                    </button>

                    <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">System</div>

                    <button
                        onClick={() => setActiveTab('ROLES')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all group ${activeTab === 'ROLES' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        {Icons.roles}
                        Roles & Permissions
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        {Icons.logout}
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
                {/* Header */}
                <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white capitalize">{activeTab.toLowerCase()}</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-white">{user?.prenom} {user?.nom}</div>
                                <div className="text-xs font-bold text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-full inline-block">ADMIN</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-white font-bold shadow-lg">
                                {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'OVERVIEW' && <AdminOverview />}
                    {activeTab === 'CLIENTS' && <ClientDirectory />}
                    {activeTab === 'MANAGERS' && <ManagerDirectory />}
                    {activeTab === 'ROLES' && <RolesPermissions />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
