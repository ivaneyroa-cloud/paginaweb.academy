import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos y Condiciones — Shippar Logistics",
    description: "Términos y condiciones de servicio de Shippar Global Logistics S.R.L. Información sobre responsabilidades, tarifas, gestión aduanera y más.",
};

const SECTIONS = [
    {
        number: "1",
        title: "Descripción del Servicio",
        content: [
            "El Usuario solicita a SHIPPAR la recepción de bienes en nuestros depósitos físicos ubicados en el exterior (incluyendo, pero no limitándose a, Estados Unidos, China, Pakistán y países de Europa) y su posterior transporte hacia la República Argentina (entregados en oficinas de SHIPPAR o en el domicilio indicado por el Usuario).",
        ],
        sub: [
            {
                label: "Tiempos de entrega",
                text: "Los plazos de tránsito internacional variarán dependiendo del país de origen y la modalidad del envío (aéreo o marítimo). Estos plazos son siempre estimados y pueden extenderse por motivos ajenos a SHIPPAR, sin que esto genere responsabilidad para la empresa.",
            },
        ],
    },
    {
        number: "2",
        title: "Gestión Aduanera y Tributaria",
        content: [],
        sub: [
            {
                label: "Trámites",
                text: "SHIPPAR (o terceros designados) realizará los trámites aduaneros correspondientes para las cargas correctamente declaradas.",
            },
            {
                label: "Retenciones",
                text: "Si la carga es retenida por circunstancias ajenas a la responsabilidad de SHIPPAR, el Usuario podrá optar por realizar la desaduanización con su propio despachante o solicitar los servicios de SHIPPAR (asumiendo los costos devengados por dicho concepto).",
            },
            {
                label: "Inspecciones",
                text: "El Usuario autoriza a SHIPPAR y a las autoridades aduaneras (nacionales o internacionales) a inspeccionar su carga si así lo solicitaran.",
            },
            {
                label: "Declaración Jurada",
                text: "SHIPPAR declarará la mercadería ante las autoridades competentes utilizando la Clave Única de Identificación Tributaria (CUIT) y los datos provistos por el Usuario. Esta información reviste carácter de Declaración Jurada. El Usuario garantiza que su CUIT es correcto y exime a SHIPPAR de cualquier responsabilidad por datos erróneos o falsos.",
            },
            {
                label: "Cambios normativos",
                text: "SHIPPAR no se responsabiliza por eventuales modificaciones en las normativas aduaneras, cambiarias o disposiciones de la AFIP / Aduana vinculadas a la nacionalización de envíos.",
            },
        ],
    },
    {
        number: "3",
        title: "Tarifas y Facturación",
        content: [],
        sub: [
            {
                label: "Cálculo del peso",
                text: "El costo del envío se calcula en función del peso real o el peso volumétrico por bulto, aplicándose el que resulte mayor. SHIPPAR se reserva el derecho de volver a pesar y medir cualquier bulto para confirmar este cálculo antes de su despacho.",
            },
            {
                label: "Cargos adicionales",
                text: "Cada paquete despachado desde nuestros almacenes en el exterior tiene un costo de manejo documentario, independientemente de la cantidad de compras que contenga (revistas, cartas y documentos están exentos).",
            },
            {
                label: "Pagos",
                text: "El Usuario deberá abonar o reembolsar a SHIPPAR todos los cargos de envío, impuestos, tasas fiscales y derechos aduaneros adeudados. El pago de estos conceptos podrá solicitarse de forma anticipada a la entrega de la mercadería.",
            },
        ],
    },
    {
        number: "4",
        title: "Limitación de Responsabilidad de SHIPPAR",
        content: [
            "SHIPPAR actúa exclusivamente como operador logístico y no reviste el carácter de fabricante ni vendedor de los productos transportados. Por consiguiente:",
        ],
        sub: [
            {
                label: "Daños en origen",
                text: "SHIPPAR no se responsabiliza por paquetes recibidos en malas condiciones en los depósitos del exterior que presenten daños derivados del mal manejo de proveedores, vendedores o correos locales.",
            },
            {
                label: "Garantía y defectos",
                text: "No asumimos responsabilidad por las deficiencias, fallas de fábrica o falta de utilidad de los bienes transportados.",
            },
            {
                label: "Límite de indemnización",
                text: "La máxima responsabilidad por daño, pérdida, retraso o extravío se limita a USD 100 por envío o USD 20 por kilogramo (o su equivalente en moneda local), el que resulte mayor. Si la mercadería posee un valor superior, el Usuario deberá declararlo previamente y abonar el cargo adicional correspondiente al seguro.",
            },
            {
                label: "Fuerza mayor",
                text: "Quedan excluidas las pérdidas derivadas de circunstancias fuera de nuestro control (desastres naturales, guerras, huelgas, conmoción civil, paros aduaneros o de aerolíneas, etc.). Tampoco se reconocerán reclamos por lucro cesante o pérdida de negocios futuros.",
            },
            {
                label: "Responsabilidad del Usuario",
                text: "SHIPPAR no será responsable si el Usuario o destinatario realiza una declaración incorrecta de la carga, un embalaje deficiente, o envía artículos prohibidos o restringidos (ej. dinero en efectivo, divisas, materiales peligrosos).",
            },
        ],
    },
    {
        number: "5",
        title: "Reclamos y Mercadería Abandonada",
        content: [],
        sub: [
            {
                label: "Plazos de reclamo",
                text: "Cualquier reclamo por pérdida o destrucción de bienes deberá presentarse a SHIPPAR dentro de los 30 días corridos posteriores al momento en que el paquete esté disponible para ser entregado.",
            },
            {
                label: "Destrucción de mercadería",
                text: "El Usuario acepta que los bienes que lleguen a las oficinas de SHIPPAR en Argentina y no sean retirados en un plazo de 60 días (por motivos imputables al Usuario) serán destruidos, sin responsabilidad ni derecho a compensación alguna.",
            },
        ],
    },
    {
        number: "6",
        title: "Plataforma y Fallas del Sistema",
        content: [
            "SHIPPAR no garantiza el acceso y uso continuado o ininterrumpido de su Sitio Web. No nos responsabilizamos por cualquier daño, perjuicio o pérdida causada por fallas en el sistema, en los servidores, proveedores de internet o por transmisiones electrónicas incompletas o erróneas.",
        ],
        sub: [],
    },
    {
        number: "7",
        title: "Privacidad y Propiedad Intelectual",
        content: [],
        sub: [
            {
                label: "Protección de Datos",
                text: "Los Usuarios prestan su consentimiento expreso para que sus datos personales sean recolectados y tratados por SHIPPAR exclusivamente a los fines de la prestación del servicio, conforme a la Ley N° 25.326 de Protección de Datos Personales. El Usuario garantiza que los datos provistos son exactos.",
            },
            {
                label: "Propiedad Intelectual",
                text: "Los contenidos, logos, marcas, imágenes y nombres comerciales provistos en el Sitio son propiedad exclusiva de SHIPPAR. Queda estrictamente prohibida su copia, distribución o uso con fines comerciales sin autorización expresa.",
            },
        ],
    },
    {
        number: "8",
        title: "Legislación y Jurisdicción Aplicable",
        content: [
            "Los presentes Términos y Condiciones, así como sus modificaciones, se regirán e interpretarán de acuerdo con las leyes de la República Argentina. Cualquier controversia será sometida a la jurisdicción de los Tribunales competentes de la República Argentina, a la cual el Usuario se somete de forma irrevocable.",
        ],
        sub: [],
    },
];

export default function TerminosPage() {
    return (
        <section
            className="relative min-h-screen"
            style={{ background: "var(--bg-deep)", paddingTop: "7rem", paddingBottom: "5rem" }}
        >
            {/* Subtle glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div style={{
                    position: "absolute", width: 700, height: 700, top: "-15%", left: "50%", transform: "translateX(-50%)",
                    background: "radial-gradient(circle, rgba(43,192,255,0.03) 0%, transparent 60%)",
                    filter: "blur(80px)",
                }} />
            </div>

            <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <p
                        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
                        style={{ color: "#2BC0FF" }}
                    >
                        Documentación Legal
                    </p>
                    <h1
                        className="text-3xl md:text-4xl font-bold text-white mb-3"
                        style={{ letterSpacing: "-0.03em", lineHeight: 1.15 }}
                    >
                        Términos y Condiciones
                    </h1>
                    <p className="text-sm" style={{ color: "#6b7a99" }}>
                        Última actualización: Marzo 2026
                    </p>

                    {/* Divider */}
                    <div
                        className="mt-6"
                        style={{ height: 1, background: "linear-gradient(90deg, rgba(43,192,255,0.2) 0%, rgba(255,255,255,0.04) 100%)" }}
                    />
                </div>

                {/* Intro */}
                <div
                    className="rounded-xl p-5 mb-10"
                    style={{
                        background: "rgba(43,192,255,0.04)",
                        border: "1px solid rgba(43,192,255,0.1)",
                    }}
                >
                    <p className="text-[13px] leading-relaxed" style={{ color: "#94a3b8", lineHeight: 1.8 }}>
                        Al utilizar los servicios de <strong style={{ color: "white" }}>SHIPPAR GLOBAL LOGISTICS S.R.L</strong> (en adelante, &ldquo;SHIPPAR&rdquo;),
                        CUIT 30-71915946-6, el Usuario acepta quedar vinculado por los presentes Términos y Condiciones.
                        Estos rigen la relación entre SHIPPAR y sus usuarios en todo lo relativo a los servicios de logística internacional.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-10">
                    {SECTIONS.map((section) => (
                        <article key={section.number}>
                            {/* Section header */}
                            <div className="flex items-baseline gap-3 mb-4">
                                <span
                                    className="text-[11px] font-bold font-mono px-2 py-1 rounded"
                                    style={{
                                        background: "rgba(43,192,255,0.08)",
                                        color: "#2BC0FF",
                                        minWidth: 28,
                                        textAlign: "center",
                                    }}
                                >
                                    {section.number}
                                </span>
                                <h2
                                    className="text-lg font-bold text-white"
                                    style={{ letterSpacing: "-0.01em" }}
                                >
                                    {section.title}
                                </h2>
                            </div>

                            {/* Content paragraphs */}
                            {section.content.map((p, i) => (
                                <p
                                    key={i}
                                    className="text-[13px] leading-relaxed mb-4 ml-10"
                                    style={{ color: "#94a3b8", lineHeight: 1.85 }}
                                >
                                    {p}
                                </p>
                            ))}

                            {/* Sub-items */}
                            {section.sub.length > 0 && (
                                <div className="space-y-3 ml-10">
                                    {section.sub.map((item, i) => (
                                        <div
                                            key={i}
                                            className="rounded-lg p-4"
                                            style={{
                                                background: "rgba(255,255,255,0.015)",
                                                borderLeft: "2px solid rgba(43,192,255,0.15)",
                                            }}
                                        >
                                            <p className="text-[13px] font-semibold text-white mb-1">
                                                {item.label}
                                            </p>
                                            <p
                                                className="text-[13px] leading-relaxed"
                                                style={{ color: "#8b9dc3", lineHeight: 1.8 }}
                                            >
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </article>
                    ))}
                </div>

                {/* Bottom divider + company info */}
                <div
                    className="mt-14"
                    style={{ height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(43,192,255,0.15) 50%, rgba(255,255,255,0.04) 100%)" }}
                />
                <div className="mt-6 text-center">
                    <p className="text-[12px] font-semibold" style={{ color: "#6b7a99" }}>
                        SHIPPAR GLOBAL LOGISTICS S.R.L
                    </p>
                    <p className="text-[11px] font-mono mt-1" style={{ color: "#4a5a7a" }}>
                        CUIT: 30-71915946-6 · República Argentina
                    </p>
                </div>
            </div>
        </section>
    );
}
