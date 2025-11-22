import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Pencil, Save, X, Shield, Users, Bell, CreditCard, Camera, Loader2 } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';
import { SecuritySettings } from '../../features/profile/SecuritySettings';

// --- Estilo Padronizado (Underline Style) ---
const inputClassName = "w-full px-1 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-700 text-gray-900 placeholder-gray-400 transition-colors pr-8";

// --- Componente Card Genérico ---
const SectionCard = ({ title, onEdit, isEditing, onSave, onCancel, children, hideHeader = false }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            
            {/* Lógica de Exibição do Header */}
            {!hideHeader && (title || (onEdit && isEditing)) && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 sm:gap-0">
                    
                    {/* Título */}
                    {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
                    
                    {/* Botões de Ação */}
                    {onEdit && (
                        <div className="flex items-center gap-2 sm:ml-auto self-start sm:self-auto">
                            {isEditing ? (
                                <>
                                    <button 
                                        onClick={onCancel}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                                    >
                                        <X size={16} /> <span>Cancelar</span>
                                    </button>
                                    <button 
                                        onClick={onSave}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-all shadow-sm"
                                    >
                                        <Save size={16} /> <span>Salvar</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onEdit}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    <Pencil size={16} /> <span>Edit</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {children}

            {/* Botões Flutuantes para o Header Personalizado */}
            {hideHeader && isEditing && (
                 <div className="flex flex-wrap justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                    <button 
                        onClick={onCancel}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        <X size={16} /> <span>Cancelar</span>
                    </button>
                    <button 
                        onClick={onSave}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-all shadow-sm"
                    >
                        <Save size={16} /> <span>Salvar</span>
                    </button>
                </div>
            )}
        </div>
    );
};

const InfoField = ({ label, value, name, isEditing, onChange, type = "text", placeholder }) => (
    <div className="flex flex-col w-full mb-4"> 
        <span className="text-sm font-medium text-gray-400 mb-1">{label}</span>
        {isEditing ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClassName}
            />
        ) : (
            <p className="text-gray-900 font-medium py-2 border-b border-transparent">{value || '-'}</p>
        )}
    </div>
);

const ProfilePage = () => {
    const { user, updateUserProfile, updateUserPhoto } = useAuth();
    const location = useLocation();
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('my-profile');
    const [isSaving, setIsSaving] = useState(false);

    const [editMode, setEditMode] = useState({
        header: false,
        personal: false,
        address: false
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        job_title: '',
        location: '',
        country: '',
        city: '',
        state: '',      
        postal_code: '',
        tax_id: ''
    });

    // Sincroniza activeTab com location.state
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    // Sincroniza formData com user
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                job_title: user.job_title || '',
                location: user.location || '',
                country: user.country || '',
                city: user.city || '',
                state: user.state || '',
                postal_code: user.postal_code || '',
                tax_id: user.tax_id || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleEdit = (section) => {
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleAvatarClick = () => {
        if (editMode.header) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const result = await updateUserPhoto(file);
        setIsUploading(false);

        if (!result.success) {
            alert(result.error);
        }
    };

    const handleSave = async (section) => {
        setIsSaving(true);
        
        const sectionFields = {
            header: ['name', 'job_title', 'city'], 
            personal: ['name', 'email', 'phone'],
            address: ['country', 'city', 'state', 'postal_code', 'tax_id']
        };

        const fieldsToUpdate = sectionFields[section] || [];
        const payload = {};
        
        fieldsToUpdate.forEach(field => {
            const value = formData[field];
            if (value !== undefined && value !== null) { 
                payload[field] = value;
            }
        });

        const result = await updateUserProfile(payload);
        setIsSaving(false);

        if (result.success) {
            setEditMode(prev => ({ ...prev, [section]: false }));
        } else {
            alert(result.error || "Erro ao salvar alterações.");
        }
    };

    const getPageTitle = () => {
        switch(activeTab) {
            case 'my-profile': return 'My Profile';
            case 'security': return 'Security Settings';
            case 'team': return 'Team Management';
            case 'notifications': return 'Notifications';
            case 'billing': return 'Billing & Plans';
            default: return 'Profile';
        }
    };

    return (
        <div className="p-4 lg:p-8 w-full max-w-5xl mx-auto"> 
            
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="text-gray-500 mt-1">Gerencie as configurações da sua conta</p>
            </div>

            {activeTab === 'my-profile' && (
                <div className="space-y-6">
                    
                    {/* --- HEADER SECTION --- */}
                    <SectionCard 
                        title=""
                        hideHeader={true}
                        isEditing={editMode.header}
                        onEdit={() => toggleEdit('header')}
                        onSave={() => handleSave('header')}
                        onCancel={() => toggleEdit('header')}
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6">
                             <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                                <div className="relative shrink-0">
                                    <div 
                                        className={`relative rounded-full overflow-hidden w-24 h-24 border-4 border-gray-50 shadow-sm ${editMode.header ? 'cursor-pointer group' : ''}`}
                                        onClick={handleAvatarClick}
                                    >
                                        <img 
                                            src={user?.avatar_url || "https://via.placeholder.com/150"} 
                                            alt="Profile" 
                                            className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50' : ''}`}
                                        />
                                        {isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                            </div>
                                        )}
                                        {editMode.header && !isUploading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="text-white w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        accept="image/*"
                                        className="hidden" 
                                    />

                                    {editMode.header && !isUploading && (
                                        <button 
                                            onClick={handleAvatarClick}
                                            className="absolute bottom-0 right-0 bg-blue-900 p-1.5 rounded-full text-white hover:bg-blue-800 shadow-md transition-transform hover:scale-110 z-10"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                                    {editMode.header ? (
                                        <div className="flex flex-col gap-4 w-full max-w-md mx-auto sm:mx-0 animate-in fade-in duration-300">
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{formData.name}</h2>
                                            <input 
                                                name="job_title" 
                                                value={formData.job_title} 
                                                onChange={handleInputChange} 
                                                placeholder="Product Designer" 
                                                className={inputClassName} 
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                                {formData.name}
                                            </h2>
                                            <p className="text-gray-500 font-medium">
                                                {formData.job_title || 'Cargo não definido'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!editMode.header && (
                                <div className="w-full sm:w-auto flex justify-center sm:justify-end mt-2 sm:mt-0">
                                    <button
                                        onClick={() => toggleEdit('header')}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all whitespace-nowrap"
                                    >
                                        <Pencil size={16} /> 
                                        <span>Edit</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </SectionCard>

                    {/* --- PERSONAL INFORMATION --- */}
                    <SectionCard 
                        title="Personal Information"
                        isEditing={editMode.personal}
                        onEdit={() => toggleEdit('personal')}
                        onSave={() => handleSave('personal')}
                        onCancel={() => toggleEdit('personal')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div className="md:col-span-2">
                                <InfoField 
                                    label="Full Name" 
                                    name="name" 
                                    value={formData.name} 
                                    isEditing={editMode.personal} 
                                    onChange={handleInputChange} 
                                />
                            </div>

                            <InfoField 
                                label="Email address" 
                                name="email" 
                                value={formData.email} 
                                isEditing={editMode.personal} 
                                onChange={handleInputChange} 
                                type="email" 
                            />
                            <InfoField 
                                label="Phone" 
                                name="phone" 
                                value={formData.phone} 
                                isEditing={editMode.personal} 
                                onChange={handleInputChange} 
                                type="tel" 
                            />
                        </div>
                    </SectionCard>

                    {/* --- ADDRESS --- */}
                    <SectionCard 
                        title="Address"
                        isEditing={editMode.address}
                        onEdit={() => toggleEdit('address')}
                        onSave={() => handleSave('address')}
                        onCancel={() => toggleEdit('address')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <InfoField label="Country" name="country" value={formData.country} isEditing={editMode.address} onChange={handleInputChange} />
                            <InfoField label="State" name="state" value={formData.state} isEditing={editMode.address} onChange={handleInputChange} placeholder="Ex: SP" />
                            <InfoField label="City" name="city" value={formData.city} isEditing={editMode.address} onChange={handleInputChange} />
                            <InfoField label="Postal Code" name="postal_code" value={formData.postal_code} isEditing={editMode.address} onChange={handleInputChange} />
                            <div className="md:col-span-2">
                                <InfoField label="TAX ID" name="tax_id" value={formData.tax_id} isEditing={editMode.address} onChange={handleInputChange} />
                            </div>
                        </div>
                    </SectionCard>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="max-w-4xl">
                    <SecuritySettings />
                </div>
            )}

            {activeTab !== 'my-profile' && activeTab !== 'security' && (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center animate-in fade-in duration-500">
                    <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                        {activeTab === 'team' && <Users className="w-8 h-8 text-blue-600" />}
                        {activeTab === 'notifications' && <Bell className="w-8 h-8 text-blue-600" />}
                        {activeTab === 'billing' && <CreditCard className="w-8 h-8 text-blue-600" />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Módulo em Desenvolvimento</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Esta seção está sendo desenvolvida.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;