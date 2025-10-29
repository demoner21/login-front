import { useState } from 'react';
import { Container } from '@/shared/ui/Container';
import { ArrowRightIcon } from '@/shared/ui/icons/ArrowRightIcon';

const ProductCard = ({ imageSrc, title }) => (
    <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
        <img src={imageSrc} alt={title} className="w-full h-64 object-cover" />
        <p className="p-5 font-bold text-gray-800 text-lg">
            {title}
        </p>
    </div>
);

const BenefitItem = ({
    number,
    title,
    description,
    isOpen,
    onClick
}) => (
    <div className="border-b border-gray-300">
        {/* Transformamos o cabeçalho em um botão */}
        <button
            onClick={onClick}
            className="w-full text-left py-8"
        >
            <div className="flex justify-between items-start gap-6">
                {/* Lado Esquerdo: Conteúdo */}
                <div className="flex gap-6 md:gap-8">
                    <span className="text-2xl font-bold text-gray-800">{number}</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h3>
                </div>

                {/* Lado Direito: Ícone (agora com rotação) */}
                <ArrowRightIcon className={`
          w-6 h-6 text-gray-900 flex-shrink-0 mt-2
          transition-transform duration-300
          ${isOpen ? 'transform rotate-90' : ''}
        `} />
            </div>
        </button>

        {/* Seção de Conteúdo Colapsável */}
        <div
            className={`
        grid overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
      `}
        >
            <div className="min-h-0">
                <div className="pb-8 pl-12 md:pl-16">
                    {description && (
                        <p className="text-gray-600 text-base max-w-lg">
                            {description}
                        </p>
                    )}

                    {/* Texto de teste para itens sem descrição */}
                    <p className="mt-4 text-blue-600 font-medium">
                        [TESTE] Este é o texto expandido para o item {number}.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export const AboutUsSection = () => {
    const [openBenefit, setOpenBenefit] = useState('01');

    const handleBenefitClick = (number) => {
        setOpenBenefit(prevOpen => (prevOpen === number ? null : number));
    };

    return (
        <section id="about-us" className="bg-gray-50 py-24 sm:py-32">
            <Container>

                {/* --- PARTE 1: PRODUTOS (MANTIDO IGUAL) --- */}
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-4xl tracking-tight">
                        Explore Outgrid's Pioneering Technology, Which Is Revolutionizing...
                    </h2>

                    <p className="mt-12 text-sm font-medium uppercase tracking-widest text-gray-500">
                        Our sustainable products
                    </p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ProductCard
                            imageSrc="/ai-crop.jpg"
                            title="AI Crop Monitoring"
                        />
                        <ProductCard
                            imageSrc="/product-drone.jpg"
                            title="Drone & Satellite Farming"
                        />
                        <ProductCard
                            imageSrc="/product-analytics.jpg"
                            title="Data-Driven Farm Analytics"
                        />
                    </div>
                </div>

                {/* --- PARTE 2: BENEFÍCIOS (ATUALIZADO com accordion) --- */}
                <div className="mt-24 sm:mt-32">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-4xl tracking-tight">
                        Check Out Outgrid's Awesome Modern Farming Solutions...
                    </h2>
                    <p className="mt-6 text-lg text-gray-600 max-w-3xl">
                        At Outgrid, we offer innovative services to revolutionize...
                    </p>

                    <p className="mt-16 text-sm font-medium uppercase tracking-widest text-gray-500">
                        Benefits of Outgrid's
                    </p>

                    {/* Adicionamos uma borda superior ao container da lista */}
                    <div className="mt-8 border-t border-gray-300">
                        <BenefitItem
                            number="01"
                            title="AI Crop Monitoring"
                            description="Outgrid elevates crop productivity sustainably..."
                            isOpen={openBenefit === '01'}
                            onClick={() => handleBenefitClick('01')}
                        />
                        <BenefitItem
                            number="02"
                            title="Drone & Satellite Farming"
                            isOpen={openBenefit === '02'}
                            onClick={() => handleBenefitClick('02')}
                        />
                        <BenefitItem
                            number="03"
                            title="Data-Driven Farm Analytics"
                            isOpen={openBenefit === '03'}
                            onClick={() => handleBenefitClick('03')}
                        />
                    </div>
                </div>

            </Container>
        </section>
    );
};