"use client";

export default function QuickActions() {
    return (
        <div className="glass-card p-6">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                ⚡ Acciones rápidas
            </h3>
            <div className="space-y-2">
                <a
                    href="https://shippar-app.vercel.app/cotizador"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 px-4 rounded-xl bg-white/5 border border-border-dark text-white text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                >
                    🧮 Calculadora Shippar
                </a>
                <a
                    href="https://www.alibaba.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 px-4 rounded-xl bg-white/5 border border-border-dark text-white text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                >
                    🌐 Explorar Alibaba
                </a>
                <a
                    href="https://api.whatsapp.com/send/?phone=5491139243790&text=Hola%2C+te+escribo+desde+Shippar+Academy.+Terminé+el+curso+y+quiero+más+información+sobre+cómo+empezar+a+importar.&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 px-4 rounded-xl bg-[#25d366]/10 border border-[#25d366]/20 text-[#25d366] text-sm font-medium hover:bg-[#25d366]/20 transition-all text-left"
                >
                    💬 Hablar con Shippar
                </a>
            </div>
        </div>
    );
}
