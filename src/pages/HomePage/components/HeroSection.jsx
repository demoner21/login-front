import { Container } from '@/shared/ui/Container';
import { ArrowRightIcon } from '@/shared/ui/icons/ArrowRightIcon';
import { ArrowDownIcon } from '@/shared/ui/icons/ArrowDownIcon';
import { CheckCircleIcon } from '@/shared/ui/icons/CheckCircleIcon';

export const HeroSection = () => {
    return (
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
                {/* Espaçador para Navbar */}
                <div className="h-28" />

                {/* Conteúdo Principal */}
                <Container className="flex-grow flex flex-col justify-center">
                    {/* Título Principal */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold w-full tracking-tight leading-tight lg:mt-72">
                        Revolutionizing Agriculture Through Innovation
                    </h1>

                    {/* Grid de Subtextos */}
                    <div className="mt-12">
                        {/* Grid de Subtextos */}
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl lg:ml-16">
                            {/* Subtexto Esquerdo com ícone */}
                            <div className="flex gap-4 items-start">
                                <CheckCircleIcon className="w-7 h-7 text-green-400 flex-shrink-0 mt-1" />
                                <p className="text-xl text-gray-100 leading-relaxed">
                                    Dive into a world of possibilities where traditional farming meets modern solutions.
                                </p>
                            </div>

                            {/* Subtexto Direito */}
                            <div className="flex items-start pl-11 md:pl-0">
                                <p className="text-xl text-gray-100 leading-relaxed">
                                    Explore Sustainable Agricultural Solutions And Cutting-Edge Technologies.
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
                <Container>
                    <div className="mt-6 lg:-mt-8 flex flex-col sm:flex-row gap-6 items-start">
                        {/* Botão Principal */}
                        <button className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 text-lg">
                            <span>Our Services</span>
                            <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </div>
                </Container>

                {/* Link Explore More (inferior - opcional) */}
                <div className="w-full mt-auto py-10 md:pb-12">
                    <Container className="w-full flex justify-center md:justify-end">
                        <a href="#about-us" className="flex items-center gap-2 text-sm font-medium text-white hover:text-white-300 transition-colors duration-300">
                            <ArrowDownIcon className="w-5 h-5 stroke-2 text-white" />
                            <span>Scroll to Explore</span>
                        </a>
                    </Container>
                </div>
            </div>
        </section>
    );
};