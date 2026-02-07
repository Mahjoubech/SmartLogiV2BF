import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { User } from '../../auth/authSlice';

const LivreurDirectory: React.FC = () => {
    const dispatch = useAppDispatch(); // Although not dispatching actions here yet, might need for block/unblock later
    const { users, parcels } = useAppSelector(state => state.admin);
    const [searchTerm, setSearchTerm] = useState('');

    const livreurs = users.data.filter(u => u.role?.name === 'LIVREUR');
    
    // Filter
    const filteredLivreurs = livreurs.filter(l => 
        l.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.prenom && l.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStats = (livreurId: string) => {
        const livreurParcels = parcels.data.filter(p => p.livreur?.id === livreurId);
        const assigned = livreurParcels.length;
        const delivered = livreurParcels.filter(p => p.statut === 'LIVRE').length;
        return { assigned, delivered };
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900">Delivery Drivers</h2>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search drivers..." 
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
                            <th className="px-6 py-4">Driver Name</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4 text-center">Assigned</th>
                            <th className="px-6 py-4 text-center">Delivered</th>
                            <th className="px-6 py-4">Status</th>
                            {/* <th className="px-6 py-4 text-right">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLivreurs.map((livreur) => {
                             const stats = getStats(livreur.id);
                             return (
                                <tr key={livreur.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-md">
                                            {livreur.prenom?.charAt(0)}{livreur.nom.charAt(0)}
                                        </div>
                                        <div>
                                            <div>{livreur.prenom} {livreur.nom}</div>
                                            <div className="text-xs text-slate-400 font-mono hidden sm:block">ID: {livreur.id.substring(0,8)}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-500 font-mono text-xs mb-1">{livreur.email}</div>
                                        {/* Assuming telephone is not on User interface yet, but might be added */}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs border border-blue-100">
                                            {stats.assigned}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block px-3 py-1 rounded-lg bg-green-50 text-green-600 font-bold text-xs border border-green-100">
                                            {stats.delivered}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {livreur.accountNonLocked ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Blocked</span>
                                        )}
                                    </td>
                                </tr>
                             );
                        })}
                        {filteredLivreurs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No delivery drivers found.</td>
                            </tr>
                        )}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default LivreurDirectory;
