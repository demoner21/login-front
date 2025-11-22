import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { User, MapPin, Mail, Phone, Pencil, Save, X, Shield, Users, Bell, CreditCard, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SecuritySettings } from '../../features/profile/SecuritySettings';

// --- Subcomponente: Card de Seção (Estilo Original Mantido) ---
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

// --- Subcomponente: Campo de Input/Texto (Estilo Original Mantido) ---
const InfoField = ({ label, value, name, isEditing, onChange, type = "text", placeholder }) => (
    <div className="flex flex-col w-full">
        <span className="text-sm font-medium text-gray-400 mb-1">{label}</span>
        {isEditing ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                // Estilo Original: bg-gray-50, border-gray-200
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all"
            />
        ) : (
            // Estilo Original: Altura fixa para manter alinhamento
            <p className="text-gray-900 font-medium h-[42px] flex items-center">{value || '-'}</p>
        )}
    </div>
);

// --- Página Principal ---
const ProfilePage = () => {
    const { user, updateUserProfile, updateUserPhoto } = useAuth();
    const location = useLocation();
    
    // Referências para upload
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const [activeTab, setActiveTab] = useState('my-profile');
    const [isSaving, setIsSaving] = useState(false);

    // Estados de Edição
    const [editMode, setEditMode] = useState({
        header: false,
        personal: false,
        address: false
    });

    // Dados do Formulário (Mapeamento Backend)
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

    // Sincroniza abas
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    // Carrega dados do user
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

    // --- Lógica de Foto ---
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

    // --- Lógica de Salvar (Payload Limpo) ---
    const handleSave = async (section) => {
        setIsSaving(true);
        
        const sectionFields = {
            header: ['name', 'job_title', 'location', 'city'], 
            personal: ['name', 'email', 'phone'],
            address: ['country', 'city', 'state', 'location', 'postal_code', 'tax_id']
        };

        const fieldsToUpdate = sectionFields[section] || [];
        const payload = {};
        
        fieldsToUpdate.forEach(field => {
            if (formData[field] !== undefined) {
                payload[field] = formData[field];
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

            {/* ABA: MY PROFILE */}
            {activeTab === 'my-profile' && (
                <div className="space-y-6">
                    
                    {/* 1. Header Card (Visual Original) */}
                    <SectionCard 
                        title=""
                        isEditing={editMode.header}
                        onEdit={() => toggleEdit('header')}
                        onSave={() => handleSave('header')}
                        onCancel={() => toggleEdit('header')}
                    >
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                             <div className="relative">
                                {/* Container da Imagem */}
                                <div 
                                    className={`relative rounded-full overflow-hidden w-24 h-24 border-4 border-gray-50 shadow-sm ${editMode.header ? 'cursor-pointer' : ''}`}
                                    onClick={handleAvatarClick}
                                >
                                    <img 
                                        src={user?.avatar_url || "https://via.placeholder.com/150"} 
                                        alt="Profile" 
                                        className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`}
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                    )}
                                    {/* Overlay apenas se estiver editando */}
                                    {editMode.header && !isUploading && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <Camera className="text-white w-6 h-6" />
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
                                        className="absolute bottom-0 right-0 bg-blue-900 p-1.5 rounded-full text-white hover:bg-blue-800 shadow-md transition-transform hover:scale-110"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 text-center sm:text-left w-full">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {formData.name}
                                </h2>
                                {editMode.header ? (
                                    <div className="grid gap-3 max-w-md mt-2 mx-auto sm:mx-0">
                                        <input 
                                            name="job_title" 
                                            value={formData.job_title} 
                                            onChange={handleInputChange} 
                                            placeholder="Cargo" 
                                            className="p-2 bg-gray-50 border rounded" 
                                        />
                                        <input 
                                            name="location" 
                                            value={formData.location} 
                                            onChange={handleInputChange} 
                                            placeholder="Localização rápida" 
                                            className="p-2 bg-gray-50 border rounded" 
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-600 font-medium">{formData.job_title || 'Cargo não definido'}</p>
                                        <p className="text-gray-400 text-sm flex items-center justify-center sm:justify-start gap-1 mt-1">
                                            <MapPin size={14} /> {[formData.city, formData.state].filter(Boolean).join(', ') || 'Localização não definida'}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </SectionCard>

                    {/* 2. Personal Information (Layout Ajustado: Nome em cima, Email/Tel embaixo) */}
                    <SectionCard 
                        title="Personal Information"
                        isEditing={editMode.personal}
                        onEdit={() => toggleEdit('personal')}
                        onSave={() => handleSave('personal')}
                        onCancel={() => toggleEdit('personal')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Nome ocupando a linha inteira (2 colunas) */}
                            <div className="md:col-span-2">
                                <InfoField 
                                    label="Name" 
                                    name="name" 
                                    value={formData.name} 
                                    isEditing={editMode.personal} 
                                    onChange={handleInputChange} 
                                />
                            </div>

                            {/* Email e Telefone na linha de baixo */}
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

                    {/* 3. Address (Estilo Original) */}
                    <SectionCard 
                        title="Address"
                        isEditing={editMode.address}
                        onEdit={() => toggleEdit('address')}
                        onSave={() => handleSave('address')}
                        onCancel={() => toggleEdit('address')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <InfoField label="Country" name="country" value={formData.country} isEditing={editMode.address} onChange={handleInputChange} />
                            <InfoField label="State" name="state" value={formData.state} isEditing={editMode.address} onChange={handleInputChange} placeholder="Ex: SP" />
                            <InfoField label="City" name="city" value={formData.city} isEditing={editMode.address} onChange={handleInputChange} />
                            <InfoField label="Street Address" name="location" value={formData.location} isEditing={editMode.address} onChange={handleInputChange} />
                            <InfoField label="Postal Code" name="postal_code" value={formData.postal_code} isEditing={editMode.address} onChange={handleInputChange} />
                            <InfoField label="TAX ID" name="tax_id" value={formData.tax_id} isEditing={editMode.address} onChange={handleInputChange} />
                        </div>
                    </SectionCard>
                </div>
            )}

            {/* ABA: SECURITY */}
            {activeTab === 'security' && (
                <div className="max-w-4xl">
                    <SecuritySettings />
                </div>
            )}

            {/* PLACEHOLDERS PARA OUTRAS ABAS */}
            {activeTab !== 'my-profile' && activeTab !== 'security' && (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center animate-in fade-in duration-500">
                    <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                        {activeTab === 'team' && <Users className="w-8 h-8 text-blue-600" />}
                        {activeTab === 'notifications' && <Bell className="w-8 h-8 text-blue-600" />}
                        {activeTab === 'billing' && <CreditCard className="w-8 h-8 text-blue-600" />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Módulo {getPageTitle()}</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                       Esta seção está sendo desenvolvida.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;