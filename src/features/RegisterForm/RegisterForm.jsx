import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../../shared/ui/LogoPlaceholder';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../shared/ui/Button';

export const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role_id: 2
    });
    const [showPassword, setShowPassword] = useState(false);
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
        console.log('🔐 INICIANDO REGISTRO...');

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
            console.log('📥 Resultado do registro:', result);
            
            if (result.success) {
                alert('✅ Conta criada com sucesso! Faça login para continuar.');
                navigate('/login');
            } else {
                setError(result.error || 'Erro ao criar conta. Tente novamente.');
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
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-600 mb-1"
                    >
                        Nome Completo
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-1 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-700 text-gray-900"
                        required
                        placeholder="Seu nome completo"
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-600 mb-1"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-1 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-700 text-gray-900"
                        required
                        placeholder="seu@email.com"
                    />
                </div>

                <div className="mb-6 relative">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-600 mb-1"
                    >
                        Senha
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-1 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-700 text-gray-900"
                        required
                        minLength="6"
                        placeholder="Mínimo 6 caracteres"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-8 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="flex items-center text-sm mb-8">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="h-4 w-4 border-gray-300 rounded text-blue-700 focus:ring-blue-600"
                    />
                    <label htmlFor="terms" className="ml-2 text-gray-600">
                        Eu aceito os{' '}
                        <Link to="/terms" className="text-blue-700 hover:text-blue-800 hover:underline">
                            Termos & Condições
                        </Link>
                    </label>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !agreeTerms}
                >
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