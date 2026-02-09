import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleUserBlock } from '../adminSlice';
import type { User } from '../../auth/authSlice';

const ClientDirectory: React.FC = () => {
    const dispatch = useAppDispatch();
    const { users, parcels } = useAppSelector(state => state.admin);
    const [searchTerm, setSearchTerm] = useState('');

    const clients = users.data.filter(u => u.role?.name === 'CLIENT');
    
    
    const filteredClients = clients.filter(c => 
        c.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.prenom && c.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStats = (clientId: string) => {
        const clientParcels = parcels.data.filter((p: any) => p.clientExpediteur?.id === clientId);
        const total = clientParcels.length;
        const delivered = clientParcels.filter((p: any) => p.statut === 'LIVRE').length;
        return { total, delivered };
    };

    const handleBlockToggle = (user: User) => {
        const isCurrentlyBlocked = !user.accountNonLocked; 
        dispatch(toggleUserBlock({ id: user.id, blocked: isCurrentlyBlocked }));
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900">Clients Directory</h2>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search clients..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none w-64 placeholder-slate-400 shadow-sm"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Client Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4 text-center">Total Parcels</th>
                            <th className="px-6 py-4 text-center">Delivered</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredClients.map((client) => {
                             const stats = getStats(client.id);
                             return (
                                 <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                     <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs ring-1 ring-orange-500/20">
                                             {client.prenom?.charAt(0)}{client.nom.charAt(0)}
                                         </div>
                                         <div>
                                             <div>{client.prenom} {client.nom}</div>
                                         </div>
                                     </td>
                                     <td className="px-6 py-4 text-slate-500 font-mono text-xs">{client.email}</td>
                                     <td className="px-6 py-4 text-center">
                                         <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
                                             {stats.total}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4 text-center">
                                         <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 font-bold text-xs border border-green-100">
                                             {stats.delivered}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4">
                                         {client.accountNonLocked ? (
                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Active</span>
                                         ) : (
                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Blocked</span>
                                         )}
                                     </td>
                                     <td className="px-6 py-4 text-right">
                                         <button 
                                             onClick={() => handleBlockToggle(client)}
                                             className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border shadow-sm ${!client.accountNonLocked 
                                                 ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                                                 : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}
                                         >
                                             {!client.accountNonLocked ? 'Unblock' : 'Block'}
                                         </button>
                                     </td>
                                 </tr>
                             );
                        })}
                        {filteredClients.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No clients found.</td>
                            </tr>
                        )}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default ClientDirectory;
