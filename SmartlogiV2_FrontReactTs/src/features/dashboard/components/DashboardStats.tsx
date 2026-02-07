

import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectColisStats } from '../../parcels/colisSlice';

const StatCard: React.FC<{ title: string; value: string; icon: string; trend?: string; color: string }> = ({ title, value, icon, trend, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
            <svg className="w-24 h-24 transform translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 24 24"><path d={icon}></path></svg>
        </div>
        
        <div className="relative z-10 flex items-start justify-between">
            <div>
                <p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-900">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} text-white shadow-lg`}>
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path></svg>
            </div>
        </div>

        {trend && (
             <div className="mt-4 flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-lg">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                {trend} vs last month
            </div>
        )}
    </div>
);

const DashboardStats = () => {
  const stats = useAppSelector(selectColisStats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        title="Active Parcels" 
        value={stats.active.toString()} 
        icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
        color="bg-orange-500"
        trend="Live"
     />
      <StatCard 
        title="Delivered" 
        value={stats.delivered.toString()} 
        icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
        color="bg-green-500"
      />
      <StatCard 
        title="Total Shipments" 
        value={stats.total.toString()}
        icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        color="bg-blue-500"
      />
    </div>
  );
};

export default DashboardStats;


