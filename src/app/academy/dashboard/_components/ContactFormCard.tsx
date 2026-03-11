"use client";

import { useState } from "react";

export default function ContactFormCard() {
    const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", interest: "", message: "" });
    const [formSent, setFormSent] = useState(false);
    const [sending, setSending] = useState(false);

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    access_key: "b23606d2-09d8-4445-adf2-8330c598d3f0",
                    subject: `Nuevo lead desde Shippar Academy: ${contactForm.name}`,
                    from_name: "Shippar Academy",
                    name: contactForm.name,
                    email: contactForm.email,
                    phone: contactForm.phone || "No proporcionado",
                    interest: contactForm.interest || "No especificado",
                    message: contactForm.message || "Sin mensaje adicional",
                }),
            });
            const result = await res.json();
            if (result.success) {
                setFormSent(true);
            } else {
                alert("Error al enviar. Intentá de nuevo o contactanos por WhatsApp.");
            }
        } catch {
            alert("Error de conexión. Intentá de nuevo.");
        } finally {
            setSending(false);
        }
    };

    return (
        <details className="glass-card group">
            <summary className="p-6 cursor-pointer list-none flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    📋 ¿Querés importar? Contactanos
                </h2>
                <span className="text-text-muted text-lg group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-6 pb-6">
                <p className="text-text-secondary text-sm mb-5">
                    Dejá tus datos y nuestro equipo te contacta en menos de 24hs.
                </p>

                {formSent ? (
                    <div className="text-center py-8">
                        <div className="text-5xl mb-3">✅</div>
                        <h3 className="text-white font-bold text-lg mb-1">¡Mensaje enviado!</h3>
                        <p className="text-text-secondary text-sm">
                            Te contactamos pronto. Mientras, explorá productos en{" "}
                            <a href="https://www.alibaba.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                Alibaba
                            </a>.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input type="text" placeholder="Tu nombre" required value={contactForm.name}
                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white placeholder-text-muted text-sm focus:border-primary focus:outline-none transition-colors" />
                            <input type="email" placeholder="Email" required value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white placeholder-text-muted text-sm focus:border-primary focus:outline-none transition-colors" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input type="tel" placeholder="Teléfono (opcional)" value={contactForm.phone}
                                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white placeholder-text-muted text-sm focus:border-primary focus:outline-none transition-colors" />
                            <select value={contactForm.interest}
                                onChange={(e) => setContactForm({ ...contactForm, interest: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white text-sm focus:border-primary focus:outline-none transition-colors appearance-none">
                                <option value="" className="bg-gray-900">¿Qué querés importar?</option>
                                <option value="electronica" className="bg-gray-900">Electrónica</option>
                                <option value="indumentaria" className="bg-gray-900">Indumentaria</option>
                                <option value="accesorios" className="bg-gray-900">Accesorios</option>
                                <option value="hogar" className="bg-gray-900">Hogar / Bazar</option>
                                <option value="repuestos" className="bg-gray-900">Repuestos / Técnicos</option>
                                <option value="otro" className="bg-gray-900">Otro</option>
                            </select>
                        </div>
                        <textarea placeholder="Contanos qué tenés en mente..." rows={3} value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white placeholder-text-muted text-sm focus:border-primary focus:outline-none transition-colors resize-none" />
                        <button type="submit" disabled={sending}
                            className="w-full py-3.5 rounded-xl gradient-bg text-white font-semibold btn-glow hover:opacity-90 transition-opacity disabled:opacity-60">
                            {sending ? "Enviando..." : "📨 Enviar consulta"}
                        </button>
                    </form>
                )}
            </div>
        </details>
    );
}
