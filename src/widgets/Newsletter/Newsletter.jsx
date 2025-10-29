// src/widgets/Newsletter/Newsletter.jsx

import { Container } from '@/shared/ui/Container';
import { ArrowRightIcon } from '@/shared/ui/icons/ArrowRightIcon';

export const Newsletter = () => {
    return (
        // Usando o mesmo fundo 'bg-gray-900' para manter a consistência
        <section className="bg-gray-900 py-24 sm:py-32">
            <Container>
                <div className="mx-auto max-w-2xl text-center">

                    {/* Título */}
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                        Get The Latest Outgrid Updates By Subscribing To Our Newsletter!
                    </h2>

                    {/* Formulário */}
                    <form className="mt-12">
                        {/* Wrapper do Input (o pílula branca) */}
                        <div className="flex w-full max-w-lg mx-auto bg-white rounded-full p-2.5">

                            {/* Input */}
                            <input
                                type="email"
                                required
                                placeholder="Enter email address"
                                className="w-full border-none bg-transparent px-4 py-1 text-gray-900 placeholder:text-gray-500 focus:ring-0"
                            />

                            {/* Botão de Submissão */}
                            {/* Reutilizando nosso estilo de botão de lime */}
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-lime-400 text-black font-bold px-6 py-2.5 rounded-full text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex-shrink-0"
                            >
                                <span>Join Now</span>
                                <ArrowRightIcon className="w-4 h-4" />
                            </button>

                        </div>
                    </form>

                </div>
            </Container>
        </section>
    );
};