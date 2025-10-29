import { Navbar } from '@/widgets/Navbar/Navbar';
import { Newsletter } from '@/widgets/Newsletter/Newsletter';
import { Footer } from '@/widgets/Footer/Footer';

import { HeroSection } from './components/HeroSection';
import { AboutUsSection } from './components/AboutUsSection';
import { CommunitySection } from './components/CommunitySection';
import { ConnectSection } from './components/ConnectSection';
import { ServicesSection } from './components/ServicesSection';
import { StatsSection } from './components/StatsSection';

export const HomePage = () => {
    return (
        // 'relative' aqui é a "âncora" para a Navbar 'absolute'
        <div className="relative min-h-screen bg-gray-100">

            {/* Navbar flutua sobre o conteúdo */}
            <Navbar />

            <main>
                <HeroSection />
                <AboutUsSection />
                <CommunitySection />
                <ConnectSection />
                <ServicesSection />
                <StatsSection />
                <Newsletter />
                {/* <ServicesSection /> */}
                {/* ... */}
            </main>

            <Footer />
        </div>
    );
};