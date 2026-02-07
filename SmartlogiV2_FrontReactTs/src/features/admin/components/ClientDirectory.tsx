import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleUserBlock } from '../adminSlice';
import type { User } from '../../auth/authSlice';

const ClientDirectory: React.FC = () => {
    const dispatch = useAppDispatch();
    const { users } = useAppSelector(state => state.admin);
    const [searchTerm, setSearchTerm] = useState('');

    const clients = users.data.filter(u => u.role?.name === 'CLIENT');
    
    // Filter
    const filteredClients = clients.filter(c => 
        c.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.prenom && c.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleBlockToggle = (user: User) => {
        // Optimistic UI update handled partly by slice or just re-fetch
        // Slice handles update if fulfilled.
        // User.accountNonLocked is what we toggle conceptually.
        // But the thunk requires { id, blocked: boolean } where blocked is the NEW state or Current?
        // Let's check thunk: "if (blocked) unblock else block". So `blocked` arg is "is currently blocked?"
        // No, thunk says: `if (blocked) unblock else block`. 
        // Logic: passed `blocked` = true -> means "It is currently blocked, so unblock it".
        // Let's check my implementation of thunk:
        /*
          if (blocked) { await adminService.unblockUser(id); } else { await adminService.blockUser(id); }
        */
        // So `blocked` param means "Is the user currently blocked?".
        // If user.accountNonLocked is true, they are NOT blocked. So `blocked` = false.
        // If user.accountNonLocked is false, they ARE blocked. So `blocked` = true.
        
        const isCurrentlyBlocked = !user.accountNonLocked; 
        dispatch(toggleUserBlock({ id: user.id, blocked: isCurrentlyBlocked }));
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-white">Clients Directory</h2>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search clients..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none w-64 placeholder-slate-500"
                    />
                    <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Client Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredClients.map((client) => (
                             <tr key={client.id} className="hover:bg-slate-800/50 transition-colors">
                                 <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-xs ring-1 ring-cyan-500/20">
                                         {client.prenom?.charAt(0)}{client.nom.charAt(0)}
                                     </div>
                                     <div>
                                         <div>{client.prenom} {client.nom}</div>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 text-slate-400 font-mono text-xs">{client.email}</td>
                                 <td className="px-6 py-4">
                                     {client.accountNonLocked ? (
                                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">Active</span>
                                     ) : (
                                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">Blocked</span>
                                     )}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                     <button 
                                         onClick={() => handleBlockToggle(client)}
                                         className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${!client.accountNonLocked 
                                             ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white' 
                                             : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white'}`}
                                     >
                                         {!client.accountNonLocked ? 'Unblock' : 'Block'}
                                     </button>
                                 </td>
                             </tr>
                        ))}
                        {filteredClients.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No clients found.</td>
                            </tr>
                        )}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default ClientDirectory;
