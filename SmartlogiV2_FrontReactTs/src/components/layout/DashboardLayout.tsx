import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-stone-50 font-sans text-slate-900 flex">
            {}
            
            {}
            <div className="flex-1 flex flex-col transition-all duration-300 min-h-screen">
                
                {}


                {}
                <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default DashboardLayout;
