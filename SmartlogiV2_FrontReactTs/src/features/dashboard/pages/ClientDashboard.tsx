
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectUser, logout } from '../../auth/authSlice';
import { fetchMyParcels, selectAllColis } from '../../parcels/colisSlice';
import CreateColisWizard from '../../parcels/components/CreateColisWizard';
import UserProfile from '../../users/components/UserProfile';
import { useNavigate } from 'react-router-dom';
import client from '../../../api/client'; // Import client for history fetch

// We need a custom ParcelGrid implementation or refactor ParcelList
// For now, I will inline the Grid logic here or create a new component to match Angular's "Masonry" style if ParcelList is a Table.
// ParcelList is currently a Table. Angular uses "Masonry" cards.
// The user asked for "Exact like frontend angular". Angular uses `app-colis-card` (Masonry).
// React `ParcelList` uses `Table`.
// I should probably create `ParcelGrid` component that looks like Angular's cards.

import type { Colis } from '../../parcels/colisSlice';

const ClientDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const parcels = useAppSelector(selectAllColis);
    const { totalElements, totalPages, isLoading } = useAppSelector(state => state.colis);
    
    // UI State
    const [activeTab, setActiveTab] = useState<'MANIFEST' | 'NEW_MISSION' | 'STATISTICS' | 'DELIVERED' | 'PROFILE'>('MANIFEST');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(0);
    const [activeColisId, setActiveColisId] = useState<string | null>(null);
    const pageSize = 6; // Grid 3x2

    // State for notifications
    const [lastSeenDate, setLastSeenDate] = useState<Date>(() => {
        const stored = localStorage.getItem('lastHistoryCheck');
        return stored ? new Date(stored) : new Date(0);
    });
    // This state preserves the cutoff date for highlights properly during the session
    const [highlightCutoff] = useState<Date>(() => {
         const stored = localStorage.getItem('lastHistoryCheck');
         return stored ? new Date(stored) : new Date(0);
    });
    
    // Calculate latest history date
    const allHistory = parcels.flatMap(p => p.historique || []).map(h => new Date(h.dateChangement));
    const latestHistoryDate = allHistory.length > 0 ? new Date(Math.max(...allHistory.map(d => d.getTime()))) : new Date(0);
    const hasNewHistory = latestHistoryDate.getTime() > lastSeenDate.getTime();

    useEffect(() => {
        if (user?.id) {
            let statuses: string[] | undefined = undefined;
            if (activeTab === 'MANIFEST') {
                statuses = ['CREE', 'COLLECTE', 'EN_TRANSIT', 'EN_STOCK'];
            } else if (activeTab === 'DELIVERED') {
                statuses = undefined; // Fetch ALL history
            }

            if (activeTab === 'MANIFEST' || activeTab === 'DELIVERED') {
                dispatch(fetchMyParcels({ userId: user.id, page, size: pageSize, status: statuses }));
            }
        }
    }, [dispatch, user, page, activeTab]);

    const handleTabChange = (tab: typeof activeTab) => {
        if (tab === 'DELIVERED' && activeTab !== 'DELIVERED') {
            // When opening History tab: 
            // 1. Keep the CURRENT highlight cutoff (so user sees what's new)
            // 2. Update the 'lastSeen' effectively clearing the red dot for NEXT time
            // 3. We delay the actual update of 'highlightCutoff' or just let it stay for this session?
            //    User request: "When I click button hid red point". 
            
            // We update the persistent store immediately so the red dot goes away
            localStorage.setItem('lastHistoryCheck', new Date().toISOString());
            setLastSeenDate(new Date()); 
            
            // Note: highlightCutoff remains at its old value for this render cycle so items stay highlighted.
            // If we wanted to clear highlights on CLICKING the ITEM, we handle that in the item click.
        }
        setActiveTab(tab);
        setPage(0);
    };

    // ... existing handleLogout ...
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ... existing filters ...
    // Filter Logic (Client-side search only)
    const filteredParcels = parcels.filter(p => {
        if (!searchText) return true;
        
        const searchLower = searchText.toLowerCase();
        return p.id.toLowerCase().includes(searchLower) || 
            p.destinataire.nom.toLowerCase().includes(searchLower) ||
            p.villeDestination?.toLowerCase().includes(searchLower);
    });
    
    // ... existing stats ...
    const stats = {
        total: totalElements || parcels.length,
        delivered: parcels.filter(c => c.statut === 'LIVRE').length, // Approximation for current view
        transit: parcels.filter(c => c.statut === 'EN_TRANSIT' || c.statut === 'COLLECTE').length,
        weight: parcels.reduce((acc, c) => acc + (c.poids || 0), 0)
    };

    // Helper to check if a specific item is new relative to the session cutoff
    const isItemNew = (dateStr: string) => {
        return new Date(dateStr).getTime() > highlightCutoff.getTime();
    };

    return (
        <div className="font-sans text-slate-900 bg-[#f8fafc] min-h-screen pb-20 selection:bg-orange-500/20">
            
            {/* Sticky Pro Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => handleTabChange('MANIFEST')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">Smart<span className="text-orange-600">Logi</span></span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Logistics</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/60 backdrop-blur-sm">
                        {(['MANIFEST', 'NEW_MISSION', 'DELIVERED', 'STATISTICS'] as const).map((tabId) => {
                            const labels = { MANIFEST: 'Dashboard', NEW_MISSION: 'Nouveau', DELIVERED: 'Historique', STATISTICS: 'Stats' };
                            const icons = { MANIFEST: '📦', NEW_MISSION: '➕', DELIVERED: '✅', STATISTICS: '📊' };
                            
                            return (
                                <button 
                                    key={tabId}
                                    onClick={() => handleTabChange(tabId)} 
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 relative ${
                                        activeTab === tabId 
                                        ? 'bg-white text-orange-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-100 ring-1 ring-black/5' 
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                                    }`}
                                >
                                    <span className={activeTab === tabId ? 'scale-110 transition' : ''}>{icons[tabId]}</span>
                                    {labels[tabId]}
                                    {tabId === 'DELIVERED' && hasNewHistory && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>



                    {/* User Profile Trigger */}
                    <div className="hidden md:flex items-center gap-4 pl-6 border-l border-slate-200">
                        <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">{user?.prenom}</div>
                            <div className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 rounded-full inline-block">CLIENT</div>
                        </div>
                        <button onClick={() => handleTabChange('PROFILE')} className="w-11 h-11 rounded-full bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center hover:border-orange-200 transition overflow-hidden">
                             <span className="font-black text-slate-700 bg-slate-50 w-full h-full flex items-center justify-center">{user?.prenom?.charAt(0)}</span>
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button className="p-2 text-slate-600 bg-slate-50 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 p-2 flex justify-around z-50 text-[10px] font-medium safe-pb">
                 <button onClick={() => setActiveTab('MANIFEST')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'MANIFEST' ? 'text-orange-600' : 'text-slate-400'}`}>
                    <span className="text-xl">📦</span> Accueil
                </button>
                <button onClick={() => setActiveTab('NEW_MISSION')} className="relative -top-6 p-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/40 flex items-center justify-center transform transition active:scale-95">
                    <span className="text-2xl font-bold">+</span>
                </button>
                <button onClick={() => setActiveTab('PROFILE')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'PROFILE' ? 'text-orange-600' : 'text-slate-400'}`}>
                    <span className="text-xl">👤</span> Profil
                </button>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
                
                {/* Header Section */}
                {(activeTab === 'MANIFEST' || activeTab === 'DELIVERED') && (
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div className="w-full">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                                {activeTab === 'MANIFEST' ? 'Mes Expéditions' : 'Historique'}
                            </h2>
                             <p className="text-slate-500 font-medium text-lg flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                                {activeTab === 'MANIFEST' ? 'Gérez vos envois en temps réel' : 'Consultez vos archives de livraison'}
                             </p>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="w-full md:w-auto relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                             <input 
                                type="text" 
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Rechercher un colis..." 
                                className="w-full md:w-80 bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-4 text-sm font-medium text-slate-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all shadow-sm hover:shadow-md"
                            />
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="min-h-[60vh] relative">
                    {isLoading && (activeTab === 'MANIFEST' || activeTab === 'DELIVERED') && (
                         <div className="absolute inset-0 bg-white/50 z-20 flex justify-center pt-20 backdrop-blur-sm rounded-3xl">
                             <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                         </div>
                    )}
                    
                    {/* MANIFEST & DELIVERED GRID */}
                    {(activeTab === 'MANIFEST' || activeTab === 'DELIVERED') && (
                        <>
                             {filteredParcels.length === 0 && !isLoading ? (
                                <div className="text-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-4xl opacity-20 text-slate-900">📦</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Aucun résultat</h2>
                                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                        {searchText ? 'Aucun colis ne correspond à votre recherche.' : 'Vous n\'avez pas encore d\'expédition dans cette catégorie sur cette page.'}
                                    </p>
                                    {!searchText && (
                                        <button onClick={() => setActiveTab('NEW_MISSION')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition font-bold shadow-xl shadow-slate-900/10 transform hover:-translate-y-1 active:scale-95">
                                            Créer une expédition
                                        </button>
                                    )}
                                </div>
                             ) : (
                                <>
                                    {activeTab === 'DELIVERED' ? (
                                        <div className="max-w-4xl mx-auto space-y-4">
                                            {(() => {
                                                const flattenedHistory = filteredParcels.flatMap(p => 
                                                    (p.historique || []).map(h => ({
                                                        ...h,
                                                        parcelId: p.id,
                                                        parcelCode: p.id.split('-')[0].toUpperCase(), // Short code
                                                        destinataire: p.destinataire ? `${p.destinataire.nom} ${p.destinataire.prenom}` : 'Inconnu'
                                                    }))
                                                ).sort((a, b) => new Date(b.dateChangement).getTime() - new Date(a.dateChangement).getTime());

                                                if (flattenedHistory.length === 0) {
                                                    return (
                                                        <div className="text-center py-12 text-slate-400">
                                                            Aucun événement récent.
                                                        </div>
                                                    );
                                                }

                                                return flattenedHistory.map((item, idx) => (
                                                    <div 
                                                        key={`${item.parcelId}-${idx}`} 
                                                        onClick={() => setActiveColisId(item.parcelId)}
                                                        className={`${isItemNew(item.dateChangement) ? 'bg-orange-50 border-orange-200 shadow-md ring-1 ring-orange-500/10' : 'bg-white border-slate-100 shadow-sm'} p-5 rounded-2xl border hover:shadow-lg transition-all cursor-pointer flex items-center gap-5 group relative overflow-hidden`}
                                                    >
                                                        {isItemNew(item.dateChangement) && (
                                                            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-xl shadow-sm z-10"></div>
                                                        )}
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                                                            item.status === 'LIVRE' ? 'bg-emerald-100 text-emerald-600' :
                                                            item.status === 'ANNULE' ? 'bg-red-100 text-red-600' :
                                                            'bg-blue-50 text-blue-600'
                                                        }`}>
                                                            {item.status === 'LIVRE' ? '✅' : item.status === 'ANNULE' ? '❌' : '🚚'}
                                                        </div>
                                                        
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className="font-bold text-slate-900 text-sm">
                                                                    Colis #{item.parcelCode} <span className="text-slate-400 font-normal">vers {item.destinataire}</span>
                                                                </h4>
                                                                <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                                                    {new Date(item.dateChangement).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2 items-center">
                                                                <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                                                    item.status === 'LIVRE' ? 'bg-emerald-50 text-emerald-700' : 
                                                                    'bg-slate-100 text-slate-600'
                                                                }`}>
                                                                    {item.status ? item.status.replace('_', ' ') : 'INFO'}
                                                                </span>
                                                                {item.commentaire && (
                                                                    <p className="text-sm text-slate-500 truncate max-w-md">
                                                                        {item.commentaire}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="text-slate-300 group-hover:text-orange-500 transition-colors">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {filteredParcels.map(parcel => (
                                                <ColisCard key={parcel.id} parcel={parcel} onOpenHistory={() => setActiveColisId(parcel.id)} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="mt-12 flex justify-center items-center gap-4">
                                            <button 
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 0}
                                                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                                            >
                                                ← Précédent
                                            </button>
                                            
                                            <div className="flex items-center gap-2 px-4">
                                                <span className="text-slate-400 font-medium">Page</span>
                                                <span className="text-slate-900 font-bold text-lg">{page + 1}</span>
                                                <span className="text-slate-400 font-medium">sur {totalPages}</span>
                                            </div>

                                            <button 
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page >= totalPages - 1}
                                                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                                            >
                                                Suivant →
                                            </button>
                                        </div>
                                    )}
                                </>
                             )}
                        </>
                    )}

                    {/* NEW MISSION WIZARD */}
                    {activeTab === 'NEW_MISSION' && (
                        <div className="animate-fadeIn max-w-5xl mx-auto">
                             <div className="mb-10 text-center">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Nouvelle Expédition</h2>
                                <p className="text-slate-500 text-lg">Configuration rapide de votre envoi</p>
                            </div>
                            <CreateColisWizard onCompleted={() => setActiveTab('MANIFEST')} onCanceled={() => setActiveTab('MANIFEST')} />
                        </div>
                    )}

                    {/* STATISTICS */}
                    {activeTab === 'STATISTICS' && (
                        <div className="animate-fadeIn">
                             <div className="mb-10">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Analytique</h2>
                                <p className="text-slate-500 text-lg">Vue d'ensemble de vos performances</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <StatTile icon="📦" value={totalElements} label="Total Colis" color="text-slate-900" bg="bg-white" />
                                <StatTile icon="✅" value={stats.delivered} label="Livrés" color="text-emerald-600" bg="bg-white" />
                                <StatTile icon="🚚" value={stats.transit} label="En Transit" color="text-blue-600" bg="bg-white" />
                                <StatTile icon="⚖️" value={stats.weight.toFixed(1)} unit="kg" label="Volume Est." color="text-orange-600" bg="bg-white" />
                            </div>

                             {/* Chart Placeholders */}
                             <div className="bg-white rounded-[2rem] border border-slate-100 p-12 text-center shadow-sm">
                                <div className="text-6xl mb-6 opacity-10">📈</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Graphiques Détaillés</h3>
                                <p className="text-slate-500">Les visualisations de données seront bientôt disponibles.</p>
                             </div>
                        </div>
                    )}

                    {/* PROFILE */}
                    {activeTab === 'PROFILE' && (
                        <div className="animate-fadeIn mt-4 max-w-3xl mx-auto">
                            <UserProfile user={user} onLogout={handleLogout} />
                        </div>
                    )}

                </div>
            </main>
            
            {/* History/Details Modal */}
            {activeColisId && parcels.find(p => p.id === activeColisId) && (
                <ParcelDetailsModal 
                    parcel={parcels.find(p => p.id === activeColisId)!} 
                    onClose={() => setActiveColisId(null)} 
                />
            )}
        </div>
    );
};

// --- Sub Components ---

const ParcelDetailsModal = ({ parcel, onClose }: { parcel: Colis, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn p-4" onClick={onClose}>
            <div className="bg-white rounded-[2.5rem] max-w-2xl w-full shadow-2xl animate-scaleIn relative overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-8 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                             </div>
                             <h3 className="text-2xl font-black text-slate-900 tracking-tight">Détails de l'Expédition</h3>
                        </div>
                        <p className="text-slate-500 font-medium ml-1">ID: <span className="font-mono text-slate-700 select-all">{parcel.id}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition text-slate-400 hover:text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-8 custom-scrollbar space-y-8">
                    
                    {/* Route Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest block mb-1">Expéditeur</span>
                            <div className="font-bold text-slate-900 text-lg mb-1">{parcel.expediteur?.nom} {parcel.expediteur?.prenom}</div>
                            <div className="text-xs text-slate-500">Zone Origine: {parcel.codePostalOrigine}</div>
                        </div>
                        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10 text-orange-600 text-6xl">📍</div>
                            <span className="text-[10px] uppercase text-orange-400 font-bold tracking-widest block mb-1">Destinataire</span>
                            <div className="font-bold text-slate-900 text-lg mb-1">{parcel.destinataire.nom} {parcel.destinataire.prenom}</div>
                            <div className="text-xs text-slate-500 font-medium">{parcel.destinataire.adresse}</div>
                            <div className="text-xs text-slate-500">{parcel.villeDestination}, {parcel.codePostal}</div>
                            <div className="mt-2 text-xs font-mono bg-white/50 inline-block px-2 py-1 rounded text-orange-700">{parcel.destinataire.telephone}</div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span>📅</span> Suivi & Messages
                        </h4>
                        <div className="flex flex-col space-y-4 bg-slate-50 p-6 rounded-2xl max-h-[400px] overflow-y-auto custom-scrollbar">
                             {parcel.historique && parcel.historique.length > 0 ? (
                                parcel.historique.map((h, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">
                                            {i === 0 ? '🤖' : '📦'}
                                        </div>
                                        <div className="flex flex-col items-start max-w-[85%]">
                                            <div className={`p-4 rounded-2xl rounded-tl-none shadow-sm ${i === 0 ? 'bg-orange-500 text-white' : 'bg-white text-slate-700 border border-slate-100'}`}>
                                                
                                                <div className="font-bold text-sm mb-1 uppercase tracking-wide flex justify-between gap-4">
                                                    <span>{h.status ? h.status.replace('_', ' ') : 'Mise à jour'}</span>
                                                </div>
                                                
                                                {h.commentaire && <p className={`text-sm leading-relaxed ${i===0 ? 'text-orange-50' : 'text-slate-500'}`}>
                                                    {h.commentaire}
                                                </p>}
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-400 mt-1 ml-2">
                                                {new Date(h.dateChangement).toLocaleString(undefined, {  weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                             ) : (
                                <div className="text-center py-8 text-slate-400 italic">Aucun historique disponible.</div>
                             )}
                        </div>
                    </div>

                    {/* Products */}
                    {parcel.produits && parcel.produits.length > 0 && (
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span>📦</span> Contenu du Colis ({parcel.produits.length})
                            </h4>
                            <div className="border border-slate-200 rounded-2xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3">Article</th>
                                            <th className="px-4 py-3 text-center">Qté</th>
                                            <th className="px-4 py-3 text-right">Poids</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {parcel.produits.map((p, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50">
                                                <td className="px-4 py-3 font-medium text-slate-700">{p.nom} <span className="text-slate-400 font-normal text-xs">({p.categorie})</span></td>
                                                <td className="px-4 py-3 text-center font-mono text-slate-600">x{p.quantite}</td>
                                                <td className="px-4 py-3 text-right font-mono text-slate-600">{p.poids} kg</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface StatTileProps {
    icon: string;
    value: number | string;
    label: string;
    color: string;
    bg?: string;
    unit?: string;
}

const StatTile = ({ icon, value, label, color, bg = 'bg-white', unit }: StatTileProps) => (
    <div className={`p-8 ${bg} border border-slate-100 rounded-[2rem] flex flex-col items-start justify-between h-48 hover:shadow-xl hover:shadow-slate-200/50 transition duration-300 group cursor-default relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-6 opacity-5 text-8xl group-hover:scale-110 transition duration-500 transform translate-x-4 -translate-y-4 grayscale group-hover:grayscale-0">
            {icon}
        </div>
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-4 shadow-inner">
            {icon}
        </div>
        <div className="relative z-10">
            <h3 className={`text-5xl font-black ${color} tracking-tighter mb-1`}>{value} <small className="text-xl text-slate-400 font-medium tracking-normal">{unit}</small></h3>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">{label}</p>
        </div>
    </div>
);

const ColisCard = ({ parcel, onOpenHistory }: { parcel: Colis, onOpenHistory: () => void }) => {
    const isDelivered = parcel.statut === 'LIVRE';
    
    return (
        <div onClick={onOpenHistory} className="bg-white border border-slate-100 rounded-[2rem] p-7 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition duration-500 group relative overflow-hidden flex flex-col h-full ring-1 ring-slate-100 hover:ring-orange-100 cursor-pointer">
            
            {/* Top Row: Date & Status */}
            <div className="flex justify-between items-start mb-6 z-10">
                 <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">Créé le</span>
                    <span className="text-sm font-bold text-slate-700 font-mono">{new Date(parcel.dateCreation).toLocaleDateString()}</span>
                 </div>
                 <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    parcel.statut === 'LIVRE' ? 'bg-emerald-100 text-emerald-700' : 
                    parcel.statut === 'ANNULE' ? 'bg-red-100 text-red-700' : 
                    parcel.statut === 'CREE' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700 animate-pulse'
                }`}>
                    {parcel.statut.replace('_', ' ')}
                </span>
            </div>

            {/* Middle: Recipient Info */}
            <div className="mb-8 z-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 text-xl shadow-sm">
                        👤
                    </div>
                    <div>
                         <h3 className="text-slate-900 font-bold text-lg leading-tight truncate w-40">{parcel.destinataire.nom}</h3>
                         <p className="text-slate-500 text-sm font-medium">{parcel.villeDestination}</p>
                    </div>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                        <span>Origine</span>
                        <span>Destination</span>
                    </div>
                    <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-1000 ${isDelivered ? 'bg-emerald-500 w-full' : 'bg-orange-500 w-1/2'}`}></div>
                    </div>
                     <div className="flex justify-between text-xs font-bold text-slate-700 mt-2 font-mono">
                        <span>{parcel.zone?.nom || 'Entrepôt'}</span>
                        <span>{parcel.codePostal?.substring(0,2)}XXX</span>
                    </div>
                </div>
            </div>

            {/* Bottom: Metrics */}
            <div className="mt-auto grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div>
                     <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest block mb-1">Poids</span>
                     <span className="text-xl font-black text-slate-900">{parcel.poids} <span className="text-sm font-medium text-slate-400">kg</span></span>
                </div>
                <div className="text-right">
                     <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest block mb-1">Priorité</span>
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${parcel.priorite === 'URGENT' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                        {parcel.priorite === 'URGENT' && '🔥'} {parcel.priorite}
                     </span>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
