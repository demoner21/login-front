import { Container } from '@/shared/ui/Container';
import { CropMonitoringIcon } from '@/shared/ui/icons/CropMonitoringIcon';
import { PrecisionFarmingIcon } from '@/shared/ui/icons/PrecisionFarmingIcon';
import { DataAnalyticsIcon } from '@/shared/ui/icons/DataAnalyticsIcon';
import { LocationIcon } from '@/shared/ui/icons/LocationIcon';

const ServiceCard = ({ icon, title, description }) => {
    const IconComponent = icon;
    return (
        <div className="flex flex-col gap-4">
            <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center">
                <IconComponent className="w-7 h-7 text-black" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    );
};

const GalleryImageCard = ({ imageSrc, location }) => (
    <div className="relative rounded-2xl overflow-hidden">
        <img
            src={imageSrc}
            alt={location}
            className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="flex items-center gap-2 text-sm text-gray-200">
                <LocationIcon className="w-4 h-4 text-lime-400" />
                {location}
            </p>
        </div>
    </div>
);

// NOVO: Container principal da galeria
const GallerySection = () => (
    <div className="mt-24 sm:mt-32 space-y-48">
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl tracking-tight leading-tight text-center mx-auto">
            Changing The Game In Farming<br />
            With Sustainable Practices And<br />
            Cool Technologies, Shaping The<br />
            Future Of Agriculture
        </h2>

        {/* Container das imagens usando rem para espaçamento */}
        <div className="mt-16 space-y-48 mx-auto w-full px-4 sm:px-8">

            {/* Imagem 1: Alinhada à ESQUERDA */}
            <div className="flex justify-start">
                <div className="w-[20rem] md:w-[24rem] lg:w-[28rem] h-[12rem] md:h-[15rem] lg:h-[18rem]">
                    <GalleryImageCard
                        imageSrc="/gallery-wheat.jpg"
                        location="Iowa, United States"
                    />
                </div>
            </div>

            {/* Imagem 2: Alinhada à DIREITA */}
            <div className="flex justify-end">
                <div className="w-[20rem] md:w-[24rem] lg:w-[28rem] h-[12rem] md:h-[15rem] lg:h-[18rem]">
                    <GalleryImageCard
                        imageSrc="/gallery-haybales.jpg"
                        location="Queensland, Australia"
                    />
                </div>
            </div>

            {/* Imagem 3: CENTRALIZADA */}
            <div className="flex justify-center">
                <div className="w-[20rem] md:w-[24rem] lg:w-[28rem] h-[12rem] md:h-[15rem] lg:h-[18rem]">
                    <GalleryImageCard
                        imageSrc="/gallery-sprayer.jpg"
                        location="Farmville, Columbia"
                    />
                </div>
            </div>

        </div>
    </div>
);

export const ServicesSection = () => {
    return (
        <section id="services" className="bg-gray-900 text-white py-24 sm:py-32">
            <Container>
                {/* --- Bloco de Texto (Serviços) --- */}
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold max-w-4xl tracking-tight">
                        Explore Outgrid's Pioneering Technology...
                    </h2>

                    <p className="mt-12 text-sm font-medium uppercase tracking-widest text-gray-400">
                        Our sustainable products
                    </p>
                </div>

                {/* --- Bloco de Serviços (Grid) --- */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <ServiceCard
                        icon={CropMonitoringIcon}
                        title="Crop Monitoring"
                        description="Real-time insights into crop health, stress levels, and growth stages."
                    />
                    <ServiceCard
                        icon={PrecisionFarmingIcon}
                        title="Precision Farming"
                        description="Optimize resource application like water and fertilizers with pinpoint accuracy."
                    />
                    <ServiceCard
                        icon={DataAnalyticsIcon}
                        title="Data Analytics"
                        description="Turn raw data into actionable intelligence for better decision-making."
                    />
                </div>

                {/* --- NOVA SEÇÃO DE GALERIA --- */}
                <GallerySection />

            </Container>
        </section>
    );
};