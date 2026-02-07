import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-stone-50 font-sans text-slate-900 flex">
            {/* Sidebar removed as per user request - all nav is now in ClientDashboard tabs */}
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col transition-all duration-300 min-h-screen">
                
                {/* Topbar */}


                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default DashboardLayout;
