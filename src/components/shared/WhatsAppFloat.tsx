"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppFloat() {
    const [showLabel, setShowLabel] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowLabel(true), 3000);
        const hide = setTimeout(() => setShowLabel(false), 6000);
        return () => { clearTimeout(timer); clearTimeout(hide); };
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            <AnimatePresence>
                {showLabel && (
                    <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="bg-white text-gray-900 text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
                    >
                        ¿Necesitás ayuda?
                    </motion.span>
                )}
            </AnimatePresence>
            <a
                href="https://wa.me/5491100000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
            >
                <MessageCircle size={26} className="text-white" />
            </a>
        </div>
    );
}
