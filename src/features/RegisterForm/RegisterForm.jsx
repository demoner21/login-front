import React, { useState } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../../shared/ui/LogoPlaceholder';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { PasswordInput } from '../../shared/ui/PasswordInput';

export const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role_id: 2
    });
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!agreeTerms) {
            setError('Você precisa aceitar os Termos e Condições para se registrar.');
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const result = await register(formData);
            
            if (result.success) {
                toast.success('Conta criada com sucesso!', {
                    description: 'Faça login para continuar.'
                });
                navigate('/login');
            } else {
                toast.error('Erro ao criar conta', {
                    description: result.error || 'Tente novamente mais tarde.'
                });
            }
        } catch (error) {
            console.error('❌ Erro no registro:', error);
            setError('Erro de conexão. Verifique se o backend está rodando.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="mb-8">
                <LogoPlaceholder />
            </div>

            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-8">
                Crie sua conta
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Input
                    id="name"
                    label="Nome Completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome completo"
                />

                <Input
                    id="email"
                    type="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <PasswordInput
                    id="password"
                    label="Senha"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <div className="flex items-center text-sm mb-8">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="h-4 w-4 border-gray-300 rounded text-blue-700 focus:ring-blue-600 cursor-pointer"
                    />
                    <label htmlFor="terms" className="ml-2 text-gray-600 cursor-pointer">
                        Eu aceito os{' '}
                        <Link to="/terms" className="text-blue-700 hover:text-blue-800 hover:underline">
                            Termos & Condições
                        </Link>
                    </label>
                </div>

                <Button type="submit" disabled={isLoading || !agreeTerms}>
                    {isLoading ? 'Registrando...' : 'Criar Conta'}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-8">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-semibold text-blue-700 hover:underline">
                        Faça login
                    </Link>
                </p>
            </form>

            <footer className="text-center text-xs text-gray-500 mt-12 pt-4 border-t border-gray-200">
                <p>AK - Demoner | todos direitos reservados</p>
            </footer>
        </>
    );
};