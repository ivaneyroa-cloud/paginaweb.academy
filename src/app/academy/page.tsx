import Navbar from "@/components/academy/Navbar";
import Footer from "@/components/landing/Footer";
import Particles from "@/components/academy/Particles";
import HeroStats from "@/components/academy/HeroStats";
import RotatingText from "@/components/academy/RotatingText";
import SocialProof from "@/components/academy/SocialProof";
import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  {
    emoji: "🎬",
    title: "Videos + Notas en paralelo",
    description:
      "Aprendé viendo el paso a paso real mientras leés los puntos clave. Sin distracciones, sin vueltas.",
  },
  {
    emoji: "🧠",
    title: "Quizzes interactivos",
    description:
      "Validás lo que aprendiste con desafíos reales. No memorizás, aplicás.",
  },
  {
    emoji: "🏆",
    title: "Badges y progreso",
    description:
      "Desbloqueás niveles como importador. Aprender también puede ser progreso medible.",
  },
  {
    emoji: "📜",
    title: "Certificado S1",
    description:
      "Obtené el Certificado S1 y validá que sabés importar correctamente.",
  },
  {
    emoji: "💰",
    title: "100% Gratuito",
    description:
      "Acceso libre. Sin pagos, sin letra chica.",
  },
  {
    emoji: "📱",
    title: "Desde cualquier dispositivo",
    description:
      "Pensado para que lo uses mientras trabajás, viajás o estás en tu oficina.",
  },
];

const COURSE = {
  title: "Cómo Importar desde China en 2026",
  description:
    "La guía definitiva para emprendedores. Aprendé régimen courier simplificado, elegí productos rentables, calculá impuestos y recibí tu mercadería en Argentina.",
  modules: 4,
  lessons: 4,
  duration: "11 min",
  level: "Principiante",
  image: "/images/courses/course-importar-china.png",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ========== HERO — Premium Minimal ========== */}
      <section className="relative pt-28 pb-24 px-4 overflow-hidden">
        {/* Deep blue diagonal gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0c1929] to-[#0a1628]" />

        {/* Subtle glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[140px]" />

        {/* Tech micro-particles */}
        <Particles />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Small badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-medium mb-10 animate-slide-up backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Plataforma 100% gratuita
            </div>


            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] mb-6 animate-slide-up text-white">
              Aprende a{" "}
              <span className="hero-gradient-text">importar</span>
              <br />
              en menos de 15 minutos
            </h1>

            {/* Subheadline */}
            <p className="text-[#8b9dc3] text-lg sm:text-xl leading-relaxed mb-12 max-w-2xl mx-auto animate-slide-up">
              La primera plataforma 100% gratuita para aprender a importar
              desde cero en Argentina.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link
                href="/academy/register"
                className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#00bbff] text-white font-semibold text-base hover:shadow-[0_0_30px_rgba(0,102,255,0.3)] transition-all duration-300 w-full sm:w-auto"
              >
                Empezar ahora
              </Link>
              <a
                href="#cursos"
                className="px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white/80 font-medium text-base hover:bg-white/10 hover:text-white transition-all duration-300 w-full sm:w-auto text-center backdrop-blur-sm"
              >
                Ver Cursos
              </a>
            </div>

            {/* Social proof */}
            <SocialProof />

            {/* Testimonial */}
            <div className="mt-8 max-w-sm mx-auto animate-slide-up">
              <p className="text-white/55 text-sm italic leading-relaxed">
                &ldquo;Después del curso entendí cómo calcular impuestos antes de importar y evité un error costoso.&rdquo;
              </p>
              <p className="text-white/40 text-xs mt-2">— Martín, Buenos Aires</p>
            </div>

            {/* Animated Stats */}
            <HeroStats />
          </div>
        </div>
      </section>

      {/* ========== ROTATING BENEFITS (white break) ========== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-1 bg-gradient-to-r from-[#0066ff] to-[#00bbff] rounded-full mx-auto mb-6" />
          <RotatingText />
          <div className="w-12 h-1 bg-gradient-to-r from-[#00bbff] to-[#0066ff] rounded-full mx-auto mt-6" />
        </div>
      </section>

      {/* ========== DASHBOARD PREVIEW (dark, below rotating) ========== */}
      <section className="py-20 px-4 bg-[#0b1222]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#4d9fff] text-xl sm:text-2xl font-semibold tracking-wide mb-2">Así se ve por dentro</p>
          </div>
          <div className="relative">
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/dashboard-preview.png"
                alt="Shippar Academy — Dashboard real"
                width={1400}
                height={900}
                className="w-full h-auto"
                priority
              />
            </div>
            {/* Fade-out at bottom for intentional crop */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0b1222] to-transparent rounded-b-xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ========== COURSE CARD ========== */}
      <section id="cursos" className="py-20 px-4 bg-[#0e1830]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Nuestros <span className="hero-gradient-text">Cursos</span>
            </h2>
            <p className="text-[#8b9dc3] max-w-xl mx-auto">
              Empezá por el módulo fundamental y aprendé exactamente cómo
              importar desde China a Argentina sin cometer errores.
            </p>
          </div>

          {/* Course Card */}
          <div className="max-w-2xl mx-auto">
            <Link href="/academy/register" className="block group">
              <div className="glass-card card-hover overflow-hidden shadow-lg shadow-black/20 border border-white/10 hover:border-accent/30 transition-all duration-300">
                {/* Course Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <Image
                    src={COURSE.image}
                    alt={COURSE.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium backdrop-blur-sm">
                      {COURSE.level}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full glass text-white text-xs font-medium">
                      GRATIS
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    {COURSE.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {COURSE.description}
                  </p>
                  <div className="flex items-center gap-4 text-text-muted text-xs">
                    <span className="flex items-center gap-1">
                      📦 {COURSE.modules} módulos
                    </span>
                    <span className="flex items-center gap-1">
                      🎬 {COURSE.lessons} lecciones
                    </span>
                    <span className="flex items-center gap-1">
                      ⏱ {COURSE.duration}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* CTA below card */}
            <div className="text-center mt-8">
              <p className="text-[#8b9dc3] text-sm mb-4">
                Creá tu cuenta para acceder a todos los contenidos disponibles.
              </p>
              <Link
                href="/academy/register"
                className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#00bbff] text-white font-semibold text-base hover:shadow-[0_0_30px_rgba(0,102,255,0.3)] transition-all duration-300"
              >
                Crear mi cuenta gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-20 px-4 bg-[#0d1525]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Por qué <span className="gradient-text">Shippar Academy</span>?
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              No es teoría. Es aprendizaje aplicado para importar de verdad.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="glass-card card-hover p-6"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-4">{feature.emoji}</div>
                <h3 className="text-white font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20 px-4 bg-[#080c18]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-10 sm:p-14 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                ¿Listo para importar?
              </h2>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                Registrate gratis, completá el curso y validá que sabés
                importar correctamente.
              </p>
              <Link
                href="/academy/register"
                className="inline-block px-10 py-4 rounded-xl gradient-bg text-white font-semibold text-lg btn-glow hover:opacity-90 transition-opacity animate-pulse-glow"
              >
                Crear mi cuenta gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
