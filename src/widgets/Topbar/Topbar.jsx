import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, X, LogOut, User, Shield, Users, CreditCard } from 'lucide-react';
import shp from 'shpjs';
import { useMap } from '@/context/MapContext';
import { useAuth } from '@/context/AuthContext';
import UploadIcon from '@/shared/ui/icons/UploadIcon';

export const Topbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setGeojson } = useMap();
    const { logout, user } = useAuth();
    
    const isMapPage = location.pathname.includes('/farm-map');
    
    // Estado controla a visibilidade da busca em TODAS as resoluções
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const profileMenuRef = useRef(null);

    const menuItems = [
        { id: 'my-profile', label: 'My Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigation = (tabId) => {
        navigate('/profile', { state: { activeTab: tabId } });
        setIsProfileOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
    };

    const handleFileChange = useCallback(async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target.result;
                const geojson = await shp.parseZip(arrayBuffer);
                setGeojson(geojson);
            } catch (error) {
                console.error("Error parsing shapefile:", error);
            }
        };
        reader.readAsArrayBuffer(file);
        event.target.value = null; 
    }, [setGeojson]);

    return (
        /*<header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6 transition-all duration-200 relative z-20">*/
        <header className="flex h-16 flex-shrink-0 items-center justify-between bg-white px-4 lg:px-6 transition-all duration-200 relative z-20">
            {/* MODO 1: BUSCA EXPANDIDA (Ativo em Mobile e Desktop quando clicado)
            */}
            {isSearchOpen ? (
                <div className="flex w-full items-center gap-2 animate-in fade-in duration-200 justify-center">
                    {/* Wrapper para limitar a largura em telas grandes */}
                    <div className="relative flex-1 md:flex-none md:w-80">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="search"
                            autoFocus
                            placeholder="Buscar..."
                            // onBlur={() => setIsSearchOpen(false)} // Opcional: fechar ao sair do foco
                            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={() => setIsSearchOpen(false)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full flex-shrink-0"
                        title="Fechar busca"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            ) : (
                /* MODO 2: BARRA NORMAL (Logo + Ícones) 
                */
                <>
                    <div className="flex items-center min-w-0">
                        <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">
                            {isMapPage ? 'Farm Map' : 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-3 lg:space-x-6">
                        {isMapPage && (
                            <>
                                <label 
                                    htmlFor="shapefile-upload-topbar" 
                                    className="cursor-pointer text-gray-500 hover:text-gray-700 p-1"
                                >
                                    <UploadIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                                </label>
                                <input
                                    id="shapefile-upload-topbar"
                                    type="file"
                                    accept=".zip"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </>
                        )}

                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="Pesquisar"
                        >
                            <Search className="h-5 w-5 lg:h-6 lg:w-6" />
                        </button>

                        <button 
                            onClick={() => handleNavigation('notifications')}
                            className="text-gray-500 hover:text-gray-700 p-1 relative hover:bg-gray-50 rounded-full transition-colors"
                            title="Notificações"
                        >
                            <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
                        </button>
                        
                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileMenuRef}>
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="h-8 w-8 lg:h-9 lg:w-9 overflow-hidden rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <img
                                    src={user?.avatar_url}
                                    alt="User avatar"
                                    className="h-full w-full object-cover"
                                />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user?.name || 'Usuário'}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user?.email || 'usuario@email.com'}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        {menuItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleNavigation(item.id)}
                                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Icon className="mr-3 h-4 w-4 text-gray-400" />
                                                    {item.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="py-1 border-t border-gray-100">
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="mr-3 h-4 w-4" />
                                            Sair
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};