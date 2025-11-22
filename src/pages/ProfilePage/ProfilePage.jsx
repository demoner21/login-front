import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, MapPin, Mail, Phone, Pencil, Save, X, Shield, Users, Bell, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// --- Subcomponente: Card de Seção (Mantido igual) ---
const SectionCard = ({ title, onEdit, isEditing, onSave, onCancel, children }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {title && (
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    {onEdit && (
                        <div>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={onCancel}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X size={16} /> Cancelar
                                    </button>
                                    <button 
                                        onClick={onSave}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
                                    >
                                        <Save size={16} /> Salvar
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={onEdit}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    <Pencil size={16} /> Edit
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
            {!title && onEdit && (
                 <div className="flex justify-end mb-4">
                     {/* Caso especial para o Header que não tem título visível */}
                     {isEditing ? (
                        <div className="flex gap-2">
                            <button onClick={onCancel} className="text-sm text-gray-600 hover:bg-gray-100 px-3 py-1 rounded">Cancelar</button>
                            <button onClick={onSave} className="text-sm bg-blue-900 text-white px-3 py-1 rounded">Salvar</button>
                        </div>
                     ) : (
                        <button onClick={onEdit} className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Pencil size={18} />
                        </button>
                     )}
                 </div>
            )}
            {children}
        </div>
    );
};

// --- Subcomponente: Campo de Input/Texto (Mantido igual) ---
const InfoField = ({ label, value, name, isEditing, onChange, type = "text" }) => (
    <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-400 mb-1">{label}</span>
        {isEditing ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all"
            />
        ) : (
            <p className="text-gray-900 font-medium h-[42px] flex items-center">{value || '-'}</p>
        )}
    </div>
);

// --- Página Principal ---
const ProfilePage = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('my-profile');

    // Sincroniza a aba com o Dropdown do Topbar
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    // Helper para o Título da Página
    const getPageTitle = () => {
        switch(activeTab) {
            case 'my-profile': return 'My Profile';
            case 'security': return 'Security Settings';
            case 'team': return 'Team Management';
            case 'notifications': return 'Notifications';
            case 'billing': return 'Billing & Plans';
            case 'delete-account': return 'Delete Account';
            default: return 'Profile';
        }
    };

    // Estados de Edição
    const [editMode, setEditMode] = useState({
        header: false,
        personal: false,
        address: false
    });

    // Dados do Formulário
    const [formData, setFormData] = useState({
        role: 'Product Designer',
        location: 'Los Angeles, California, USA',
        firstName: user?.name?.split(' ')[0] || 'Jack',
        lastName: user?.name?.split(' ')[1] || 'Adams',
        email: user?.email || 'jackadams@gmail.com',
        phone: '(213) 555-1234',
        country: 'United States of America',
        cityState: 'California, USA',
        postalCode: 'ERT 62574',
        taxId: 'AS564178969'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleEdit = (section) => {
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSave = (section) => {
        console.log(`Salvando ${section}:`, formData);
        toggleEdit(section);
    };

    return (
        <div className="p-4 lg:p-8 w-full max-w-5xl mx-auto"> {/* Layout Centralizado */}
            
            {/* Título da Seção Atual */}
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="text-gray-500 mt-1">Gerencie as configurações da sua conta</p>
            </div>

            {/* CONTEÚDO DA ABA: MY PROFILE */}
            {activeTab === 'my-profile' && (
                <div className="space-y-6">
                    {/* 1. Header Card */}
                    <SectionCard 
                        title=""
                        isEditing={editMode.header}
                        onEdit={() => toggleEdit('header')}
                        onSave={() => handleSave('header')}
                        onCancel={() => toggleEdit('header')}
                    >
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                                    alt="Profile" 
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                                />
                                {editMode.header && (
                                    <button className="absolute bottom-0 right-0 bg-blue-900 p-1.5 rounded-full text-white hover:bg-blue-800 shadow-md transition-transform hover:scale-110">
                                        <Pencil size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 text-center sm:text-left w-full">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {formData.firstName} {formData.lastName}
                                </h2>
                                {editMode.header ? (
                                    <div className="grid gap-3 max-w-md mt-2 mx-auto sm:mx-0">
                                        <input name="role" value={formData.role} onChange={handleInputChange} placeholder="Cargo" className="p-2 bg-gray-50 border rounded" />
                                        <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Localização" className="p-2 bg-gray-50 border rounded" />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-600 font-medium">{formData.role}</p>
                                        <p className="text-gray-400 text-sm flex items-center justify-center sm:justify-start gap-1 mt-1">
                                            <MapPin size={14} /> {formData.location}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </SectionCard>

                    {/* 2. Personal Information */}
                    <SectionCard 
                        title="Personal Information"
                        isEditing={editMode.personal}
                        onEdit={() => toggleEdit('personal')}
                        onSave={() => handleSave('personal')}
                        onCancel={() => toggleEdit('personal')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <InfoField label="First Name" name="firstName" value={formData.firstName} isEditing={editMode.personal} onChange={handleInputChange} />
                            <InfoField label="Last Name" name="lastName" value={formData.lastName} isEditing={editMode.personal} onChange={handleInputChange} />
                            <InfoField label="Email address" name="email" value={formData.email} isEditing={editMode.personal} onChange={handleInputChange} type="email" />
                            <InfoField label="Phone" name="phone" value={formData.phone} isEditing={editMode.personal} onChange={handleInputChange} type="tel" />
                            <div className="md:col-span-2">
                               
                            </div>
                        </div>
                    </SectionCard>

                    {/* 3. Address */}
                    <SectionCard 
                        title="Address"
                        isEditing={editMode.address}
                        onEdit={() => toggleEdit('address')}
                        onSave={() => handleSave('address')}
                        onCancel={() => toggleEdit('address')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <InfoField label="Country" name="country" value={formData.country} isEditing={editMode.address} onChange={handleInputChange} />
                            <InfoField label="City/State" name="cityState" value={formData.cityState} isEditing={editMode.address} onChange={handleInputChange} />
                            <InfoField label="Postal Code" name="postalCode" value={formData.postalCode} isEditing={editMode.address} onChange={handleInputChange} />
                            <InfoField label="TAX ID" name="taxId" value={formData.taxId} isEditing={editMode.address} onChange={handleInputChange} />
                        </div>
                    </SectionCard>
                </div>
            )}

            {/* PLACEHOLDERS PARA OUTRAS ABAS */}
            {activeTab !== 'my-profile' && (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center animate-in fade-in duration-500">
                    <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                        {activeTab === 'security' && <Shield className="w-8 h-8 text-blue-600" />}
                        {activeTab === 'team' && <Users className="w-8 h-8 text-blue-600" />}
                        {activeTab === 'notifications' && <Bell className="w-8 h-8 text-blue-600" />}
                        {activeTab === 'billing' && <CreditCard className="w-8 h-8 text-blue-600" />}
                        {activeTab === 'delete-account' && <X className="w-8 h-8 text-red-600" />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Módulo {getPageTitle()}</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Esta seção está sendo desenvolvida. Em breve você poderá gerenciar suas configurações de {activeTab} aqui.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;