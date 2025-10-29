import { Container } from '@/shared/ui/Container';

export const ConnectSection = () => {
    return (
        // Esta seção usa um fundo branco
        <section id="contact" className="bg-white py-24 sm:py-32">
            <Container>
                {/* --- Bloco de Texto --- */}
                <div>
                    {/* Reutilizando o estilo de subtítulo que já usamos */}
                    <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
                        Connect with us
                    </p>

                    <h2 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900 max-w-4xl tracking-tight">
                        Be Part Of A Dynamic Community Focused On Advancing Agriculture Together.
                    </h2>

                    <p className="mt-6 text-lg text-gray-600 max-w-3xl">
                        Become part of a supportive community dedicated to fostering innovation in agriculture. Engage in discussions, ask questions, and share your experiences with fellow enthusiasts and experts.
                    </p>
                </div>

                {/* --- Bloco de Imagens --- */}
                <div className="mt-16">
                    {/* Usamos um grid de 3 colunas.
            - A primeira imagem ocupa 2 colunas (md:col-span-2)
            - A segunda imagem ocupa 1 coluna (md:col-span-1)
          */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Imagem da Esquerda (Maior) */}
                        <div className="md:col-span-2">
                            <img
                                src="/connect-vineyard.jpg"
                                alt="Vineyard rows"
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>

                        {/* Imagem da Direita (Menor) */}
                        <div className="md:col-span-1">
                            <img
                                src="/connect-grapes.jpg"
                                alt="Close-up of grapes on vine"
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>

                    </div>
                </div>

            </Container>
        </section>
    );
};