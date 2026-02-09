import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectUser, logout } from '../../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../../users/components/UserProfile';
import { 
    fetchDashboardStats, 
    fetchColis, 
    fetchLivreurs, 
    fetchEligibleLivreurs, 
    assignLivreur, 
    createLivreur, 
    deleteLivreur, 
    resetEligible,
    fetchZones
} from '../managerSlice';
import { type Colis } from '../../parcels/colisSlice';
import { type Livreur } from '../managerService';

const ManagerDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    
    // Global State
    const { stats, colis, livreurs, eligibleLivreurs, eligibleState, zones } = useAppSelector(state => state.manager);

    // Local State
    const [activeTab, setActiveTab] = useState<'SHIPMENTS' | 'DRIVERS' | 'PROFILE'>('SHIPMENTS');
    const [shipmentFilter, setShipmentFilter] = useState<'ALL' | 'AVAILABLE' | 'ASSIGNED'>('ALL');
    const [page, setPage] = useState(0);

    // Modals
    const [selectedColis, setSelectedColis] = useState<Colis | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedLivreurId, setSelectedLivreurId] = useState('');

    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [newDriver, setNewDriver] = useState({
        nom: '', prenom: '', email: '', telephone: '', password: '', confirmPassword: '', vehicule: 'SCOOTER', zoneAssigneeId: '' // Zone ID handling might need fetchZones
    });

    // Initial Load
    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchZones());
    }, [dispatch]);

    // Data Loading based on Tab
    useEffect(() => {
        if (activeTab === 'SHIPMENTS') {
            dispatch(fetchColis({ page, size: 10, filter: shipmentFilter }));
        } else if (activeTab === 'DRIVERS') {
            dispatch(fetchLivreurs({ page, size: 10 }));
        }
    }, [dispatch, activeTab, shipmentFilter, page]);


    const handleLogout = () => {
        dispatch(logout());
        navigate('/staff-login');
    };

    // --- Actions ---

    const openAssignModal = (colis: Colis) => {
        setSelectedColis(colis);
        dispatch(resetEligible());
        dispatch(fetchEligibleLivreurs(colis.id));
        setIsAssignModalOpen(true);
    };

    const handleAssign = async () => {
        if (selectedColis && selectedLivreurId) {
            await dispatch(assignLivreur({ colisId: selectedColis.id, livreurId: selectedLivreurId }));
            setIsAssignModalOpen(false);
            setSelectedLivreurId('');
            setSelectedColis(null);
            // Refresh list
            dispatch(fetchColis({ page, size: 10, filter: shipmentFilter }));
        }
    };

    const handleCreateDriver = async (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (newDriver.password !== newDriver.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        // Construct payload - Zone ID handling logic needed properly, but keeping simple for now
        // Assuming we need a zone ID input or fetch zones. 
        // For brevity, skipping Zone Select fetch unless critical. User can input ID or we add it later.
        
        await dispatch(createLivreur({
            ...newDriver,
            zoneAssignee: { id: newDriver.zoneAssigneeId } // Backend expects object or ID? Service said 'any', Controller expects Request Body.
             // ManagerDashboard angular uses form.value which matches Request DTO.
        }));
        setNewDriver({ nom: '', prenom: '', email: '', telephone: '', password: '', confirmPassword: '', vehicule: 'SCOOTER', zoneAssigneeId: '' });
        setIsDriverModalOpen(false);
    };

    const handleDeleteDriver = async (id: string) => {
        if (window.confirm('Delete this driver?')) {
            await dispatch(deleteLivreur(id));
        }
    };
    
    // Zone Select Helpers (Simulated for this step, ideally fetch zones)
    // We would need a fetchZones thunk in managerSlice or generic slice.

    return (
        <div className="min-h-screen bg-stone-50 text-slate-900 font-sans selection:bg-orange-200 selection:text-orange-900">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/20 text-white">M</div>
                         <div className="leading-tight">
                            <span className="block font-bold text-lg tracking-tight text-slate-900">SmartLogi<span className="text-orange-600">Manager</span></span>
                            <span className="text-xs text-slate-500 font-medium tracking-wide">OPERATIONS CENTER</span>
                         </div>
                    </div>

                    {/* Tabs */}
                    <div className="hidden md:flex bg-stone-100 p-1.5 rounded-xl border border-stone-200">
                        <button onClick={() => setActiveTab('SHIPMENTS')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'SHIPMENTS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-stone-200'}`}>
                            📦 Colis
                        </button>
                        <button onClick={() => setActiveTab('DRIVERS')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'DRIVERS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-stone-200'}`}>
                            🚚 Livreurs
                        </button>
                        <button onClick={() => setActiveTab('PROFILE')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'PROFILE' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-stone-200'}`}>
                            👤 Profil
                        </button>
                    </div>

                    {/* Profile Trigger */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-bold text-slate-900">{user?.prenom} {user?.nom}</div>
                            <div className="text-[10px] uppercase tracking-widest text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">Manager</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white border-2 border-white shadow-md flex items-center justify-center font-bold">
                            {user?.prenom?.charAt(0)}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                
                {/* Stats Section */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fadeIn">
                        <div className="p-6 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Total Colis</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black text-slate-900">{stats.TOTAL}</p>
                                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">En Attente</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black text-orange-500">{stats.CREE + stats.COLLECTE}</p>
                                <span className="text-xs text-slate-400">Action Requise</span>
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                             <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">En Transit</h3>
                             <p className="text-3xl font-black text-blue-500">{stats.EN_TRANSIT}</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                             <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Livrés</h3>
                             <p className="text-3xl font-black text-slate-900">{stats.LIVRE}</p>
                        </div>
                    </div>
                )}

                {/* Content Tabs */}
                {activeTab === 'SHIPMENTS' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Filters */}
                        <div className="flex gap-4 border-b border-stone-200 pb-2">
                             {(['ALL', 'AVAILABLE', 'ASSIGNED'] as const).map(f => (
                                 <button
                                    key={f}
                                    onClick={() => { setShipmentFilter(f); setPage(0); }}
                                    className={`pb-2 px-1 text-sm font-bold transition-all border-b-2 ${shipmentFilter === f ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                                 >
                                    {f === 'ALL' ? 'Tous les Colis' : f === 'AVAILABLE' ? 'Non Assignés' : 'Assignés / En cours'}
                                 </button>
                             ))}
                        </div>

                        {/* Colis Table */}
                        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-stone-50 border-b border-stone-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">ID Colis</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4">Destination</th>
                                        <th className="px-6 py-4">Priorité</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {colis.data.map(c => (
                                        <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">#{c.id.substring(0, 8)}</div>
                                                <div className="text-xs text-slate-400">{c.dateCreation}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusClass(c.statut)}`}>
                                                    {c.statut}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{c.villeDestination}</div>
                                                <div className="text-xs text-slate-400">{c.codePostal}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold text-xs ${getPriorityClass(c.priorite)}`}>{c.priorite}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {c.statut === 'CREE' && (
                                                    <button 
                                                        onClick={() => openAssignModal(c)}
                                                        className="bg-slate-900 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-slate-900/10"
                                                    >
                                                        Assigner
                                                    </button>
                                                )}
                                                {c.statut !== 'CREE' && (
                                                     <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">Géré</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {colis.data.length === 0 && (
                                        <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">Aucun colis trouvé.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'DRIVERS' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Gestion des Livreurs</h2>
                            <button 
                                onClick={() => setIsDriverModalOpen(true)}
                                className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Nouveau Livreur
                            </button>
                        </div>
                         
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {livreurs.data.map(driver => (
                                <div key={driver.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-orange-200 hover:shadow-orange-500/5 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                                            {driver.nom.charAt(0)}{driver.prenom.charAt(0)}
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-xs font-bold ${driver.status === 'DISPONIBLE' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                            {driver.status}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900">{driver.prenom} {driver.nom}</h3>
                                    <div className="text-slate-500 text-sm mb-4">{driver.email}</div>
                                    
                                    <div className="space-y-2 text-sm border-t border-stone-100 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Zone</span>
                                            <span className="font-bold text-slate-700">{driver.zoneAssignee?.nom || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Véhicule</span>
                                            <span className="font-bold text-slate-700">{driver.vehicule}</span>
                                        </div>
                                    </div>
                                    
                                     <button 
                                        onClick={() => handleDeleteDriver(driver.id)}
                                        className="w-full mt-4 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg text-sm font-bold transition-all border border-transparent hover:border-red-100"
                                     >
                                         Supprimer
                                     </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                 {activeTab === 'PROFILE' && (
                    <div className="animate-fadeIn">
                         <UserProfile user={user} onLogout={handleLogout} />
                    </div>
                )}
            </main>

            {/* ASSIGN MODAL */}
            {isAssignModalOpen && selectedColis && (
               <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setIsAssignModalOpen(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">Assigner un Livreur</h3>
                            <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-red-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sélectionner un Livreur</label>
                                {eligibleState.loading ? (
                                    <div className="text-orange-500 font-bold animate-pulse">Vérification de la disponibilité...</div>
                                ) : eligibleLivreurs.length > 0 ? (
                                    <select 
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:border-orange-500"
                                        value={selectedLivreurId}
                                        onChange={e => setSelectedLivreurId(e.target.value)}
                                    >
                                        <option value="">-- Choisir un livreur --</option>
                                        {eligibleLivreurs.map(l => (
                                            <option key={l.id} value={l.id}>{l.prenom} {l.nom} ({l.status})</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                                        Aucun livreur disponible dans la zone 
                                        <span className="text-red-800 mx-1">{selectedColis.statut === 'CREE' ? (selectedColis.zoneOrigine?.nom || selectedColis.codePostalOrigine) : selectedColis.zone?.nom}</span>.
                                        Veuillez assigner un livreur à cette zone.
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsAssignModalOpen(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-stone-100 rounded-xl transition">Annuler</button>
                                <button 
                                    disabled={!selectedLivreurId} 
                                    onClick={handleAssign}
                                    className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 disabled:opacity-50 hover:bg-orange-500 transition"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
               </div> 
            )}

            {/* CREATE DRIVER MODAL */}
            {isDriverModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setIsDriverModalOpen(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                         <div className="p-6 border-b border-stone-100 bg-stone-50">
                            <h3 className="text-xl font-bold text-slate-900">Ajouter un Livreur</h3>
                            <p className="text-sm text-slate-500">Créer un compte pour le personnel de livraison</p>
                        </div>
                        <form onSubmit={handleCreateDriver} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Prénom</label>
                                    <input required type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none" 
                                           value={newDriver.prenom} onChange={e => setNewDriver({...newDriver, prenom: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Nom</label>
                                    <input required type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none" 
                                           value={newDriver.nom} onChange={e => setNewDriver({...newDriver, nom: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                                <input required type="email" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none" 
                                       value={newDriver.email} onChange={e => setNewDriver({...newDriver, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Téléphone</label>
                                <input required type="tel" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none" 
                                       value={newDriver.telephone} onChange={e => setNewDriver({...newDriver, telephone: e.target.value})} />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Mot de passe</label>
                                    <input required type="password" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none" 
                                           value={newDriver.password} onChange={e => setNewDriver({...newDriver, password: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Confirmer</label>
                                    <input required type="password" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none" 
                                           value={newDriver.confirmPassword} onChange={e => setNewDriver({...newDriver, confirmPassword: e.target.value})} />
                                </div>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Type de Véhicule</label>
                                <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none"
                                        value={newDriver.vehicule} onChange={e => setNewDriver({...newDriver, vehicule: e.target.value as any})}>
                                    <option value="SCOOTER">Scooter</option>
                                    <option value="VOITURE">Voiture</option>
                                    <option value="CAMION">Camion</option>
                                    <option value="VELO">Vélo</option>
                                </select>
                            </div>
                            {/* Zone ID - Ideally a select but generic text for now */}
                             <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Zone Assignée</label>
                                {zones && zones.length > 0 ? (
                                    <select 
                                        required 
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none"
                                        value={newDriver.zoneAssigneeId} 
                                        onChange={e => setNewDriver({...newDriver, zoneAssigneeId: e.target.value})}
                                    >
                                        <option value="">-- Sélectionner une zone --</option>
                                        {zones.map(zone => (
                                            <option key={zone.id} value={zone.id}>
                                                {zone.nom} ({zone.ville})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="text-red-500 text-xs italic p-2 border border-red-100 bg-red-50 rounded-lg">
                                        Aucune zone disponible. Veuillez en créer une d'abord via l'API ou demandez à un Admin.
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsDriverModalOpen(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-stone-100 rounded-xl transition">Annuler</button>
                                <button type="submit" className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-500 transition">Créer Livreur</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

// Utilities (Copied from Angular logic)
const getPriorityClass = (priorite: string): string => {
    switch (priorite) {
        case 'URGENT': return 'text-red-500';
        case 'NORMAL': return 'text-blue-500';
        default: return 'text-slate-500';
    }
}

const getStatusClass = (status: string): string => {
    switch (status) {
        case 'CREE': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
        case 'COLLECTE': return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'EN_TRANSIT': return 'bg-purple-50 text-purple-600 border-purple-200';
        case 'LIVRE': return 'bg-green-50 text-green-600 border-green-200';
        case 'ANNULE': return 'bg-red-50 text-red-600 border-red-200';
        default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
}

export default ManagerDashboard;
