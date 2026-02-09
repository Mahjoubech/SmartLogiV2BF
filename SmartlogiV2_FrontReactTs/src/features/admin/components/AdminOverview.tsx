import React from 'react';
import { useAppSelector } from '../../../store/hooks';

const StatCard = ({ title, value, icon, color, gradient }: any) => (
    <div className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group bg-white border border-slate-100`}>
        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-2xl bg-slate-50 ${color} group-hover:scale-110 transition-transform shadow-sm`}>
                {icon}
            </div>
        </div>
    </div>
);

const AdminOverview: React.FC = () => {
    const { users, managers } = useAppSelector(state => state.admin);
    
    
    const totalUsers = users.totalElements || users.data.length;
    const loadedUsers = users.data;
    const loadedManagers = managers.data;
    
    const clientsCount = loadedUsers.filter(u => u.role?.name === 'CLIENT').length;
    
    
    const sampleSize = loadedUsers.length || 1;
    const clientPct = Math.round((clientsCount / sampleSize) * 100);
    
    const totalManagers = managers.totalElements || loadedManagers.length;
    const totalClientsEst = Math.max(0, totalUsers - totalManagers);
    const blockCount = loadedUsers.filter(u => !u.accountNonLocked).length;

    return (
        <div className="space-y-8 animate-fadeIn pb-10">
            {}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl shadow-slate-900/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-2">Welcome back, Admin 👋</h2>
                        <p className="text-slate-400 font-medium">Here's what's happening with your logistics network today.</p>
                    </div>
                    <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 hover:text-orange-600 transition-all shadow-lg shadow-white/10 active:scale-95">
                        Download Report
                    </button>
                </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Users" 
                    value={totalUsers} 
                    color="text-blue-500" 
                    gradient="from-blue-500 to-blue-600"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
                />
                <StatCard 
                    title="Total Clients" 
                    value={totalClientsEst} 
                    color="text-orange-500" 
                    gradient="from-orange-500 to-orange-600"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                />
                <StatCard 
                    title="Branch Managers" 
                    value={totalManagers} 
                    color="text-purple-500" 
                    gradient="from-purple-500 to-purple-600"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
                />
                <StatCard 
                    title="Action Required" 
                    value={blockCount} 
                    color="text-red-500" 
                    gradient="from-red-500 to-rose-600"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
                />
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 relative z-10">User Distribution</h3>
                    <div className="flex flex-col items-center justify-center relative z-10">
                         {}
                         <div className="relative w-56 h-56 rounded-full shadow-2xl shadow-orange-500/10 mb-8 transform hover:scale-105 transition-transform duration-500" 
                              style={{ 
                                  background: `conic-gradient(
                                      #f97316 0% ${clientPct}%, 
                                      #9333ea ${clientPct}% ${clientPct + 20}% 
                                  )` 
                              }}>
                             <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col shadow-inner">
                                 <span className="text-5xl font-black text-slate-900 tracking-tighter">{totalUsers}</span>
                                 <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">Total Users</span>
                             </div>
                         </div>
                         
                         <div className="w-full space-y-4">
                             <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-100">
                                 <div className="flex items-center gap-3">
                                     <div className="w-3 h-3 rounded-full bg-orange-500 shadow-lg shadow-orange-500/40"></div>
                                     <span className="text-slate-700 font-bold">Clients</span>
                                 </div>
                                 <span className="font-mono font-bold text-orange-600">{clientPct}%</span>
                             </div>
                             <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-100">
                                 <div className="flex items-center gap-3">
                                     <div className="w-3 h-3 rounded-full bg-purple-600 shadow-lg shadow-purple-600/40"></div>
                                     <span className="text-slate-700 font-bold">Managers</span>
                                 </div>
                                 <span className="font-mono font-bold text-purple-600">{100 - clientPct}%</span>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/40 flex flex-col justify-center items-center text-slate-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                    <div className="relative z-10 flex flex-col items-center animate-pulse">
                        <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-300 mb-2">Analytics Module</h3>
                        <p className="font-medium text-slate-400">Detailed traffic analysis is coming in v2.5</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
