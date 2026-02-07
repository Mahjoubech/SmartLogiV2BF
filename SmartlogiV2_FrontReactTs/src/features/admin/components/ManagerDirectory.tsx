import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createManager, updateManager, deleteManager } from '../adminSlice';
import type { ManagerData } from '../adminService';
// We might need a generic Modal component, but I'll build a specific one here for speed or reuse if exists.
// I'll build a simple inline modal for now.

const ManagerDirectory: React.FC = () => {
    const dispatch = useAppDispatch();
    const { managers } = useAppSelector(state => state.admin);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
    
    // Form State
    const [formData, setFormData] = useState<ManagerData>({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        password: '' // Only used for create
    });

    const openCreateModal = () => {
        setIsEditing(false);
        setSelectedManagerId(null);
        setFormData({ nom: '', prenom: '', email: '', telephone: '', password: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (manager: ManagerData) => {
        setIsEditing(true);
        setSelectedManagerId(manager.id || null);
        setFormData({
            nom: manager.nom,
            prenom: manager.prenom,
            email: manager.email,
            telephone: manager.telephone || '',
            password: '' // Don't show password
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing && selectedManagerId) {
            // Update
            const updateData: Partial<ManagerData> = {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                telephone: formData.telephone
            };
            if (formData.password) {
                updateData.password = formData.password;
            }
            
            await dispatch(updateManager({ id: selectedManagerId, data: updateData }));
        } else {
            // Create
            await dispatch(createManager(formData));
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this manager?')) {
            await dispatch(deleteManager(id));
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-white">Managers Directory</h2>
                <button 
                    onClick={openCreateModal}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-cyan-900/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add New Manager
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {managers.data.map((manager) => (
                    <div key={manager.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 group hover:border-cyan-500/50 transition-all hover:bg-slate-800/50">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-900/50">
                                {manager.prenom?.charAt(0)}{manager.nom?.charAt(0)}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openEditModal(manager)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors" title="Edit Profile"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(manager.id!)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Delete Manager"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{manager.prenom} {manager.nom}</h3>
                        <p className="text-slate-400 text-sm mb-6">{manager.email}</p>

                        <div className="space-y-3 pt-6 border-t border-slate-800">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Privileges</span>
                                <span className="text-cyan-400 font-bold bg-cyan-400/10 px-2 py-0.5 rounded text-xs border border-cyan-400/20">MANAGER</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Contact</span>
                                <span className="text-slate-300 font-mono text-xs">{manager.telephone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                            <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Manager Profile' : 'Create New Manager'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                        value={formData.prenom}
                                        onChange={e => setFormData({...formData, prenom: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                        value={formData.nom}
                                        onChange={e => setFormData({...formData, nom: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                                <input 
                                    type="tel" 
                                    required 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                    value={formData.telephone || ''}
                                    onChange={e => setFormData({...formData, telephone: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    {isEditing ? 'New Password (Optional)' : 'Password'}
                                </label>
                                <input 
                                    type="password" 
                                    required={!isEditing}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    minLength={6}
                                />
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all"
                                >
                                    {isEditing ? 'Update Manager' : 'Create Manager'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerDirectory;
