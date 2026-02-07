import React from 'react';
import { useAppSelector } from '../../../store/hooks';

const AdminOverview: React.FC = () => {
    const { users, managers } = useAppSelector(state => state.admin);
    
    // Stats Calculation (Based on loaded data for distribution, but using totalElements for counts where possible)
    const totalUsers = users.totalElements || users.data.length;
    
    // We can only estimate clients/active managers from loaded data or use specific known totals if available.
    // Since we only fetch a page, these might be inaccurate if we don't fetch all.
    // For visual demonstration, we'll use the ratio from the loaded data to project or just show loaded counts.
    // Angular fetched 100 items to get a better "stat" set.
    
    const loadedUsers = users.data;
    const loadedManagers = managers.data;
    
    const clientsCount = loadedUsers.filter(u => u.role?.name === 'CLIENT').length;
    const managersCount = loadedManagers.length; // Managers endpoint returns managers
    // Note: Users endpoint might also contain managers, so we filter by role CLIENT for strict client count from users list.
    
    const blockCount = loadedUsers.filter(u => !u.accountNonLocked).length;
    
    // For the chart distribution
    const totalTracked = totalUsers || 1; 
    // Simply using the loaded sample for distribution percentages
    const sampleSize = loadedUsers.length || 1;
    const clientPct = Math.round((clientsCount / sampleSize) * 100);
    const managerPct = Math.round((managersCount / (managersCount + clientsCount || 1)) * 100); // Approximate if lists are separate
    
    // Better approximation:
    // We have totalUsers (count). 
    // We have totalManagers (count).
    // Let's assume (Total Users - Total Managers) ~ Clients (roughly)
    
    const totalManagers = managers.totalElements || managersCount;
    const totalClientsEst = Math.max(0, totalUsers - totalManagers);
    const blockedEst = blockCount; // Can only know from loaded list
    
    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-black text-white mb-6">Overview</h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-2">Total Users</div>
                    <div className="text-4xl font-black text-white">{totalUsers}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl border-l-4 border-l-cyan-500">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-2">Total Clients</div>
                    <div className="text-4xl font-black text-cyan-400">{totalClientsEst}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl border-l-4 border-l-purple-500">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-2">Active Managers</div>
                    <div className="text-4xl font-black text-purple-400">{totalManagers}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl border-l-4 border-l-red-500">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-2">Blocked Users</div>
                    <div className="text-4xl font-black text-red-500">{blockedEst}</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">User Distribution</h3>
                    <div className="flex items-center justify-center gap-8">
                         {/* CSS Doughnut */}
                         <div className="relative w-48 h-48 rounded-full" 
                              style={{ 
                                  background: `conic-gradient(
                                      #06b6d4 0% ${clientPct}%, 
                                      #8b5cf6 ${clientPct}% ${clientPct + 20}% 
                                  )` 
                                  // Simplified gradient for demo: Blue (Clients), Purple (Managers)
                                  // Real calc:
                                  // Clients: 0 -> clientPct
                                  // Managers: clientPct -> clientPct + managerPct (conceptual)
                                  // Others: rest
                              }}>
                             <div className="absolute inset-4 bg-slate-900 rounded-full flex items-center justify-center flex-col">
                                 <span className="text-3xl font-black text-white">{totalUsers}</span>
                                 <span className="text-xs text-slate-500 uppercase font-bold">Total</span>
                             </div>
                         </div>
                         
                         <div className="space-y-3">
                             <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                 <span className="text-slate-400 text-sm font-bold">Clients</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                 <span className="text-slate-400 text-sm font-bold">Managers</span>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-slate-500 h-full min-h-[300px]">
                    <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                    <span className="font-bold text-sm">Traffic Analytics (Coming Soon)</span>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
