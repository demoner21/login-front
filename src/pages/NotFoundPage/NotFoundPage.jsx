import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/ui/Button'; // Reutilizando seu botão

const NotFoundPage = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
            <h1 className="text-9xl font-bold text-blue-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">Página não encontrada</h2>
            <p className="text-gray-600 mt-2 mb-8 max-w-md">
                Opa! Parece que você se perdeu no campo. A página que você está procurando não existe ou foi movida.
            </p>
            <div className="w-full max-w-xs">
                <Link to="/">
                    <Button>Voltar para o Início</Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;