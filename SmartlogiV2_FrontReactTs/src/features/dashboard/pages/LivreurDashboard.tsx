import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectUser, logout } from '../../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../../users/components/UserProfile';
import { fetchMissions, updateMission, fetchNotifications, markRead } from '../livreurSlice';

const LivreurDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const { missions, notifications, loading } = useAppSelector(state => state.livreur);
    
    // Local State
    const [activeTab, setActiveTab] = useState<'MISSIONS' | 'HISTORY' | 'PROFILE' | 'NOTIFICATIONS'>('MISSIONS');
    
    // Mission Filtering
    // Active missions are those not delivered or cancelled
    const activeMissions = missions.filter(m => m.statut !== 'LIVRE' && m.statut !== 'ANNULE');
    const historyMissions = missions.filter(m => m.statut === 'LIVRE' || m.statut === 'ANNULE');

    useEffect(() => {
        dispatch(fetchMissions());
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/staff-login');
    };

    const handleStatusUpdate = async (id: string, currentStatus: string) => {
        let nextStatus = '';
        if (currentStatus === 'CREE') nextStatus = 'COLLECTE';
        else if (currentStatus === 'COLLECTE') nextStatus = 'EN_TRANSIT';
        else if (currentStatus === 'EN_TRANSIT') nextStatus = 'LIVRE';
        
        if (nextStatus) {
            await dispatch(updateMission({ id, status: nextStatus, comment: 'Status updated by driver' }));
        }
    };

    const handleMarkRead = (id: string) => {
        dispatch(markRead(id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-emerald-600 shadow-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center gap-2">
                         <span className="font-bold text-lg tracking-tight text-white">SmartLogi<span className="text-emerald-200">Driver</span></span>
                    </div>

                    {/* Tabs - Mobile Friendly */}
                    <div className="flex bg-emerald-700/50 p-1 rounded-lg">
                        <button onClick={() => setActiveTab('MISSIONS')} className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'MISSIONS' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:bg-emerald-600'}`}>
                            Missions ({activeMissions.length})
                        </button>
                        <button onClick={() => setActiveTab('HISTORY')} className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'HISTORY' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:bg-emerald-600'}`}>
                            Hist.
                        </button>
                    </div>

                    {/* Profile & Notifs */}
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <div className="relative cursor-pointer" onClick={() => setActiveTab('NOTIFICATIONS')}>
                            <svg className={`w-6 h-6 ${activeTab === 'NOTIFICATIONS' ? 'text-white' : 'text-emerald-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-600">
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        {/* Profile Trigger */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('PROFILE')}>
                            <div className="w-8 h-8 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center text-white font-bold text-xs uppercase">
                                {user?.prenom?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 py-6">
                {activeTab === 'MISSIONS' && (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="flex justify-between items-center mb-2">
                             <h2 className="text-xl font-bold text-emerald-900">Missions Actives</h2>
                             <button onClick={() => dispatch(fetchMissions())} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                             </button>
                        </div>
                        
                        {loading && <div className="text-center py-8 text-slate-400">Loading missions...</div>}
                        
                        {!loading && activeMissions.length === 0 && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center">
                                <svg className="w-16 h-16 mx-auto text-stone-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                 <h3 className="text-lg font-bold text-stone-600 mb-1">Tout est calme !</h3>
                                 <div className="text-slate-400 text-sm">Aucune mission active pour le moment.</div>
                            </div>
                        )}

                        {activeMissions.map(mission => (
                            <div key={mission.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                    mission.statut === 'CREE' ? 'bg-blue-100 text-blue-700' :
                                                    mission.statut === 'COLLECTE' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {mission.statut}
                                                </span>
                                                <span className="text-xs text-stone-400 font-mono">#{mission.id.substring(0,8)}</span>
                                            </div>
                                            <h3 className="font-bold text-base text-stone-800">
                                                {mission.statut === 'CREE' ? 'Ramassage' : 'Livraison'} à {mission.villeDestination}
                                            </h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 mb-5">
                                        {/* Address Logic: If CREE, show Origin (Expediteur) address/city? Actually user might just need destination? check Colis object */}
                                        <div className="flex gap-3">
                                            <div className="w-1 bg-stone-200 rounded-full"></div>
                                            <div className="text-sm">
                                                <div className="text-xs font-bold text-stone-400 uppercase">Adresse</div>
                                                <div className="font-medium text-stone-700">
                                                    {mission.statut === 'CREE' ? 
                                                        `${mission.expediteur?.nom} ${mission.expediteur?.prenom} (Expéditeur)` : 
                                                        `${mission.destinataire?.nom} ${mission.destinataire?.prenom} (Destinataire)`
                                                    }
                                                </div>
                                                <div className="text-stone-500">{mission.statut === 'CREE' ? mission.codePostalOrigine : mission.destinataire?.adresse}</div>
                                                <div className="text-stone-500">{mission.statut === 'CREE' ? mission.zoneOrigine?.nom : mission.villeDestination}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {mission.statut === 'CREE' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(mission.id, 'CREE')}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all active:scale-95"
                                            >
                                                Valider Ramassage
                                            </button>
                                        )}
                                        {mission.statut === 'COLLECTE' && (
                                             <button 
                                                onClick={() => handleStatusUpdate(mission.id, 'COLLECTE')}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95"
                                            >
                                                Start Transit
                                            </button>
                                        )}
                                        {mission.statut === 'EN_TRANSIT' && (
                                             <button 
                                                onClick={() => handleStatusUpdate(mission.id, 'EN_TRANSIT')}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-200 transition-all active:scale-95"
                                            >
                                                Confirmer Livraison
                                            </button>
                                        )}
                                         <button className="px-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                         </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {activeTab === 'HISTORY' && (
                    <div className="space-y-4 animate-fadeIn">
                        <h2 className="text-xl font-bold text-stone-900 mb-4">Historique</h2>
                         {historyMissions.length === 0 && (
                             <div className="text-center py-8 text-slate-400">Aucun historique disponible.</div>
                         )}
                         {historyMissions.map(mission => (
                             <div key={mission.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 opacity-75">
                                 <div className="flex justify-between">
                                     <span className="font-bold text-stone-700">{mission.id.substring(0,8)}</span>
                                     <span className={`text-xs font-bold ${mission.statut === 'LIVRE' ? 'text-green-600' : 'text-red-500'}`}>{mission.statut}</span>
                                 </div>
                                 <div className="text-sm text-stone-500 mt-1">
                                     {mission.villeDestination} - {new Date(mission.dateCreation).toLocaleDateString()}
                                 </div>
                             </div>
                         ))}
                    </div>
                )}

                {activeTab === 'NOTIFICATIONS' && (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-stone-900">Notifications</h2>
                             <button onClick={() => dispatch(fetchNotifications())} className="text-emerald-600 text-sm font-bold">Refresh</button>
                        </div>
                         
                        {notifications.length === 0 && <div className="text-center text-slate-400 py-8">Aucune notification.</div>}

                        {notifications.map(notif => (
                            <div 
                                key={notif.id} 
                                onClick={() => !notif.read && handleMarkRead(notif.id)}
                                className={`p-4 rounded-xl border transition-all ${notif.read ? 'bg-white border-stone-100 text-stone-500' : 'bg-blue-50 border-blue-100 cursor-pointer hover:bg-blue-100'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className={`text-sm ${!notif.read && 'font-bold text-blue-900'}`}>{notif.message}</div>
                                    {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>}
                                </div>
                                <div className="text-xs text-slate-400 text-right">
                                    {new Date(notif.dateEnvoi).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                 {activeTab === 'PROFILE' && (
                    <div className="animate-fadeIn">
                         <UserProfile user={user} onLogout={handleLogout} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default LivreurDashboard;
