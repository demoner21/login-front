import { Navbar } from '@/widgets/Navbar/navbar';
import { Newsletter } from '@/widgets/Newsletter/newsletter';
import { Footer } from '@/widgets/Footer/footer';
import { HeroSection } from './components/hero-section';
import { AboutUsSection } from './components/about-us-section';
import { CommunitySection } from './components/community-section';
import { ConnectSection } from './components/connect-section';
import { ServicesSection } from './components/services-section';
import { StatsSection } from './components/stats-section';

export const HomePage = () => {
    return (
        <div className="relative min-h-screen bg-gray-100">
            <Navbar />
            <main>
                <HeroSection />
                <AboutUsSection />
                <CommunitySection />
                <ConnectSection />
                <ServicesSection />
                <StatsSection />
                <Newsletter />
            </main>
            <Footer />
        </div>
    );
};