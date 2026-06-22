import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/shared/ui/container';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="w-full absolute top-0 left-0 z-30 pt-6">
            <Container className="flex justify-between items-center">
                {/* Logo */}
                <div>
                    <Link to="/">
                        <img src="/logo.png" alt="Outgrid" className="h-8 w-auto" />
                    </Link>
                </div>

                {/* Desktop */}
                <div className="hidden md:flex items-center space-x-4">
                    <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-full shadow-sm">
                        <div className="flex space-x-1 p-1.5">
                            <a
                                href="#about-us"
                                className="text-gray-800 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                About Us
                            </a>
                            <a
                                href="#services"
                                className="text-gray-800 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Services
                            </a>
                            <a
                                href="#contact"
                                className="text-gray-800 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    <Link
                        to="/login"
                        className="text-gray-800 bg-white bg-opacity-90 backdrop-blur-md text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                    >
                        Login
                    </Link>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="bg-white bg-opacity-90 backdrop-blur-md rounded-full shadow-sm w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex flex-col items-center justify-center w-6 h-6">
                            <span
                                className={`block h-0.5 w-6 bg-gray-800 transition-all ${
                                    isMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
                                }`}
                            />
                            <span
                                className={`block h-0.5 w-6 bg-gray-800 transition-all ${
                                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                                }`}
                            />
                            <span
                                className={`block h-0.5 w-6 bg-gray-800 transition-all ${
                                    isMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
                                }`}
                            />
                        </div>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-4 bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-lg py-4 px-6 min-w-48">
                            <div className="flex flex-col space-y-3">
                                {[
                                    { href: '#about-us', label: 'About Us' },
                                    { href: '#services', label: 'Services' },
                                    { href: '#contact', label: 'Contact' },
                                ].map(({ href, label }) => (
                                    <a
                                        key={href}
                                        href={href}
                                        className="text-gray-800 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-colors text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {label}
                                    </a>
                                ))}

                                <hr className="my-2 border-gray-200" />

                                <Link
                                    to="/login"
                                    className="text-gray-800 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-colors text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </nav>
    );
};