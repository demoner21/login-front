// src/features/RegisterForm/RegisterForm.jsx

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LogoPlaceholder } from '../../shared/ui/LogoPlaceholder';

export const RegisterForm = () => {
    // Estado para os campos do formulário
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Handler para o submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!agreeTerms) {
            alert('Você precisa aceitar os Termos e Condições para se registrar.');
            return;
        }

        setIsLoading(true);
        // Aqui iria a lógica de registro com a API
        console.log('Registro attempt:', { fullName, email, password, agreeTerms });

        // Simulação de API
        setTimeout(() => {
            setIsLoading(false);
            alert('Conta criada com sucesso!');
        }, 2000);
    };

    return (
        <>
            {/* Logo dentro do card */}
            <div className="mb-8">
                <LogoPlaceholder />
            </div>

            {/* Título */}
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-8">
                Crie sua conta
            </h2>

            {/* Formulário */}
            <form onSubmit={handleSubmit}>

                {/* Campo Full Name */}
                <div className="mb-6">
                    <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-600 mb-1"
                    >
                        Nome Completo
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-1 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-700 text-gray-900"
                        required
                    />
                </div>

                {/* Campo Email */}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-1 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-700 text-gray-900"
                        required
                    />
                </div>

                {/* Campo Senha */}
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
                        autoComplete="new-password"
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

                {/* Opções (Termos & Condições) */}
                <div className="flex justify-between items-center text-sm mb-8">
                    <div className="flex items-center">
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
                </div>

                {/* Botão Registrar */}
                <button
                    type="submit"
                    disabled={isLoading || !agreeTerms}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Registrando...' : 'Criar Conta'}
                </button>

                {/* Link de Login */}
                <p className="text-center text-sm text-gray-600 mt-8">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-semibold text-blue-700 hover:underline">
                        Faça login
                    </Link>
                </p>
            </form>

            {/* Footer */}
            <footer className="text-center text-xs text-gray-500 mt-12 pt-4 border-t border-gray-200">
                <p>AK - Demoner | todos direitos reservados</p>
            </footer>
        </>
    );
};