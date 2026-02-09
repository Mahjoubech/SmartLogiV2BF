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
    
    
    const [activeTab, setActiveTab] = useState<'MISSIONS' | 'HISTORY' | 'PROFILE' | 'NOTIFICATIONS'>('MISSIONS');
    
    
    
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
        <div className="min-h-screen bg-stone-50 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
            {}
            <nav className="sticky top-0 z-50 bg-slate-900 shadow-xl shadow-slate-900/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {}
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-black text-white text-lg">S</div>
                         <span className="font-bold text-lg tracking-tight text-white">SmartLogi<span className="text-orange-500">Driver</span></span>
                    </div>

                    {}
                    <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
                        <button onClick={() => setActiveTab('MISSIONS')} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'MISSIONS' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                            Missions ({activeMissions.length})
                        </button>
                        <button onClick={() => setActiveTab('HISTORY')} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'HISTORY' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                            History
                        </button>
                    </div>

                    {}
                    <div className="flex items-center gap-5">
                        {}
                        <div className="relative cursor-pointer group" onClick={() => setActiveTab('NOTIFICATIONS')}>
                            <div className={`p-2 rounded-full transition-colors ${activeTab === 'NOTIFICATIONS' ? 'bg-slate-800 text-orange-500' : 'text-slate-400 group-hover:text-white group-hover:bg-slate-800'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            </div>
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
                            )}
                        </div>

                        {}
                        <div className="cursor-pointer" onClick={() => setActiveTab('PROFILE')}>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 p-[2px]">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs uppercase hover:bg-slate-800 transition">
                                    {user?.prenom?.charAt(0) || 'U'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {}
            <main className="max-w-3xl mx-auto px-4 py-8">
                {activeTab === 'MISSIONS' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-end mb-2">
                             <div>
                                 <h2 className="text-2xl font-black text-slate-900">Active Missions</h2>
                                 <p className="text-slate-500 font-medium text-sm">Manage your current pickups and deliveries.</p>
                             </div>
                             <button onClick={() => dispatch(fetchMissions())} className="bg-white hover:bg-orange-50 text-slate-400 hover:text-orange-600 p-2.5 rounded-xl border border-stone-200 shadow-sm transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                             </button>
                        </div>
                        
                        {loading && (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                            </div>
                        )}
                        
                        {!loading && activeMissions.length === 0 && (
                            <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-100 text-center">
                                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">You have no active missions at the moment. Enjoy the break or check back later.</p>
                            </div>
                        )}

                        {activeMissions.map(mission => (
                            <div key={mission.id} className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-white overflow-hidden group hover:border-orange-200 transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                                                mission.statut === 'CREE' ? 'bg-blue-50 text-blue-600' :
                                                mission.statut === 'COLLECTE' ? 'bg-orange-50 text-orange-600' :
                                                'bg-purple-50 text-purple-600'
                                            }`}>
                                                {mission.statut === 'CREE' ? '📦' : mission.statut === 'COLLECTE' ? '🚚' : '🏁'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                        mission.statut === 'CREE' ? 'bg-blue-100/50 text-blue-700' :
                                                        mission.statut === 'COLLECTE' ? 'bg-orange-100/50 text-orange-700' :
                                                        'bg-purple-100/50 text-purple-700'
                                                    }`}>
                                                        {mission.statut}
                                                    </span>
                                                    <span className="text-xs text-stone-400 font-bold tracking-wider">#{mission.id.substring(0,8)}</span>
                                                </div>
                                                <h3 className="font-bold text-lg text-slate-900">
                                                    {mission.statut === 'CREE' ? 'Pickup Request' : 'Delivery Mission'}
                                                </h3>
                                                <p className="text-sm text-slate-500 font-medium">To: {mission.villeDestination}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-stone-50 rounded-2xl p-5 mb-6 border border-stone-100">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center pt-1">
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                                <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                                                <div className="w-2.5 h-2.5 rounded-full border-2 border-orange-500 bg-white"></div>
                                            </div>
                                            <div className="flex-1 space-y-6">
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">From (Origin)</div>
                                                    <div className="font-bold text-slate-800">{mission.expediteur?.nom || 'Warehouse'}</div>
                                                    <div className="text-sm text-slate-500">{mission.codePostalOrigine} {mission.zoneOrigine?.nom}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">To (Destination)</div>
                                                    <div className="font-bold text-slate-800">{mission.destinataire?.nom}</div>
                                                    <div className="text-sm text-slate-500">{mission.destinataire?.adresse}</div>
                                                    <div className="text-sm text-orange-600 font-bold">{mission.villeDestination}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {}
                                    <div className="grid grid-cols-1 gap-3">
                                        {mission.statut === 'CREE' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(mission.id, 'CREE')}
                                                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                            >
                                                <span>Validate Pickup</span>
                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                            </button>
                                        )}
                                        {mission.statut === 'COLLECTE' && (
                                             <button 
                                                onClick={() => handleStatusUpdate(mission.id, 'COLLECTE')}
                                                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                            >
                                                <span>Start Transit</span>
                                                <svg className="w-4 h-4 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                            </button>
                                        )}
                                        {mission.statut === 'EN_TRANSIT' && (
                                             <button 
                                                onClick={() => handleStatusUpdate(mission.id, 'EN_TRANSIT')}
                                                className="w-full bg-green-600 hover:bg-green-500 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-green-600/30 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                            >
                                                <span>Confirm Delivery</span>
                                                <svg className="w-4 h-4 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {activeTab === 'HISTORY' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Task History</h2>
                            <p className="text-slate-500 font-medium text-sm">Your completed missions timeline.</p>
                        </div>
                        
                         {historyMissions.length === 0 && (
                             <div className="text-center py-12 text-slate-400 bg-stone-50 rounded-3xl border border-stone-200 border-dashed">No history available yet.</div>
                         )}

                         <div className="relative border-l-2 border-stone-200 ml-4 space-y-8 pl-8 py-2">
                             {historyMissions.map(mission => (
                                 <div key={mission.id} className="relative group">
                                     <div className={`absolute -left-[41px] w-6 h-6 rounded-full border-4 border-stone-100 ${mission.statut === 'LIVRE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 group-hover:shadow-md transition-all">
                                         <div className="flex justify-between items-start mb-2">
                                             <div>
                                                 <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-1 ${mission.statut === 'LIVRE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {mission.statut}
                                                 </span>
                                                 <h4 className="font-bold text-slate-900">Delivery to {mission.villeDestination}</h4>
                                             </div>
                                             <span className="text-xs font-bold text-slate-400">{new Date(mission.dateCreation).toLocaleDateString()}</span>
                                         </div>
                                         <div className="text-sm text-slate-500">
                                             Recipient: <span className="font-medium text-slate-700">{mission.destinataire?.nom}</span>
                                         </div>
                                          <div className="text-xs text-stone-400 mt-2 font-mono">ID: {mission.id}</div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                )}

                {activeTab === 'NOTIFICATIONS' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                             <div>
                                 <h2 className="text-lg font-black text-slate-900">Notifications</h2>
                                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Stay Updated</div>
                             </div>
                             <button onClick={() => dispatch(fetchNotifications())} className="text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Refresh</button>
                        </div>
                         
                        {notifications.length === 0 && <div className="text-center text-slate-400 py-12">No new notifications.</div>}

                        {notifications.map(notif => (
                            <div 
                                key={notif.id} 
                                onClick={() => !notif.read && handleMarkRead(notif.id)}
                                className={`p-5 rounded-2xl border transition-all ${notif.read ? 'bg-white border-stone-100 text-slate-400' : 'bg-white border-orange-200 shadow-lg shadow-orange-500/5 cursor-pointer relative overflow-hidden'}`}
                            >
                                {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>}
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`text-sm ${!notif.read ? 'font-bold text-slate-900' : 'font-medium'}`}>{notif.message}</div>
                                    {!notif.read && <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                    </span>}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
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
