import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../widgets/Sidebar/Sidebar';
import { Topbar } from '../widgets/Topbar/Topbar';

const MainLayout = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarExpanded(prev => !prev);
    };

    return (
        <div className="flex h-screen bg-white">
            <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />

                {/* MUDANÇA AQUI: 
                  Removemos 'p-6' e 'rounded-tl-2xl' do <main>.
                  Isso permite que o conteúdo da página preencha 100% da área.
                */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;