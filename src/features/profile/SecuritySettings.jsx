import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Trash2, AlertTriangle, Shield } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { Modal } from '../../shared/ui/Modal';
import { usersAPI } from '../../service/api';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../../shared/ui/PasswordInput';

export const SecuritySettings = () => {
    const { user, logout } = useAuth();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setStatus({ type: 'error', message: 'A nova senha e a confirmação não coincidem.' });
            return;
        }
        if (passwords.newPassword.length < 6) {
            setStatus({ type: 'error', message: 'A nova senha deve ter no mínimo 6 caracteres.' });
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                current_password: passwords.currentPassword,
                new_password: passwords.newPassword
            };
            await usersAPI.changePassword(user.id, payload);
            setStatus({ type: 'success', message: 'Senha alterada com sucesso!' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.error || 'Erro ao atualizar senha. Verifique sua senha atual.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await usersAPI.delete(user.id);
            setIsDeleteModalOpen(false);
            logout();
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.error || 'Erro ao excluir conta.' 
            });
            setIsDeleteModalOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 animate-in fade-in">
                
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-50 rounded-lg hidden sm:block">
                            <Shield className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Segurança da Conta</h3>
                            <p className="text-sm text-gray-500">
                                Mantenha sua conta segura com uma senha forte.
                            </p>
                        </div>
                    </div>
                </div>

                {status.message && (
                    <div className="px-6 pt-6">
                        <div className={`p-3 rounded-lg flex items-center gap-3 ${
                            status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
                        }`}>
                            {status.type === 'error' ? <AlertCircle size={18} className="shrink-0"/> : <CheckCircle size={18} className="shrink-0"/>}
                            <span className="text-sm font-medium">{status.message}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        {/* Grid Senha Atual */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PasswordInput
                                id="currentPassword"
                                label="Senha Atual"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                required
                                placeholder="Digite sua senha atual"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PasswordInput
                                id="newPassword"
                                label="Nova Senha"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                required
                                placeholder="Mínimo 6 caracteres"
                            />
                            <PasswordInput
                                id="confirmPassword"
                                label="Confirmar Nova Senha"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Repita a nova senha"
                            />
                        </div>
                    </div>
                    <div className="px-6 pb-6 pt-2">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                            
                            <div className="w-full md:w-auto md:order-1">
                                <Button type="submit" disabled={isLoading} className="w-full md:w-auto px-6">
                                    {isLoading ? 'Salvando...' : 'Atualizar Senha'}
                                </Button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="w-full md:w-auto flex justify-center items-center gap-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg transition-colors font-medium md:order-2"
                            >
                                <Trash2 size={16} />
                                Excluir conta
                            </button>

                        </div>
                    </div>
                </form>
            </div>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                 <div className="text-center p-2">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Conta Definitivamente?</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Esta ação apagará todos os seus dados e não poderá ser desfeita. Você perderá acesso imediato à plataforma.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors w-full sm:w-auto"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm transition-colors w-full sm:w-auto"
                        >
                            Sim, excluir conta
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};