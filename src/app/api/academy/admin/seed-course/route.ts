import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireAdmin } from "@/lib/academy/auth";
import { invalidateCache } from "@/lib/academy/analyticsCache";


// The existing hardcoded course data
const SEED_COURSE = {
    title: "Cómo Importar desde China en 2026",
    description: "Aprendé a importar por Courier Simplificado con herramientas reales y soporte de Shippar.",
    subtitle: "Régimen Courier Simplificado",
    emoji: "📦",
    level: "Principiante",
    is_free: true,
    published: true,
    order_index: 0,
};

const SEED_MODULES = [
    { title: "Introducción al Courier Simplificado", order_index: 0 },
    { title: "Elegir Productos Rentables", order_index: 1 },
    { title: "Costos e Impuestos", order_index: 2 },
    { title: "Recibí tu Mercadería", order_index: 3 },
];

const SEED_LESSONS: Record<number, any> = {
    0: {
        title: "¿Qué es el régimen courier?",
        youtube_url: "dQw4w9WgXcQ",
        duration: "3 min",
        xp_reward: 10,
        order_index: 0,
        notes: [
            "El régimen courier simplificado permite importar paquetes de hasta USD 3.000 por envío.",
            "No necesitás ser importador registrado ni tener despachante.",
            "Los impuestos se simplifican en un 50% sobre el valor + flete.",
            "Es la forma más fácil de empezar a importar pequeñas cantidades.",
            "Ideal para emprendedores que quieren testear productos antes de escalar.",
        ],
        guide: [
            { title: "1. Introducción", content: "La importación en Argentina no es compleja. Está mal explicada.\n\nDurante años se instaló la idea de que importar es burocrático, inaccesible y reservado para grandes empresas. Eso es parcialmente cierto… si elegís el camino incorrecto.\n\nImportar comercialmente no es \"traer cosas del exterior\". Es arbitrar mercados.\n\nComprar en un país donde el producto cuesta menos. Vender en otro donde el mismo producto tiene mayor valor. La diferencia es tu margen.\n\nEste curso no es para compras personales. Es para personas que quieren operar como empresa.\n\nSi querés importar para revender y construir un negocio, este es tu punto de partida.\n\nEn este módulo vas a entender:\n• Qué significa importar comercialmente de verdad.\n• Cuál es la diferencia real entre Régimen General y Courier.\n• Qué necesitás para empezar hoy.\n• Cuáles son las ventajas y los límites que nadie te explica.\n\nEntender las reglas evita errores caros." },
            { title: "2. Qué significa importar comercialmente", content: "Importar comercialmente no es ahorrar en una compra. Es diseñar una operación rentable.\n\nLa estructura correcta es esta:\n1. Detectar demanda real.\n2. Conseguir proveedor competitivo.\n3. Calcular costos totales antes de pagar.\n4. Elegir el régimen correcto.\n5. Vender con margen positivo.\n\nLo que diferencia a un improvisado de un empresario no es traer productos. Es entender el sistema antes de pagar.\n\nImportar sin estructura es apostar.\nImportar con estructura es escalar.\n\nY escalar es repetir operaciones rentables." },
            { title: "3. Los dos caminos legales para importar", content: "El problema no es la Aduana. El problema es no saber qué puerta usar.\n\nEn Argentina existen múltiples regímenes, pero estratégicamente podemos dividirlos en dos grandes caminos.\n\nA. RÉGIMEN GENERAL\nEs el modelo tradicional. Está pensado para contenedores marítimos, grandes volúmenes, empresas estructuradas y operaciones de escala.\n\nCaracterísticas:\n• Sin límite de monto.\n• Requiere despachante.\n• Puede exigir certificaciones técnicas.\n• Mayor carga administrativa.\n• Tiempos extensos (frecuentemente 60 a 90 días).\n\nB. RÉGIMEN COURIER SIMPLIFICADO\nEste es el sistema que cambia la dinámica.\n\nCaracterísticas clave:\n• Hasta 3000 USD por envío.\n• Procedimiento simplificado.\n• Sin despacho formal complejo.\n• Entrega estimada en 8 a 10 días.\n• Límite de 50 kg por caja.\n• Cajas ilimitadas." },
            { title: "4. Por qué el Courier es ideal para empezar", content: "La ventaja del Courier no es solo la simplificación. Es la velocidad.\n\nEn marítimo, tu capital puede quedar inmovilizado 60 días o más. En Courier, el ciclo puede ser de 8 a 10 días.\n\nVelocidad significa:\n• Validación inmediata.\n• Rotación de capital.\n• Adaptación al mercado.\n• Menor exposición al error.\n\nEl Courier no está diseñado para competir contra quien trae contenedores. Está diseñado para novedades, nichos específicos, repuestos técnicos, productos livianos y tendencias emergentes." },
            { title: "5. Requisitos reales para importar por Simplificado", content: "Para Régimen Simplificado necesitás:\n• CUIT o CUIL.\n• Clave Fiscal Nivel 3.\n\nNo necesitás:\n• Cuenta Comex.\n• Responsable Inscripto obligatorio.\n• Despachante propio.\n• Trámites complejos previos.\n\nSi tu objetivo es vender, necesitás estructura fiscal para facturar.\n\nImportar es la mitad del negocio. Facturar es la otra mitad." },
            { title: "6. Ventajas del Régimen Courier", content: "• Operaciones ágiles.\n• Procedimiento simplificado.\n• No requiere certificaciones complejas.\n• Permite dividir envíos.\n• Ideal para validar mercado.\n• Reduce riesgo inicial." },
            { title: "7. Límites y consideraciones importantes", content: "El Courier no es perfecto. Tiene límites:\n\n• El envío aéreo es más costoso que el marítimo.\n• Se paga por peso real o peso volumétrico (el que sea mayor).\n• Límite de 50 kg por caja.\n• Límite de 3000 USD por envío.\n\nConocer los límites te permite diseñar mejor la operación." },
            { title: "8. Mentalidad correcta para operar", content: "El error clásico del principiante:\n\"Si funciona, traigo 200 unidades.\"\n\nLa mentalidad profesional es:\n\"Primero valido. Después escalo.\"\n\nEl Courier te permite hacer eso con riesgo controlado.\n\nImportar no es emoción. Es cálculo.\n\nNo gana el que trae más. Gana el que rota mejor." },
            { title: "9. Cierre del módulo", content: "En este módulo entendiste:\n• Qué significa importar comercialmente.\n• Las diferencias entre Régimen General y Courier.\n• Por qué el Courier es una herramienta estratégica.\n• Qué necesitás realmente para empezar.\n• Cuáles son los límites operativos.\n\nEn el próximo módulo: El producto." },
        ],
        action_links: [
            { label: "Sitio de AFIP", url: "https://www.afip.gob.ar", emoji: "🏛️" },
            { label: "Simular Import", url: "https://shippar.com.ar", emoji: "📦" },
        ],
    },
    1: {
        title: "Cómo buscar proveedores en China",
        youtube_url: "dQw4w9WgXcQ",
        duration: "3 min",
        xp_reward: 10,
        order_index: 0,
        notes: [
            "Alibaba.com es la plataforma principal para encontrar proveedores mayoristas.",
            "Verificá que el proveedor tenga el sello 'Trade Assurance' para mayor seguridad.",
            "Pedí siempre una muestra antes de hacer un pedido grande.",
            "Compará al menos 3 proveedores antes de decidir.",
            "Negociá el precio, especialmente si comprás en cantidad.",
        ],
        guide: [
            { title: "1. Introducción", content: "La mayoría de los errores en importación no ocurren en la Aduana. Ocurren antes de pagar.\n\nEl régimen puede estar bien elegido. La logística puede estar resuelta. Pero si el producto es incorrecto, la operación nace muerta." },
            { title: "2. El error más común", content: "El principiante busca fundas básicas, cables genéricos, lo más vendido en MercadoLibre.\n\nEsos productos suelen ser commodities traídos por contenedor con márgenes comprimidos.\n\nSi competís contra alguien que trae 10.000 unidades por barco, vos no competís. Perdés." },
            { title: "3. Qué producto tiene sentido por Courier", content: "El Courier es estratégico para:\n• Novedades y tendencias no saturadas.\n• Nichos específicos.\n• Productos livianos.\n• Validación de mercado." },
            { title: "4. Qué NO importar", content: "• Réplicas o imitaciones.\n• Productos con intervención sanitaria compleja.\n• Equipamiento eléctrico regulado.\n• Productos saturados sin diferenciación.\n• Mercadería voluminosa de bajo margen." },
            { title: "5. Validar antes de escalar", content: "La primera importación no es para ganar dinero. Es para comprar información.\n\nValidar significa evaluar calidad real, confirmar packaging, medir tiempos, probar venta." },
            { title: "6. Cómo usar Alibaba", content: "Alibaba no es una tienda online. Es una plataforma B2B.\n\nPuntos clave:\n• Usar Trade Assurance.\n• Revisar antigüedad.\n• Evaluar velocidad de respuesta.\n• Pedir material real." },
            { title: "7. Comunicarte con el proveedor", content: "Mensaje estratégico básico:\n\"I have my own logistics agent in Argentina. Please provide EXW or FOB pricing.\"\n\nCuanto más profesional sea tu comunicación, más profesional será la respuesta." },
            { title: "8. Incoterms básicos", content: "EXW (Ex Works): El proveedor entrega en su fábrica.\nFOB (Free On Board): El proveedor se encarga hasta el punto de salida." },
            { title: "9. La estrategia de la primera muestra", content: "La primera compra idealmente debe ser pequeña. 2 a 10 unidades.\n\nSi podés vender antes de traer volumen grande, reducís riesgo." },
        ],
        action_links: [
            { label: "Alibaba.com", url: "https://www.alibaba.com", emoji: "🌐" },
            { label: "1688.com", url: "https://www.1688.com", emoji: "🇨🇳" },
        ],
    },
    2: {
        title: "Cálculo de impuestos y costos finales",
        youtube_url: "dQw4w9WgXcQ",
        duration: "2 min",
        xp_reward: 10,
        order_index: 0,
        notes: [
            "El impuesto courier es del 50% sobre el valor FOB + flete.",
            "Se aplica a envíos de hasta USD 3.000 por paquete.",
            "El costo de flete varía según peso dimensional o real (el que sea mayor).",
            "Tené en cuenta costos adicionales: handling, seguro, y delivery local.",
            "Usá la calculadora de Shippar para estimar tu costo total antes de comprar.",
        ],
        guide: [
            { title: "1. La parte incómoda", content: "En este punto es donde la mayoría se confunde. No porque sea imposible entenderlo, sino porque muchos lo simplifican demasiado." },
            { title: "2. Los impuestos no se calculan sobre el FOB", content: "La base imponible aduanera no es el FOB. Es el CIF.\n\nEjemplo:\nProducto FOB: 1.000 USD\nFlete: 300 USD\nCIF = 1.300 USD\n\nLos tributos se calculan sobre 1.300 USD." },
            { title: "3. Qué impuestos intervienen", content: "En Régimen Courier simplificado intervienen:\n• Derechos de importación.\n• Tasa de estadística.\n• IVA base." },
            { title: "4. Por qué muchos cálculos están mal", content: "Muchos cálculos que circulan toman el FOB, ignoran el flete dentro de la base imponible y no contemplan peso volumétrico." },
            { title: "5. Cómo calcular manualmente", content: "1. Determinar valor FOB.\n2. Sumar flete internacional.\n3. Sumar seguro.\n4. Obtener CIF.\n5. Aplicar derechos sobre CIF.\n6. Aplicar tasa de estadística sobre CIF.\n7. Calcular IVA." },
        ],
        action_links: [
            { label: "Calculadora Shippar", url: "https://shippar-app.vercel.app/cotizador", emoji: "🧮" },
        ],
    },
    3: {
        title: "Seguimiento y recepción",
        youtube_url: "dQw4w9WgXcQ",
        duration: "3 min",
        xp_reward: 10,
        order_index: 0,
        notes: [
            "Una vez despachado, podés trackear tu paquete con el código de seguimiento.",
            "El tiempo estimado de entrega por courier es de 7 a 15 días hábiles.",
            "El paquete pasa por aduana y se libera automáticamente en el régimen courier.",
            "Recibís el paquete en tu domicilio o retirás en depósito.",
            "Si hay algún problema aduanero, Shippar te acompaña en la gestión.",
        ],
        guide: [
            { title: "1. La logística no empieza cuando el avión despega", content: "Empieza cuando estructurás correctamente: producto, valor declarado, documentación, peso, régimen, incoterm." },
            { title: "2. El proceso paso a paso", content: "Paso 1 — El proveedor emite Commercial Invoice y Packing List.\nPaso 2 — Envío al depósito en China. Se verifica peso, dimensiones y coherencia." },
            { title: "3. Peso volumétrico con ejemplo", content: "Fórmula: Largo × Ancho × Alto (cm) ÷ 5000\n\nEjemplo: 60 × 40 × 40 = 96.000 ÷ 5000 = 19,2 kg volumétricos" },
            { title: "4. Consolidación y salida aérea", content: "Se asigna guía aérea individual, se consolida en vuelo bajo Régimen Courier Simplificado.\n\nLímites: Máximo 3000 USD por guía, máximo 50 kg por caja, cajas ilimitadas." },
            { title: "5. Arribo a Argentina", content: "La carga se presenta ante Aduana, se vincula con tu CUIT/CUIL, se aplica el Régimen Courier Simplificado." },
            { title: "6. Tiempos estimados", content: "Express: 5–10 días hábiles.\nEstándar: 10–20 días hábiles.\nEconómico: 20–35 días hábiles." },
        ],
        action_links: [
            { label: "Rastrear Envío", url: "https://shippar.com.ar", emoji: "📍" },
            { label: "WhatsApp Soporte", url: "https://wa.me/5491167696865", emoji: "💬" },
        ],
    },
};

// Quiz questions per module
const SEED_QUIZZES: Record<number, any[]> = {
    0: [
        { type: "choice", question: "¿Cuál es el límite en dólares por envío en el Régimen Courier Simplificado?", options: ["USD 1.000", "USD 3.000", "USD 5.000", "USD 10.000"], correct_index: 1, explanation: "El límite actual del Régimen Courier Simplificado es de USD 3.000 por envío individual.", xp: 5, order_index: 0 },
        { type: "truefalse", question: "Para importar por Régimen Courier necesitás ser Responsable Inscripto obligatoriamente.", correct_answer: "false", explanation: "Falso. Para importar por Courier solo necesitás CUIT o CUIL y Clave Fiscal Nivel 3.", xp: 5, order_index: 1 },
        { type: "order", question: "Ordená los pasos correctos para una operación de importación comercial:", correct_order: ["Detectar demanda real", "Conseguir proveedor competitivo", "Calcular costos totales", "Elegir el régimen correcto", "Vender con margen positivo"], explanation: "Este orden estratégico asegura que cada paso esté validado antes de comprometer capital.", xp: 10, order_index: 2 },
        { type: "fill", question: "¿Cuál es el límite de peso por caja en el Régimen Courier Simplificado?", correct_answer: "50", accepted_answers: ["50", "50 kg", "50kg"], explanation: "El límite es de 50 kg por caja.", xp: 5, order_index: 3 },
        { type: "calculation", question: "Calculá el impuesto courier que debés pagar por esta importación:", scenario: "Producto FOB: USD 1.000\nFlete internacional: USD 300\nSeguro: USD 0\n\nCIF = USD 1.300\nTasa courier simplificada: 50%\n\n¿Cuánto pagás de impuesto?", correct_answer: "650", tolerance: 1, unit: "USD", explanation: "CIF = FOB + Flete = 1.000 + 300 = 1.300 USD\nImpuesto 50% de CIF = 1.300 × 0,50 = 650 USD", xp: 15, order_index: 4 },
        { type: "scenario", question: "Caso práctico: Elegí la mejor estrategia", scenario: "Querés importar 500 unidades de un producto que cuesta USD 8 c/u (total: USD 4.000). Es liviano y compacto. Nunca importaste antes.", scenario_options: [{ text: "Traer las 500 unidades por Régimen General en un envío marítimo", feedback: "Incorrecto. Para alguien que nunca importó, comprometer USD 4.000+ sin validar el producto es alto riesgo.", correct: false }, { text: "Importar una muestra de 10 unidades por Courier, testear ventas y después escalar", feedback: "¡Correcto! Primero validás con riesgo controlado. Si las 10 unidades rotan bien, escalás.", correct: true }, { text: "Comprar directamente a un revendedor local", feedback: "Sin aprender el sistema, seguís dependiendo de intermediarios y pagando precios inflados.", correct: false }], xp: 15, order_index: 5 },
    ],
    1: [
        { type: "choice", question: "¿Cuál es la plataforma principal para encontrar proveedores mayoristas chinos?", options: ["Amazon", "Alibaba", "AliExpress", "Wish"], correct_index: 1, explanation: "Alibaba es la plataforma B2B líder para conectar con fábricas y proveedores mayoristas.", xp: 5, order_index: 0 },
        { type: "truefalse", question: "Es recomendable pedir siempre una muestra antes de realizar un pedido grande.", correct_answer: "true", explanation: "SIEMPRE hay que pedir muestra. Es una inversión que te ahorra problemas.", xp: 5, order_index: 1 },
        { type: "fill", question: "¿Cómo se llama el sello de Alibaba que protege tu pago frente a proveedores?", correct_answer: "Trade Assurance", accepted_answers: ["Trade Assurance", "trade assurance", "TradeAssurance"], explanation: "Trade Assurance es el sistema de protección de pago de Alibaba.", xp: 10, order_index: 2 },
        { type: "choice", question: "¿Cuántos proveedores deberías comparar como mínimo antes de decidir?", options: ["1", "2", "3", "5"], correct_index: 2, explanation: "Comparar al menos 3 proveedores te da una visión real del mercado.", xp: 5, order_index: 3 },
    ],
    2: [
        { type: "choice", question: "¿Sobre qué valor se calculan los impuestos de importación en Argentina?", options: ["Sobre el valor FOB", "Sobre el valor CIF (FOB + flete + seguro)", "Sobre el precio de venta en Argentina", "Depende del courier"], correct_index: 1, explanation: "Los impuestos se calculan sobre el valor CIF, no sobre el FOB solo.", xp: 5, order_index: 0 },
        { type: "calculation", question: "Calculá el peso volumétrico de esta caja:", scenario: "Dimensiones:\n• Largo: 60 cm\n• Ancho: 40 cm\n• Alto: 30 cm\n\nFórmula: (Largo × Ancho × Alto) ÷ 5000", correct_answer: "14.4", tolerance: 0.1, unit: "kg", explanation: "Peso volumétrico = (60 × 40 × 30) ÷ 5000 = 14,4 kg", xp: 15, order_index: 1 },
        { type: "truefalse", question: "El flete se cobra siempre por el peso real del paquete, sin importar su tamaño.", correct_answer: "false", explanation: "Falso. El flete se cobra por el mayor entre el peso real y el peso volumétrico.", xp: 5, order_index: 2 },
        { type: "scenario", question: "Caso práctico: ¿Dónde está el error?", scenario: "Un emprendedor calcula su margen así:\n\n• Precio FOB: USD 10\n• Precio de venta: USD 25\n• Conclusión: \"Tengo 150% de margen\"\n\nPero no contempla flete, impuestos ni costos logísticos.", scenario_options: [{ text: "Está bien, el margen se calcula sobre el FOB", feedback: "Incorrecto. Calcular margen solo sobre FOB es una ilusión.", correct: false }, { text: "El margen real se calcula sobre el costo Landed (FOB + flete + impuestos + logística)", feedback: "¡Exacto! El costo Landed es el único número que importa.", correct: true }, { text: "No importa, lo que cuenta es vender rápido", feedback: "Si vendés con margen negativo real, estás perdiendo dinero más rápido.", correct: false }], xp: 10, order_index: 3 },
    ],
    3: [
        { type: "order", question: "Ordená el proceso de envío courier de China a Argentina:", correct_order: ["El proveedor despacha al depósito del courier en China", "El courier consolida y envía por avión", "El paquete llega a Ezeiza y pasa por aduana", "Se aplica el régimen courier simplificado", "El courier paga los impuestos en tu nombre", "Se libera el paquete y se envía a tu domicilio"], explanation: "Este es el flujo completo. Toma entre 8 y 20 días hábiles.", xp: 10, order_index: 0 },
        { type: "choice", question: "¿Cuánto tarda un envío courier Express?", options: ["1 a 3 días hábiles", "5 a 10 días hábiles", "20 a 35 días hábiles", "60 a 90 días hábiles"], correct_index: 1, explanation: "Un envío Express tarda entre 5 y 10 días hábiles.", xp: 5, order_index: 1 },
        { type: "scenario", question: "Tu paquete quedó retenido en aduana. ¿Qué hacés?", scenario: "Importaste accesorios electrónicos. El tracking muestra \"Retenido en aduana — documentación pendiente\".", scenario_options: [{ text: "Contacto al courier (Shippar) para que gestione la liberación", feedback: "¡Correcto! Shippar gestiona la liberación aduanera por vos.", correct: true }, { text: "Voy personalmente a Ezeiza", feedback: "En servicio courier door-to-door no gestionás con Aduana directamente.", correct: false }, { text: "Espero sin hacer nada", feedback: "Las retenciones no se resuelven solas.", correct: false }], xp: 10, order_index: 2 },
        { type: "truefalse", question: "Durante el Año Nuevo Chino, los tiempos de entrega se mantienen iguales.", correct_answer: "false", explanation: "Falso. Las fábricas se detienen por 2-4 semanas.", xp: 5, order_index: 3 },
    ],
};

export async function POST(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    try {
        // 1. Create course
        const { data: course, error: courseErr } = await supabaseAdmin
            .from("courses")
            .insert(SEED_COURSE)
            .select()
            .single();
        if (courseErr) throw new Error(`Course: ${courseErr.message}`);

        const results: string[] = [`✅ Curso creado: ${course.id}`];

        // 2. Create modules
        for (let mi = 0; mi < SEED_MODULES.length; mi++) {
            const { data: mod, error: modErr } = await supabaseAdmin
                .from("modules")
                .insert({ ...SEED_MODULES[mi], course_id: course.id })
                .select()
                .single();
            if (modErr) throw new Error(`Module ${mi}: ${modErr.message}`);
            results.push(`✅ Módulo ${mi + 1}: ${mod.id}`);

            // 3. Create lesson for this module
            const lessonData = SEED_LESSONS[mi];
            if (lessonData) {
                const { data: lesson, error: lessonErr } = await supabaseAdmin
                    .from("lessons")
                    .insert({ ...lessonData, module_id: mod.id })
                    .select()
                    .single();
                if (lessonErr) throw new Error(`Lesson ${mi}: ${lessonErr.message}`);
                results.push(`  ✅ Lección: ${lesson.id}`);
            }

            // 4. Create quiz questions for this module
            const quizData = SEED_QUIZZES[mi] || [];
            for (const q of quizData) {
                // Map scenario options to the right field
                const insertData: any = {
                    module_id: mod.id,
                    type: q.type,
                    question: q.question,
                    explanation: q.explanation || "",
                    xp: q.xp || 10,
                    order_index: q.order_index || 0,
                };

                if (q.type === "choice") {
                    insertData.options = q.options;
                    insertData.correct_index = q.correct_index;
                } else if (q.type === "truefalse") {
                    insertData.correct_answer = q.correct_answer;
                } else if (q.type === "order") {
                    insertData.correct_order = q.correct_order;
                } else if (q.type === "fill") {
                    insertData.correct_answer = q.correct_answer;
                    insertData.accepted_answers = q.accepted_answers || [];
                } else if (q.type === "calculation") {
                    insertData.scenario = q.scenario;
                    insertData.correct_answer = String(q.correct_answer);
                    insertData.tolerance = q.tolerance;
                    insertData.unit = q.unit;
                } else if (q.type === "scenario") {
                    insertData.scenario = q.scenario;
                    insertData.scenario_options = q.scenario_options;
                }

                const { error: qErr } = await supabaseAdmin
                    .from("quiz_questions")
                    .insert(insertData);
                if (qErr) throw new Error(`Quiz Q (${q.type}): ${qErr.message}`);
                results.push(`    ✅ Pregunta: ${q.question.slice(0, 40)}...`);
            }
        }

        return NextResponse.json({ success: true, results, courseId: course.id });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
