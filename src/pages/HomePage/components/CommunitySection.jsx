import { Container } from '@/shared/ui/Container';
import { ArrowRightIcon } from '@/shared/ui/icons/ArrowRightIcon';

export const CommunitySection = () => {
    return (
        <section className="relative w-full text-white">

            {/* Background e Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/hero-bg-2.jpg')" }}
            />
            <div className="absolute inset-0 bg-black/50" />

            {/* 4. Conteúdo */}
            {/* MUDANÇA 1: Removemos 'flex flex-col' daqui.
                Isso garante que o h-full do Container funcione.
            */}
            <div className="relative z-10 h-[700px] md:h-[800px]">

                {/* MUDANÇA 2: Removemos 'flex-grow' e mantivemos 'h-full'.
                    O 'h-full' agora vai funcionar, dando altura ao container.
                    O 'justify-between' vai poder empurrar os itens.
                */}
                <Container className="flex flex-col justify-between h-full py-8 sm:py-12">

                    {/* Topo: Título (Correto) */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold max-w-lg tracking-tight text-left">
                            Collaborate and Learn from Industry Experts and Enthusiasts.
                        </h2>
                    </div>

                    {/* Fundo: Botão */}
                    {/* MUDANÇA 3: Adicionamos 'w-full'.
                        Isso força este div a ter 100% da largura do Container,
                        permitindo que 'justify-end' funcione.
                    */}
                    <div className="w-full flex justify-end">
                        {/* Botão Principal */}
                        <button className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 text-lg">
                            <span>Join the Community</span>
                            <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </div>

                </Container>
            </div>
        </section>
    );
};