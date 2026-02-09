import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { logout } from '../../auth/authSlice';
import { fetchAllUsers, fetchAllManagers, fetchAllRoles, fetchAllPermissions, fetchAllParcels } from '../adminSlice';

const AdminDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAppSelector(state => state.auth);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        dispatch(fetchAllUsers({}));
        dispatch(fetchAllManagers({}));
        dispatch(fetchAllRoles());
        dispatch(fetchAllPermissions());
        dispatch(fetchAllParcels({}));
    }, [dispatch]);

    
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrolled(e.currentTarget.scrollTop > 20);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { id: 'OVERVIEW', label: 'Overview', path: 'overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { id: 'CLIENTS', label: 'Clients', path: 'clients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { id: 'MANAGERS', label: 'Managers', path: 'managers', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { id: 'LIVREURS', label: 'Drivers', path: 'drivers', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'ROLES', label: 'Roles & Perms', path: 'roles', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
    ];

    const currentPath = location.pathname.split('/').pop() || 'overview';
    const activeItem = navItems.find(item => location.pathname.includes(item.path)) || navItems[0];

    return (
        <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans selection:bg-orange-500/20">
            {}
            <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)] z-30 transition-all duration-300">
                <div className="h-20 flex items-center px-8 border-b border-slate-100/50">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/admin-dashboard')}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center shadow-lg shadow-slate-900/20 group-hover:scale-105 transition-transform duration-300">
                           <span className="text-white font-black text-xl tracking-tighter">S</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none group-hover:text-orange-600 transition-colors">SmartLogi</h1>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Admin Panel</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Main Menu</div>
                    {navItems.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group relative overflow-hidden ${
                                    isActive 
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-[1.02]' 
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:pl-5'
                                }`}
                            >
                                 {}
                                 {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-20 pointer-events-none" />
                                )}
                                
                                <svg className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                                </svg>
                                <span className="relative">{item.label}</span>
                                
                                {}
                                {isActive && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-auto shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100/50 bg-slate-50/50 backdrop-blur-sm">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all font-bold group"
                    >
                        <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:border-red-100 transition-colors shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        </div>
                        <span className="group-hover:translate-x-1 transition-transform">Sign Out</span>
                    </button>
                    <div className="text-center mt-4 text-[10px] text-slate-300 font-medium">
                        v2.4.0 • SmartLogi Inc.
                    </div>
                </div>
            </aside>

            {}
            <main className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc] relative">
                {}
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                {}
                <header className={`h-20 flex items-center justify-between px-8 z-20 sticky top-0 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50' : 'bg-transparent'}`}>
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            <span>Admin</span>
                            <span>/</span>
                            <span className="text-orange-600">{currentPath}</span>
                        </div>
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 capitalize tracking-tight">
                            {activeItem.label} Management
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm hover:shadow-md active:scale-95 group">
                                <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm hover:shadow-md active:scale-95 relative group">
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            </button>
                        </div>
                        
                        <div className="h-8 w-px bg-slate-200"></div>
                        
                        <div className="flex items-center gap-3 pl-1 pr-1 py-1 rounded-full hover:bg-white/50 transition-all cursor-pointer group">
                            <div className="flex flex-col items-end mr-2 hidden sm:flex">
                                <span className="text-sm font-bold text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">{user?.prenom} {user?.nom}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Super Admin</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/20 ring-4 ring-white group-hover:scale-105 transition-transform">
                                {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {}
                <div 
                    className="flex-1 overflow-y-auto p-8 custom-scrollbar scroll-smooth"
                    onScroll={handleScroll}
                >
                    <div className="max-w-7xl mx-auto h-full pb-10">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
export default AdminDashboard;
