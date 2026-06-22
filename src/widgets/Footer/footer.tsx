import { ReactNode } from 'react';
import { Container } from '@/shared/ui/container';
import { ArrowRightIcon } from '@/shared/ui/icons/arrow-right-icon';

interface FooterLinkProps {
    href?: string;
    children: ReactNode;
}

interface FooterTextProps {
    children: ReactNode;
}

const FooterLink = ({ href = '#', children }: FooterLinkProps) => (
    <li>
        <a href={href} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
            {children}
        </a>
    </li>
);

const FooterText = ({ children }: FooterTextProps) => (
    <p className="text-gray-600">{children}</p>
);

export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <Container className="py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Coluna 1: Logo, Descrição e Botão */}
                    <div className="lg:col-span-4 flex flex-col gap-6 items-start">
                        <img src="/logo.svg" alt="Outgrid" className="h-8 w-auto" />
                        <p className="text-gray-600 max-w-xs">
                            We are an online platform dedicated to showcasing and advancing modern
                            agricultural innovations and practices.
                        </p>
                        <button className="flex items-center gap-3 bg-gray-900 text-white font-medium px-6 py-3 rounded-full text-sm hover:bg-gray-700 transition-colors">
                            <span>Contact Us</span>
                            <ArrowRightIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Colunas de Links */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="font-bold text-gray-900">Navigation</h4>
                            <ul className="mt-4 space-y-3">
                                <FooterLink href="#services">Services</FooterLink>
                                <FooterLink href="#">Products</FooterLink>
                                <FooterLink href="#about-us">About</FooterLink>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900">Products</h4>
                            <ul className="mt-4 space-y-3">
                                <FooterLink>Organic Fertilizer</FooterLink>
                                <FooterLink>Technology Irrigation</FooterLink>
                                <FooterLink>Superior Seed Varieties</FooterLink>
                                <FooterLink>Agricultural Monitoring</FooterLink>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900">Address</h4>
                            <div className="mt-4 space-y-3">
                                <FooterText>8502 Preston Rd. Inglewood</FooterText>
                                <FooterText>Maine</FooterText>
                                <FooterText>98380</FooterText>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900">Contact</h4>
                            <div className="mt-4 space-y-3">
                                <li>
                                    <a
                                        href="mailto:hello@outgrid.com"
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        hello@outgrid.com
                                    </a>
                                </li>
                                <FooterText>+32 (2) 322 918 9484</FooterText>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">© 2025 Anderson Demoner.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-500 hover:text-gray-900 text-sm font-medium">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 text-sm font-medium">
                            Terms of use
                        </a>
                    </div>
                </div>
            </Container>
        </footer>
    );
};