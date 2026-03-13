import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border-dark bg-[#060a14]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="/logo-shippar.webp"
                                alt="Shippar"
                                className="h-8 w-auto"
                            />
                            <span className="text-lg font-bold gradient-text">
                                Academy
                            </span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed mb-6">
                            Conectando tu negocio con el mundo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/academy/register"
                                className="px-5 py-2 rounded-lg gradient-bg text-white text-sm font-medium hover:opacity-90 transition-opacity text-center"
                            >
                                Registrarse
                            </Link>
                            <a
                                href="https://shippar-app.vercel.app/cotizador"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 rounded-lg border border-white/10 bg-white/5 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-all text-center"
                            >
                                Calculadora Shippar
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                            Contacto
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="https://api.whatsapp.com/send/?phone=5491139243790&text=Hola%2C+te+escribo+desde+Shippar+Academy.+Termin%C3%A9+el+curso+y+quiero+m%C3%A1s+informaci%C3%B3n+sobre+c%C3%B3mo+empezar+a+importar.&type=phone_number&app_absent=0"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-text-secondary hover:text-green-400 transition-colors text-sm flex items-center gap-2"
                                >
                                    <span>💬</span> WhatsApp
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:importaciones@shippar.net"
                                    className="text-text-secondary hover:text-accent transition-colors text-sm flex items-center gap-2"
                                >
                                    <span>✉️</span> importaciones@shippar.net
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://shippar.net"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-text-secondary hover:text-accent transition-colors text-sm flex items-center gap-2"
                                >
                                    <span>🌐</span> shippar.net
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                            Plataforma
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/#cursos"
                                    className="text-text-secondary hover:text-accent transition-colors text-sm"
                                >
                                    Cursos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/academy/register"
                                    className="text-text-secondary hover:text-accent transition-colors text-sm"
                                >
                                    Registrarse
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://shippar-app.vercel.app/cotizador"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-text-secondary hover:text-accent transition-colors text-sm"
                                >
                                    Calculadora Shippar
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-border-dark text-center">
                    <p className="text-text-muted text-xs">
                        © {new Date().getFullYear()} Shippar Academy. Plataforma de Global
                        Shippar Logistic S.R.L. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
