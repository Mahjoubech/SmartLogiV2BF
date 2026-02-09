import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
    createRole, 
    deleteRole, 
    createPermission, 
    deletePermission, 
    assignPermission, 
    unassignPermission,
    fetchAllRoles,
    fetchAllPermissions
} from '../adminSlice';
import type { RoleData } from '../adminSlice';

const RolesPermissions: React.FC = () => {
    const dispatch = useAppDispatch();
    const { roles, permissions } = useAppSelector(state => state.admin);

    useEffect(() => {
        dispatch(fetchAllRoles());
        dispatch(fetchAllPermissions());
    }, [dispatch]);

    const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);

    // Form States
    const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    
    const [isManagePermsOpen, setIsManagePermsOpen] = useState(false);
    const [isCreatePermOpen, setIsCreatePermOpen] = useState(false);
    const [newPermName, setNewPermName] = useState('');

    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [selectedPermIdToAssign, setSelectedPermIdToAssign] = useState('');

    // --- Actions ---

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newRoleName.trim()) {
            await dispatch(createRole(newRoleName));
            setNewRoleName('');
            setIsCreateRoleOpen(false);
        }
    };

    const handleDeleteRole = async (id: string) => {
        if (window.confirm('Delete this role?')) {
            await dispatch(deleteRole(id));
            if (selectedRole?.id === id) setSelectedRole(null);
        }
    };

    const handleCreatePermission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPermName.trim()) {
            await dispatch(createPermission(newPermName));
            setNewPermName('');
            setIsCreatePermOpen(false);
        }
    };

    const handleDeletePermission = async (id: string) => {
        if (window.confirm('Delete this permission?')) {
            await dispatch(deletePermission(id));
        }
    };

    const handleAssignPermission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRole && selectedPermIdToAssign) {
            await dispatch(assignPermission({ roleId: selectedRole.id!, permissionId: selectedPermIdToAssign }));
            setIsAssignOpen(false);
            setSelectedPermIdToAssign('');
        }
    };

    const handleUnassignPermission = async (permId: string) => {
        if (selectedRole) {
            await dispatch(unassignPermission({ roleId: selectedRole.id!, permissionId: permId }));
        }
    };

    // Derived state for display
    const currentRole = roles.data.find(r => r.id === selectedRole?.id) || selectedRole;
    
    const availablePermissions = currentRole ? permissions.data.filter(p => !currentRole.permissions?.some(rp => rp.id === p.id)) : [];

    return (
        <div className="space-y-6 animate-fadeIn h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-slate-900">Roles & Permissions Management</h2>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsManagePermsOpen(true)}
                        className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
                    >
                        Manage Permissions
                    </button>
                    <button 
                         onClick={() => setIsCreatePermOpen(true)}
                         className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
                    >
                        New Permission
                    </button>
                    <button 
                        onClick={() => setIsCreateRoleOpen(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-all hover:scale-105"
                    >
                        + Create Role
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 gap-6 overflow-hidden h-full">
                {/* Roles Sidebar */}
                <div className="w-1/3 bg-white border border-slate-200 rounded-2xl flex flex-col h-full shadow-sm">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                        <h3 className="text-lg font-bold text-slate-900">Roles</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                         {roles.data.map(role => (
                             <div 
                                 key={role.id}
                                 onClick={() => setSelectedRole(role)}
                                 className={`p-4 rounded-xl border transition-all cursor-pointer group flex justify-between items-center ${selectedRole?.id === role.id ? 'bg-orange-50 border-orange-500 shadow-sm' : 'border-transparent hover:bg-slate-50'}`}
                             >
                                 <div>
                                     <div className={`font-bold ${selectedRole?.id === role.id ? 'text-orange-900' : 'text-slate-900'}`}>{role.name}</div>
                                     <div className="text-xs text-slate-500 mt-1">{role.permissions?.length || 0} permissions</div>
                                 </div>
                                 <button 
                                     onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id!); }}
                                     className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                 >
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                 </button>
                             </div>
                         ))}
                    </div>
                </div>

                {/* Permissions Detail */}
                <div className="w-2/3 bg-white border border-slate-200 rounded-2xl flex flex-col h-full overflow-hidden shadow-sm">
                    {currentRole ? (
                        <>
                            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        Permissions for <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100 text-lg">{currentRole.name}</span>
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1">Manage assigned permissions.</p>
                                </div>
                                <button 
                                    onClick={() => setIsAssignOpen(true)}
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 transition-all"
                                >
                                    + Assign Permission
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs sticky top-0">
                                        <tr>
                                            <th className="px-6 py-4">Permission Name</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentRole.permissions?.map(perm => (
                                            <tr key={perm.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-900">{perm.name}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleUnassignPermission(perm.id)}
                                                        className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-bold border border-slate-200 px-3 py-1.5 rounded-lg"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!currentRole.permissions || currentRole.permissions.length === 0) && (
                                            <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-500">No permissions assigned to this role.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            <p className="font-bold">Select a role to manage permissions</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            
            {/* Manage Permissions Modal - "The Pop Up" */}
            {isManagePermsOpen && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setIsManagePermsOpen(false)}>
                    <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">Manage System Permissions</h2>
                            <button onClick={() => setIsManagePermsOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Permission Name</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {permissions.data.map(perm => (
                                            <tr key={perm.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-900">{perm.name}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleDeletePermission(perm.id)}
                                                        className="text-slate-500 hover:text-red-500 transition-colors bg-slate-100 hover:bg-red-50 px-3 py-1 rounded-lg text-xs font-bold"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {permissions.data.length === 0 && (
                                            <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-500">No permissions found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                             <button onClick={() => setIsManagePermsOpen(false)} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">Close</button>
                        </div>
                    </div>
                 </div>
            )}

            {/* Create Role Modal */}
            {isCreateRoleOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setIsCreateRoleOpen(false)}>
                    <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Role</h3>
                        <form onSubmit={handleCreateRole}>
                            <input 
                                autoFocus
                                type="text"
                                value={newRoleName}
                                onChange={e => setNewRoleName(e.target.value)}
                                placeholder="Role Name (e.g. SUPERVISOR)"
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 mb-4 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsCreateRoleOpen(false)} className="px-4 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-slate-900/20 transition-all">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Permission Modal */}
            {isCreatePermOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setIsCreatePermOpen(false)}>
                    <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Create Permission</h3>
                        <form onSubmit={handleCreatePermission}>
                            <input 
                                autoFocus
                                type="text"
                                value={newPermName}
                                onChange={e => setNewPermName(e.target.value)}
                                placeholder="Permission Name (e.g. MANAGE_DISPATCH)"
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 mb-4 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsCreatePermOpen(false)} className="px-4 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-slate-900/20 transition-all">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Permission Modal */}
            {isAssignOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setIsAssignOpen(false)}>
                    <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Assign Permission</h3>
                        <form onSubmit={handleAssignPermission}>
                            <select 
                                value={selectedPermIdToAssign}
                                onChange={e => setSelectedPermIdToAssign(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 mb-4 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                            >
                                <option value="">Select a permission...</option>
                                {availablePermissions.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsAssignOpen(false)} className="px-4 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" disabled={!selectedPermIdToAssign} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50 shadow-lg shadow-slate-900/20 transition-all">Assign</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesPermissions;
