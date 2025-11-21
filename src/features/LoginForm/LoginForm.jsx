import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../../shared/ui/LogoPlaceholder';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(email, password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        
        setIsLoading(false);
    };

    return (
        <>
            <div className="mb-8">
                <LogoPlaceholder />
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-8">
                Bem-vindo! Faça seu login
            </h2>

            {/* Mensagem de erro */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Input
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-1 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-700 text-gray-900"
                        required
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

                <div className="flex justify-between items-center text-sm mb-8">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 border-gray-300 rounded text-blue-700 focus:ring-blue-600"
                        />
                        <label htmlFor="remember" className="ml-2 text-gray-600">
                            Lembrar-me
                        </label>
                    </div>
                    <Link to="/forgot-password"
                        className="text-blue-700 hover:text-blue-800 hover:underline">
                        Esqueci minha senha
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-8">
                    Não tenho conta?{' '}
                    <Link to="/register"
                        className="font-semibold text-blue-700 hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </form>

            <footer className="text-center text-xs text-gray-500 mt-12 pt-4 border-t border-gray-200">
                <p>AK - Demoner | todos direitos reservados</p>
            </footer>
        </>
    );
};