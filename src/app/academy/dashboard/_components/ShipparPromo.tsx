"use client";

export default function ShipparPromo() {
    return (
        <div className="glass-card p-6 border border-primary/20">
            <div className="text-center">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="text-white font-bold text-sm mb-2">
                    ¿Primera importación?
                </h3>
                <p className="text-text-muted text-xs mb-4 leading-relaxed">
                    Shippar te acompaña door to door desde China hasta tu puerta.
                </p>
                <a
                    href="https://shippar.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                    Conocé Shippar →
                </a>
            </div>
        </div>
    );
}
