import React, { useState } from 'react';
// Importa ícones que usaremos
import { Eye, EyeOff } from 'lucide-react';

// TODO: Importe seu componente de Logo aqui
// import Logo from './components/Logo';

/**
 * Um placeholder visual para o Logo.
 * Substitua isso pela renderização do seu componente de Logo importado.
 */
function LogoPlaceholder() {
    return (
        <div className="h-10 w-32 flex items-center justify-start">
            {/* <Logo /> */}
            <span className="text-gray-400 text-lg font-medium">[Seu Logo Aqui]</span>
        </div>
    );
}

/**
 * Componente principal da aplicação (Tela de Login)
 */
export default function App() {
    // Estado para os campos do formulário
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // TODO: Substitua esta string pela URL da sua imagem de fundo (a da cidade)
    const cityscapeImageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80'; // Placeholder

    // Handler para o submit (apenas previne o padrão por enquanto)
    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui iria a lógica de login
        console.log('Login attempt:', { email, password, rememberMe });
    };

    return (
        // --- Container Principal ---
        // A imagem de fundo e o gradiente foram MOVIDOS para cá.
        // Isso garante que o fundo esteja presente tanto no mobile quanto no desktop.
        <div
            className="min-h-screen w-full flex flex-col lg:flex-row font-sans"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${cityscapeImageUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >

            {/* --- Painel Esquerdo (Info) --- */}
            {/*
              * ALTERAÇÕES AQUI:
              * 1. 'hidden': Esconde este painel em telas pequenas (mobile).
              * 2. 'lg:flex': Mostra este painel como flex em telas grandes (lg) ou maiores.
              * 3. 'min-h-[40vh]' e 'lg:min-h-screen' removidos: Deixa o flexbox pai controlar a altura.
              * 4. 'style' (com a imagem) REMOVIDO: Movido para o container principal.
            */}
            <div
                className="hidden lg:flex w-full lg:w-3/5 flex-col justify-center p-8 lg:p-16 text-white"
            >
                <div className="max-w-md">
                    {/* TODO: Se o seu logo também for aqui, adicione-o */}
                    {/* <LogoPlaceholder /> */}

                    <h1 className="text-4xl lg:text-5xl font-bold mt-6 mb-4">
                        Gerar ainda os copy write
                    </h1>
                    <p className="text-lg text-gray-200">
                        Aqui também
                        lembrando da quebra de pagina
                    </p>
                </div>
            </div>

            {/* --- Painel Direito (Login com Fundo "Blur") --- */}
            {/*
              * ALTERAÇÕES AQUI:
              * 1. 'flex-grow': Faz este painel crescer para preencher o espaço vertical
              * disponível no mobile (já que o painel esquerdo está 'hidden').
              * 2. 'lg:flex-grow-0': Impede que o painel cresça em telas grandes,
              * respeitando o 'lg:w-2/5'.
              *
              * O 'bg-white/10 backdrop-blur-lg' agora vai "borrar" a imagem de fundo
              * principal, que é o efeito desejado.
            */}
            <div className="w-full lg:w-2/5 bg-white backdrop-blur-lg flex flex-col justify-center p-8 lg:p-12 flex-grow lg:flex-grow-0">
                <div className="w-full max-w-md mx-auto">

                    {/* Logo dentro do card */}
                    <div className="mb-8">
                        <LogoPlaceholder />
                    </div>

                    {/* Título */}
                    <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-8">
                        Bem-vindo! Faça seu login
                    </h2>

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
                            <a href="#" className="text-blue-700 hover:text-blue-800 hover:underline">
                                Esqueci minha senha
                            </a>
                        </div>

                        {/* Botão Entrar */}
                        <button
                            type="submit"
                            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Entrar
                        </button>

                        {/* Link de Cadastro */}
                        <p className="text-center text-sm text-gray-600 mt-8">
                            Não tenho conta?{' '}
                            <a href="#" className="font-semibold text-blue-700 hover:underline">
                                Cadastre-se
                            </a>
                        </p>

                    </form>

                    {/* Footer (opcional, baseado na imagem) */}
                    <footer className="text-center text-xs text-gray-500 mt-12 pt-4 border-t border-gray-200">
                        <p>AK - Demoner | todos direitos reservados</p>
                    </footer>

                </div>
            </div>
        </div>
    );
}
