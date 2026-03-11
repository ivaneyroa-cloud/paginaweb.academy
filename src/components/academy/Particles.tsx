"use client";

import { useEffect, useRef } from "react";

export default function Particles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let particles: {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
            opacitySpeed: number;
        }[] = [];

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const init = () => {
            resize();
            particles = [];
            const count = Math.floor((canvas.width * canvas.height) / 25000); // Subtle density
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.5 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.2,
                    opacity: Math.random() * 0.3 + 0.05,
                    opacitySpeed: (Math.random() - 0.5) * 0.005,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.opacity += p.opacitySpeed;

                if (p.opacity <= 0.05 || p.opacity >= 0.35) {
                    p.opacitySpeed *= -1;
                }

                // Wrap around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 180, 255, ${p.opacity})`;
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        init();
        animate();

        window.addEventListener("resize", init);
        return () => {
            window.removeEventListener("resize", init);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.6 }}
        />
    );
}
