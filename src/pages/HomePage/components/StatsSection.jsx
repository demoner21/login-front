import { Container } from '@/shared/ui/Container';
import { YieldIcon } from '@/shared/ui/icons/YieldIcon';
import { WaterUsageIcon } from '@/shared/ui/icons/WaterUsageIcon';

// Subcomponente para os itens de estatística
const StatItem = ({ icon, value, description }) => {
    const IconComponent = icon;

    return (
        <div className="flex flex-col gap-4">
            {/* Ícone */}
            <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center border-8 border-lime-200/60">
                <IconComponent className="w-8 h-8 text-lime-600" />
            </div>

            {/* Texto */}
            <div className="mt-2">
                <span className="text-5xl font-bold text-gray-900">{value}</span>
                <p className="mt-2 text-gray-600 max-w-[200px]">
                    {description}
                </p>
            </div>
        </div>
    );
};


// Componente Principal
export const StatsSection = () => {
    return (
        // Fundo branco
        <section className="bg-white py-24 sm:py-32">
            <Container>
                {/* Grid principal de 2 colunas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* --- COLUNA ESQUERDA: Texto e Estatísticas --- */}
                    <div className="flex flex-col gap-10">

                        {/* Bloco de Texto */}
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                                Improving Farming With New Ideas For The Future.
                            </h2>
                            <p className="mt-6 text-lg text-gray-600">
                                We're all about shaking up modern agriculture with cool, sustainable practices to make the industry way greener and awesome for the future.
                            </p>
                        </div>

                        {/* Bloco de Estatísticas (Grid interno de 2 colunas) */}
                        <div className="grid grid-cols-2 gap-8">
                            <StatItem
                                icon={YieldIcon}
                                value="50%"
                                description="Increase in Crop Yield with Outgrid's Sustainable Solutions."
                            />
                            <StatItem
                                icon={WaterUsageIcon}
                                value="45%"
                                description="Reduction in Water Usage with Outgrid's Smart Irrigation."
                            />
                        </div>

                    </div>

                    {/* --- COLUNA DIREITA: Imagem --- */}
                    <div>
                        <img
                            src="/hands-seedling.jpg"
                            alt="Hands holding a seedling"
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>

                </div>
            </Container>
        </section>
    );
};