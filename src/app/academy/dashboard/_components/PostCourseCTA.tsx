"use client";

import Link from "next/link";

export default function PostCourseCTA() {
    return (
        <>
            {/* Revenue CTA */}
            <div className="glass-card p-6 relative overflow-hidden border border-amber-500/20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-[60px]" />
                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-white mb-2">
                        🔥 ¿Listo para importar?
                    </h2>
                    <p className="text-text-secondary mb-5 leading-relaxed">
                        Ya sabés calcular impuestos y márgenes.
                        <br />
                        <span className="text-amber-300 font-medium">Ahora podés importar con seguridad.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href="https://www.alibaba.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:opacity-90 transition-opacity"
                        >
                            🔍 Explorar Alibaba
                        </a>
                        <a
                            href="https://api.whatsapp.com/send/?phone=5491139243790&text=Hola%2C+te+escribo+desde+Shippar+Academy.+Terminé+el+curso+y+quiero+más+información+sobre+cómo+empezar+a+importar.&type=phone_number&app_absent=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-4 rounded-xl bg-[#25d366] text-white font-bold text-base hover:opacity-90 transition-opacity"
                        >
                            💬 Cotizar con Shippar
                            <span className="block text-[11px] font-normal text-white/70 mt-0.5">Respuesta en menos de 24h</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Community banner */}
            <Link
                href="/academy/dashboard/community"
                className="block glass-card p-5 border border-accent/20 hover:border-accent/40 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🌟</span>
                    <div>
                        <p className="text-white font-semibold text-sm group-hover:text-accent transition-colors">
                            Presentate en la comunidad como nuevo Importador S1
                        </p>
                        <p className="text-text-muted text-xs">Compartí tu experiencia y conectá con otros importadores</p>
                    </div>
                    <span className="ml-auto text-text-muted group-hover:text-accent transition-colors">→</span>
                </div>
            </Link>
        </>
    );
}
