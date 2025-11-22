import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../widgets/Sidebar/Sidebar';
import { Topbar } from '../widgets/Topbar/Topbar';
import { MapProvider } from '@/context/MapContext';

const MainLayout = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarExpanded(prev => !prev);
    };

    return (
        <MapProvider>
            <div className="flex h-screen bg-white">
                <Sidebar
                    isExpanded={isSidebarExpanded}
                    toggleSidebar={toggleSidebar}
                />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Topbar />
                        <main className="h-full w-full overflow-y-auto bg-gray-50 rounded-4xl shadow-inner">
                        <Outlet />
                    </main>
                </div>
            </div>
        </MapProvider>
    );
};

export default MainLayout;