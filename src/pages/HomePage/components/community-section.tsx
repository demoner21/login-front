import { Container } from '@/shared/ui/container';
import { ArrowRightIcon } from '@/shared/ui/icons/arrow-right-icon';

export const CommunitySection = () => {
    return (
        <section className="relative w-full text-white">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/hero-bg-2.jpg')" }}
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 h-[700px] md:h-[800px]">
                <Container className="flex flex-col justify-between h-full py-8 sm:py-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold max-w-lg tracking-tight text-left">
                            Collaborate and Learn from Industry Experts and Enthusiasts.
                        </h2>
                    </div>

                    <div className="w-full flex justify-end">
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