import React from 'react';
import { RegisterForm } from '../../features/RegisterForm/RegisterForm';
// import { LogoPlaceholder } from '../../shared/ui/LogoPlaceholder';

const RegisterPage = () => {
    // TODO: Você pode usar a mesma imagem ou uma diferente
    const cityscapeImageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80'; // Placeholder

    return (
        // --- Container Principal ---
        <div
            className="min-h-screen w-full flex flex-col lg:flex-row font-sans"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${cityscapeImageUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* --- Painel Esquerdo (Info) --- */}
            <div
                // AQUI ESTAVA O ERRO: Era lg:w-3/V
                className="hidden lg:flex w-full lg:w-3/5 flex-col justify-center p-8 lg:p-16 text-white"
            >
                <div className="max-w-md">
                    {/* <LogoPlaceholder /> */}

                    <h1 className="text-4xl lg:text-5xl font-bold mt-6 mb-4">
                        Comece sua jornada
                    </h1>
                    <p className="text-lg text-gray-200">
                        Rápido, fácil e seguro.
                        Crie sua conta para aproveitar todos os nossos recursos.
                    </p>
                </div>
            </div>

            {/* --- Painel Direito (Formulário) --- */}
            <div className="w-full lg:w-2/5 bg-white backdrop-blur-lg flex flex-col justify-center p-8 lg:p-12 flex-grow lg:flex-grow-0">
                <div className="w-full max-w-md mx-auto">

                    {/* A Página renderiza a Feature de Registro aqui */}
                    <RegisterForm />

                </div>
            </div>
        </div>
    );
};

export default RegisterPage;