import { Container } from '@/shared/ui/container';
import { ArrowRightIcon } from '@/shared/ui/icons/arrow-right-icon';
import { ArrowDownIcon } from '@/shared/ui/icons/arrow-down-icon';
import { CheckCircleIcon } from '@/shared/ui/icons/check-circle-icon';

export const HeroSection = () => {
    return (
        // DICA: Use h-[100dvh] se puder (Dynamic Viewport Height) para evitar problemas 
        // com a barra de endereço do navegador no celular. Se não, h-screen serve.
        <section className="relative h-screen w-full text-white">
            
            {/* Imagem de Fundo */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/hero-bg.jpg')" }}
            />

            {/* Overlay Escuro */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Conteúdo */}
            <div className="relative z-10 h-full flex flex-col">

                <Container className="flex flex-col justify-start pt-28 md:pt-48 text-center h-full">
                    
                    {/* Título Principal */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold w-full tracking-tight leading-tight mx-auto max-w-6xl">
                        Revolutionizing Agriculture Through Innovation
                    </h1>

                    {/* Grid de Subtextos */}
                    <div className="mt-8 w-full">
                        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto text-left">
                            
                            {/* Subtexto Esquerdo */}
                            <div className="flex gap-4 items-start justify-center md:justify-start">
                                <CheckCircleIcon className="w-7 h-7 text-green-400 flex-shrink-0 mt-1" />
                                <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
                                    Dive into a world of possibilities where traditional farming meets modern solutions.
                                </p>
                            </div>

                            {/* Subtexto Direito */}
                            <div className="flex items-start justify-center md:justify-start">
                                <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
                                    Explore Sustainable Agricultural Solutions And Cutting-Edge Technologies.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botão Principal */}
                    <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-6 items-center justify-center pb-20">
                        <button className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 text-lg">
                            <span>Our Services</span>
                            <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </div>
                </Container>

                <div className="absolute bottom-8 w-full">
                    <Container className="w-full flex justify-center md:justify-end">
                        <a href="#about-us" className="flex items-center gap-2 text-sm font-medium text-white hover:text-white-300 transition-colors duration-300">
                            <ArrowDownIcon className="w-5 h-5 stroke-2 text-white animate-bounce" />
                            <span>Scroll to Explore</span>
                        </a>
                    </Container>
                </div>
            </div>
        </section>
    );
};