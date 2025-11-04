import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Sprout, BarChart3, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// NavItem não muda
const NavItem = ({ to, icon: Icon, isExpanded, children }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center space-x-3 rounded-md p-3 text-sm font-medium transition-colors ${!isExpanded && 'justify-center'
                } ${isActive
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
            }
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="truncate">{children}</span>}
        </NavLink>
    );
};

export const Sidebar = ({ isExpanded, toggleSidebar }) => {
    const { logout } = useAuth();

    return (
        // O fundo 'bg-white' está correto
        <div
            className={`flex h-screen flex-col bg-white transition-all duration-300
        ${isExpanded ? 'w-64' : 'w-20'}
      `}
        >
            {/* 1. MUDANÇA: Removido 'border-b border-gray-200' */}
            <div className="flex h-16 items-center justify-center">
                <button
                    onClick={toggleSidebar}
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                    {isExpanded ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* 2. Seção de Navegação Principal */}
            <div className="flex-1 overflow-y-auto p-3">
                <nav className="space-y-2">
                    {/* Passa 'isExpanded' para cada NavItem */}
                    <NavItem to="/dashboard" icon={LayoutDashboard} isExpanded={isExpanded}>
                        Overview
                    </NavItem>
                    <NavItem to="/farm-map" icon={Map} isExpanded={isExpanded}>
                        Farm Map
                    </NavItem>
                    <NavItem to="/crops" icon={Sprout} isExpanded={isExpanded}>
                        Crops
                    </NavItem>
                    <NavItem to="/reports" icon={BarChart3} isExpanded={isExpanded}>
                        Reports
                    </NavItem>
                </nav>
            </div>

            {/* 3. MUDANÇA: Removido 'border-t border-gray-200' */}
            <div className={`p-3`}>
                <NavItem to="/profile" icon={User} isExpanded={isExpanded}>
                    Natasha Bunny
                </NavItem>
                <button
                    onClick={logout}
                    className={`mt-2 flex w-full items-center space-x-3 rounded-md p-3 text-sm font-medium text-gray-600 hover:bg-gray-100 ${!isExpanded && 'justify-center'}`}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {isExpanded && <span>Sair (Logout)</span>}
                </button>
            </div>
        </div>
    );
};