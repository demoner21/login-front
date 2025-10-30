import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../../shared/ui/LogoPlaceholder';
import { useAuth } from '../../context/AuthContext';

export const LoginForm = () => {
    // Estado para os campos do formulário
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    // Handler para o submit
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Aqui iria a lógica de login com a API
        console.log('Login attempt:', { email, password, rememberMe });

        setTimeout(() => {
            console.log('Login bem-sucedido (simulado)! Redirecionando...');

            // Aqui você salvaria o token, etc.
            // ex: auth.login(token);
            login();
            setIsLoading(false); // Desativa o "carregando"

            // 3. AÇÃO DE REDIRECIONAMENTO
            // Redireciona o usuário para a página inicial (route '/')
            navigate('/dashboard');

        }, 1500); // Simula 1.5 segundos de espera da API
    };

    return (
        // Usamos um Fragment <> pois o wrapper <div ... max-w-md ...> já está na Página.
        <>
            {/* Logo dentro do card */}
            <div className="mb-8">
                <LogoPlaceholder />
            </div>

            {/* Título */}
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-8">
                Bem-vindo! Faça seu login
            </h2>

            {/* Formulário */}
            <form onSubmit={handleSubmit}>
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
                    />
                    {/* Botão de ver senha */}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-8 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Opções (Lembrar-me / Esqueci senha) */}
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
                    {/* TODO: Criar uma rota para "Esqueci minha senha" */}
                    <Link to="/forgot-password" // Usando Link
                        className="text-blue-700 hover:text-blue-800 hover:underline">
                        Esqueci minha senha
                    </Link>
                </div>

                {/* Botão Entrar */}
                <button
                    type="submit"
                    // disabled={isLoading}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    {/* {isLoading ? 'Entrando...' : 'Entrar'} */}
                    Entrar
                </button>

                {/* Link de Cadastro */}
                <p className="text-center text-sm text-gray-600 mt-8">
                    Não tenho conta?{' '}
                    <Link to="/register" // Usando Link em vez de <a>
                        className="font-semibold text-blue-700 hover:underline">
                        Cadastre-se
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