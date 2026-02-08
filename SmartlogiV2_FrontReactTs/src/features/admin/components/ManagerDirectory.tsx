import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createManager, updateManager, deleteManager } from '../adminSlice';
import type { ManagerData } from '../adminService';

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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const openCreateModal = () => {
        setIsEditing(false);
        setSelectedManagerId(null);
        setFormData({ nom: '', prenom: '', email: '', telephone: '', password: '' });
        setConfirmPassword('');
        setPasswordError(null);
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
        setConfirmPassword('');
        setPasswordError(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);

        // Password Validation
        if (!isEditing || formData.password) {
            if (formData.password !== confirmPassword) {
                setPasswordError("Passwords do not match");
                return;
            }
            if (formData.password && formData.password.length < 6) {
                setPasswordError("Password must be at least 6 characters");
                return;
            }
        }
        
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
        // Only close if successful? For now close immediately or check action result if needed, 
        // but typically Redux action doesn't return success boolean easily without unwrap.
        // We'll close for now.
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this manager?')) {
            await dispatch(deleteManager(id));
        }
    };

    const loading = managers.loading;

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900">Managers Directory</h2>
                <button 
                    onClick={openCreateModal}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add New Manager
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {managers.data.map((manager) => (
                    <div key={manager.id} className="bg-white border border-slate-200 rounded-2xl p-6 group hover:border-orange-500/50 transition-all hover:shadow-md shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/30">
                                {manager.prenom?.charAt(0)}{manager.nom?.charAt(0)}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openEditModal(manager)}
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-orange-600 transition-colors" title="Edit Profile"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(manager.id!)}
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Delete Manager"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-1">{manager.prenom} {manager.nom}</h3>
                        <p className="text-slate-500 text-sm mb-6">{manager.email}</p>

                        <div className="space-y-3 pt-6 border-t border-slate-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Privileges</span>
                                <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded text-xs border border-orange-100">MANAGER</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Contact</span>
                                <span className="text-slate-700 font-mono text-xs">{manager.telephone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Edit Manager Profile' : 'Create New Manager'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
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
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                        value={formData.prenom}
                                        onChange={e => setFormData({...formData, prenom: e.target.value})}
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                        value={formData.nom}
                                        onChange={e => setFormData({...formData, nom: e.target.value})}
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        required 
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        required 
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                        value={formData.telephone || ''}
                                        onChange={e => setFormData({...formData, telephone: e.target.value})}
                                        placeholder="+1..."
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        {isEditing ? 'New Password (Optional)' : 'Password'}
                                    </label>
                                    <input 
                                        type="password" 
                                        required={!isEditing}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        minLength={6}
                                        placeholder="******"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        required={!isEditing || !!formData.password}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="******"
                                        disabled={!formData.password && isEditing}
                                    />
                                </div>
                            </div>

                            {passwordError && (
                                <div className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    {passwordError}
                                </div>
                            )}
                            
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-50 mt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading && (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
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
