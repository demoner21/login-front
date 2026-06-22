import { ComponentType, SVGProps } from 'react';
import { Container } from '@/shared/ui/container';
import { YieldIcon } from '@/shared/ui/icons/yield-icon';
import { WaterUsageIcon } from '@/shared/ui/icons/water-usage-icon';

interface StatItemProps {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    value: string;
    description: string;
}

const StatItem = ({ icon: IconComponent, value, description }: StatItemProps) => (
    <div className="flex flex-col gap-4">
        <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center border-8 border-lime-200/60">
            <IconComponent className="w-8 h-8 text-lime-600" />
        </div>
        <div className="mt-2">
            <span className="text-5xl font-bold text-gray-900">{value}</span>
            <p className="mt-2 text-gray-600 max-w-[200px]">{description}</p>
        </div>
    </div>
);

export const StatsSection = () => {
    return (
        <section className="bg-white py-24 sm:py-32">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                                Improving Farming With New Ideas For The Future.
                            </h2>
                            <p className="mt-6 text-lg text-gray-600">
                                We're all about shaking up modern agriculture with cool, sustainable
                                practices to make the industry way greener and awesome for the future.
                            </p>
                        </div>
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