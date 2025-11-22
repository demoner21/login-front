import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../../shared/ui/LogoPlaceholder';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { PasswordInput } from '../../shared/ui/PasswordInput';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
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
                <PasswordInput
                    id="password"
                    label="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="flex justify-between items-center text-sm mb-8">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 border-gray-300 rounded text-blue-700 focus:ring-blue-600 cursor-pointer"
                        />
                        <label htmlFor="remember" className="ml-2 text-gray-600 cursor-pointer">
                            Lembrar-me
                        </label>
                    </div>
                    <Link 
                        to="/forgot-password"
                        className="text-blue-700 hover:text-blue-800 hover:underline"
                    >
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