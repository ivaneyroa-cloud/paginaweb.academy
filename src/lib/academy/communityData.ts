export interface SeedPost {
    id: string;
    author: string;
    avatar: string | null; // null = show initial letter, string = URL
    title: string;
    content: string;
    category: string;
    daysAgo: number;
    likes: number;
    reply: string;
}

// Avatar styles: null = initial letter circle, or illustrated avatar URLs
// Using DiceBear API for consistent illustrated avatars (gender-neutral)
const avatar = (seed: string) => `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=0a7ea4,1a1a2e,6c3baa&backgroundType=gradientLinear`;
const illustratedAvatar = (seed: string) => `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}&backgroundColor=0a7ea4,1a1a2e,6c3baa&backgroundType=gradientLinear`;

const NAMES = [
    "Lucía M.", "Tomás R.", "Valentina G.", "Matías P.", "Camila S.",
    "Santiago D.", "Florencia L.", "Nicolás B.", "Martina F.", "Facundo H.",
    "Julieta C.", "Agustín V.", "Sofía A.", "Lautaro E.", "Carolina T.",
    "Joaquín N.", "Milagros O.", "Bruno K.", "Rocío J.", "Federico W.",
    "Daniela Q.", "Ignacio Z.", "Paula I.", "Emiliano U.", "Andrea X.",
    "Cristian Y.", "Gabriela R.", "Marcos L.", "Natalia D.", "Diego F.",
    "Marina P.", "Alejandro S.", "Jimena C.", "Gonzalo B.", "Celeste V.",
    "Ramiro T.", "Vanesa M.", "Leandro G.", "Sol H.", "Ezequiel A.",
    "Pilar N.", "Maximiliano J.", "Candela K.", "Iván E.", "Lorena W.",
    "Sebastián Q.", "Aldana Z.", "Hernán I.", "Micaela U.", "Rodrigo X."
];

// Mix of: null (initial circle), illustrated, and initials-based
const AVATARS: (string | null)[] = [
    illustratedAvatar("lucia"),     // 0 Lucía
    null,                           // 1 Tomás — initial
    avatar("valentina"),            // 2 Valentina
    illustratedAvatar("matias"),    // 3 Matías
    null,                           // 4 Camila — initial
    illustratedAvatar("santi"),     // 5 Santiago
    avatar("flor"),                 // 6 Florencia
    null,                           // 7 Nicolás — initial
    illustratedAvatar("martina"),   // 8 Martina
    avatar("facu"),                 // 9 Facundo
    null,                           // 10 Julieta — initial
    illustratedAvatar("agus"),      // 11 Agustín
    avatar("sofi"),                 // 12 Sofía
    null,                           // 13 Lautaro — initial
    illustratedAvatar("caro"),      // 14 Carolina
    avatar("joaco"),                // 15 Joaquín
    null,                           // 16 Milagros — initial
    illustratedAvatar("bruno"),     // 17 Bruno
    avatar("rocio"),                // 18 Rocío
    null,                           // 19 Federico — initial
    illustratedAvatar("dani"),      // 20 Daniela
    avatar("nacho"),                // 21 Ignacio
    null,                           // 22 Paula — initial
    illustratedAvatar("emi"),       // 23 Emiliano
    avatar("andre"),                // 24 Andrea
    null,                           // 25 Cristian — initial
    illustratedAvatar("gabi"),      // 26 Gabriela
    avatar("marcos"),               // 27 Marcos
    null,                           // 28 Natalia — initial
    illustratedAvatar("diego"),     // 29 Diego
    avatar("marina"),               // 30 Marina
    null,                           // 31 Alejandro — initial
    illustratedAvatar("jimena"),    // 32 Jimena
    avatar("gonza"),                // 33 Gonzalo
    null,                           // 34 Celeste — initial
    illustratedAvatar("rami"),      // 35 Ramiro
    avatar("vane"),                 // 36 Vanesa
    null,                           // 37 Leandro — initial
    illustratedAvatar("sol"),       // 38 Sol
    avatar("eze"),                  // 39 Ezequiel
    null,                           // 40 Pilar — initial
    illustratedAvatar("maxi"),      // 41 Maximiliano
    avatar("cande"),                // 42 Candela
    illustratedAvatar("ivan"),      // 43 Iván
    null,                           // 44 Lorena — initial
    avatar("seba"),                 // 45 Sebastián
    illustratedAvatar("aldana"),    // 46 Aldana
    null,                           // 47 Hernán — initial
    avatar("mica"),                 // 48 Micaela
    illustratedAvatar("rodri"),     // 49 Rodrigo
];

export const SEED_POSTS: SeedPost[] = [
    { id: "s1", author: NAMES[0], avatar: AVATARS[0], title: "Qué es el régimen courier simplificado?", content: "Recién arranco y no entiendo bien la diferencia entre courier y formal. Hasta cuánto puedo importar por courier?", category: "consulta", daysAgo: 1, likes: 14, reply: "El régimen courier simplificado te permite importar hasta USD 3.000 por envío con menos trámites. Es ideal para emprendedores que recién arrancan. En el curso lo explicamos paso a paso." },
    { id: "s2", author: NAMES[1], avatar: AVATARS[1], title: "Cómo busco proveedores confiables en Alibaba?", content: "Quiero importar accesorios de celular pero hay miles de proveedores. Cómo sé cuál es confiable?", category: "alibaba", daysAgo: 1, likes: 22, reply: "Filtrá por proveedores con Trade Assurance, más de 3 años en la plataforma y buenos ratings. Siempre pedí muestras antes de hacer un pedido grande. El módulo 2 del curso cubre esto en detalle." },
    { id: "s3", author: NAMES[2], avatar: AVATARS[2], title: "Mi primer envío quedó en aduana, qué hago?", content: "Me llegó un aviso de que mi paquete tiene observación documental. Es mi primera importación y no sé cómo proceder.", category: "aduana", daysAgo: 2, likes: 18, reply: "Tranqui, es más común de lo que pensás. Generalmente piden factura comercial y descripción detallada del producto. Contactanos por WhatsApp y te orientamos con tu caso específico." },
    { id: "s4", author: NAMES[3], avatar: AVATARS[3], title: "Cómo calculo el costo total de importar?", content: "Encontré un producto a USD 2 en Alibaba. Cuánto me termina costando puesto en Argentina con todos los impuestos?", category: "costos", daysAgo: 2, likes: 25, reply: "Usá nuestra Calculadora Shippar para estimar el costo real. Tené en cuenta: precio FOB + flete + seguro = CIF. Sobre eso se calculan derechos e IVA. En el módulo 3 lo detallamos con ejemplos reales." },
    { id: "s5", author: NAMES[4], avatar: AVATARS[4], title: "Importé fundas de silicona: mi experiencia", content: "Traje 300 fundas desde Shenzhen. Las compré a USD 0.80 y las vendo a $4.500. El margen es muy bueno si elegís bien el modelo.", category: "experiencia", daysAgo: 3, likes: 31, reply: "Excelente caso! Las fundas son un producto ideal para courier: livianas, buen margen y alta demanda. Gracias por compartir tu experiencia." },
    { id: "s6", author: NAMES[5], avatar: AVATARS[5], title: "Puedo importar ropa desde China?", content: "Quiero traer remeras y buzos. Es viable por courier o necesito ir por formal?", category: "consulta", daysAgo: 3, likes: 12, reply: "Podés importar ropa por courier siempre que respetes el límite de USD 3.000 por envío. Tené en cuenta que textiles pueden tener inspección adicional. La clave es que la descripción sea bien detallada." },
    { id: "s7", author: NAMES[6], avatar: AVATARS[6], title: "Trade Assurance: realmente protege?", content: "Alguien tuvo que usar Trade Assurance? Alibaba realmente responde si hay problemas?", category: "alibaba", daysAgo: 4, likes: 19, reply: "Sí, Trade Assurance es la mejor herramienta de protección en Alibaba. Si el proveedor no cumple con lo acordado, podés abrir una disputa y Alibaba media. Siempre usalo." },
    { id: "s8", author: NAMES[7], avatar: AVATARS[7], title: "Qué pasa si declaro mal el valor?", content: "Un amigo me dijo que declare menos para pagar menos impuestos. Es cierto?", category: "aduana", daysAgo: 4, likes: 16, reply: "⚠️ Nunca subdeclares. Aduana tiene valores de referencia y si detectan inconsistencias, pueden retener tu mercadería, multarte o hasta inhabilitarte. Siempre declará el valor real." },
    { id: "s9", author: NAMES[8], avatar: AVATARS[8], title: "Cuánto tarda un envío por courier?", content: "Necesito saber tiempos. Cuántos días desde que el proveedor despacha hasta que lo tengo en mi casa?", category: "consulta", daysAgo: 5, likes: 11, reply: "Por courier aéreo generalmente tarda entre 7 y 15 días hábiles. Depende del origen, la aduana y el courier que uses. Con Shippar solemos estar en 10 días promedio." },
    { id: "s10", author: NAMES[9], avatar: AVATARS[9], title: "Peso volumétrico vs peso real: me cobraron de más", content: "Mi paquete pesaba 2 kg pero me cobraron como si fueran 5 kg. Qué pasó?", category: "costos", daysAgo: 5, likes: 20, reply: "El courier cobra por el peso mayor entre el real y el volumétrico (largo x ancho x alto / 5000). Si tu producto es voluminoso pero liviano, el volumétrico será mayor. Siempre calculalo antes de comprar." },
    { id: "s11", author: NAMES[10], avatar: AVATARS[10], title: "Importé auriculares bluetooth: números reales", content: "Compré 100 auriculares a USD 3.50 c/u. Con flete, impuestos y todo me salieron USD 6.20. Los vendo a $12.000. Buen negocio.", category: "experiencia", daysAgo: 6, likes: 28, reply: "Muy buen ejemplo de producto rentable: liviano, alto margen y demanda constante. Gracias por compartir los números reales!" },
    { id: "s12", author: NAMES[11], avatar: AVATARS[11], title: "Necesito CUIT importador?", content: "Soy monotributista. Puedo importar o necesito una SRL?", category: "consulta", daysAgo: 6, likes: 15, reply: "Para courier simplificado podés importar como persona física con CUIT. No necesitás SRL ni estar inscripto como importador/exportador. Eso sí, hay límites por envío y por año." },
    { id: "s13", author: NAMES[12], avatar: AVATARS[12], title: "Cómo negociar precios en Alibaba?", content: "Los proveedores me dan un precio pero siento que puedo conseguir mejor. Tips para negociar?", category: "alibaba", daysAgo: 7, likes: 17, reply: "Claves: 1) Pedí cotización a 3+ proveedores y comparalos. 2) Mencioná que sos comprador recurrente. 3) Negociá en cantidades. 4) Comunicarte como empresa da mejores precios. El módulo 2 cubre estrategias de negociación." },
    { id: "s14", author: NAMES[13], avatar: AVATARS[13], title: "Qué productos NO conviene importar por courier?", content: "Quiero entender qué limites tiene el courier para no meter la pata.", category: "consulta", daysAgo: 7, likes: 13, reply: "Evitá: productos que superen USD 3.000, mercadería que requiera certificaciones especiales (ANMAT, INTI), y artículos prohibidos. También productos muy pesados o voluminosos pierden margen por flete." },
    { id: "s15", author: NAMES[14], avatar: AVATARS[14], title: "Puedo importar para revender en MercadoLibre?", content: "Mi idea es importar y vender por ML. Hay algún problema legal?", category: "consulta", daysAgo: 8, likes: 21, reply: "Sí, podés. Muchos emprendedores importan por courier y revenden por ML. Lo importante es facturar correctamente y cumplir con las regulaciones. Es un modelo de negocio muy viable." },
    { id: "s16", author: NAMES[15], avatar: AVATARS[15], title: "Qué es FOB, CIF y EXW?", content: "En Alibaba veo estos términos y no entiendo la diferencia. Alguien me explica?", category: "costos", daysAgo: 8, likes: 14, reply: "FOB = precio puesto en el puerto de origen. CIF = precio + flete + seguro hasta destino. EXW = precio en fábrica (vos pagás todo). Para courier, generalmente trabajás con FOB y el courier se encarga del flete. Módulo 3 lo explica en detalle." },
    { id: "s17", author: NAMES[16], avatar: AVATARS[16], title: "Mi experiencia importando mate y bombillas", content: "Parece raro pero exporté mate a Europa y el retorno lo usé para importar bombillas de acero premium desde China. Margen del 150%.", category: "experiencia", daysAgo: 9, likes: 24, reply: "Creatividad pura! Usar el flujo comercial de ida y vuelta es una estrategia inteligente. Las bombillas de acero son ideales: livianas y muy buen margen." },
    { id: "s18", author: NAMES[17], avatar: AVATARS[17], title: "Cómo sé si un producto tiene certificación obligatoria?", content: "Quiero importar cargadores de celular pero me dijeron que necesitan certificación. Es cierto?", category: "aduana", daysAgo: 9, likes: 16, reply: "Sí, los cargadores y productos eléctricos requieren certificación de seguridad eléctrica. Antes de importar, verificá en el sitio del INTI si tu producto necesita homologación. Es mejor saberlo antes que en la aduana." },
    { id: "s19", author: NAMES[18], avatar: AVATARS[18], title: "Conviene pagar con tarjeta o transferencia bancaria?", content: "El proveedor me da opción de pagar con tarjeta por Alibaba o transferencia directa. Qué conviene?", category: "alibaba", daysAgo: 10, likes: 12, reply: "Para tu primera compra, SIEMPRE pagá por Alibaba con Trade Assurance. Transferencia directa (T/T) solo cuando ya tengas relación con el proveedor. La plataforma te protege en caso de problemas." },
    { id: "s20", author: NAMES[19], avatar: AVATARS[19], title: "Cuántas unidades mínimas puedo pedir?", content: "Quiero probar con pocas unidades. Hay un mínimo en Alibaba?", category: "alibaba", daysAgo: 10, likes: 18, reply: "Depende del proveedor, pero muchos aceptan MOQ (Minimum Order Quantity) de 10-50 unidades para muestras. Buscá proveedores que tengan 'Small Orders' habilitado. Siempre empezá con pocas para validar." },
    { id: "s21", author: NAMES[20], avatar: AVATARS[20], title: "Qué impuestos pago al importar por courier?", content: "Necesito entender bien la estructura impositiva para calcular mis costos.", category: "costos", daysAgo: 11, likes: 23, reply: "Por courier simplificado pagás: derecho de importación (50% sobre CIF para la mayoría de productos) + IVA (21%). La base es el valor CIF. Usá nuestra calculadora para simular tu caso." },
    { id: "s22", author: NAMES[21], avatar: AVATARS[21], title: "Traje relojes inteligentes: resultados", content: "100 smartwatches a USD 8, vendidos a $18.000 c/u. El margen después de impuestos y envío fue del 90%.", category: "experiencia", daysAgo: 11, likes: 33, reply: "Excelente producto para courier: compacto, liviano, alta demanda y buen margen. Los smartwatches genéricos siguen siendo muy buscados. Gran operación!" },
    { id: "s23", author: NAMES[22], avatar: AVATARS[22], title: "Cómo elijo el mejor courier?", content: "Hay varias empresas de courier. Cómo elijo la mejor para mi caso?", category: "consulta", daysAgo: 12, likes: 10, reply: "Comparalos por: precio por kg, tiempos de entrega, seguimiento online, y cobertura. Shippar ofrece todo eso + asesoramiento personalizado. Lo importante es que tengan experiencia en tu tipo de producto." },
    { id: "s24", author: NAMES[23], avatar: AVATARS[23], title: "Puedo importar suplementos deportivos?", content: "Quiero traer proteínas y creatina desde USA. Se puede por courier?", category: "aduana", daysAgo: 12, likes: 9, reply: "Los suplementos alimenticios requieren habilitación de ANMAT para ser comercializados en Argentina. Para uso personal hay un límite. Para reventa, necesitás cumplir con regulaciones sanitarias. Es un rubro complejo." },
    { id: "s25", author: NAMES[24], avatar: AVATARS[24], title: "Cómo pido muestras en Alibaba?", content: "Es mi primera vez. Cómo le pido al proveedor que me mande una muestra?", category: "alibaba", daysAgo: 13, likes: 15, reply: "Contactá al proveedor, pedí 1-3 unidades como muestra. La mayoría cobra el producto + envío express. Es una inversión pequeña que te ahorra errores grandes. Validá calidad antes de escalar." },
    { id: "s26", author: NAMES[25], avatar: AVATARS[25], title: "Se puede importar desde otros países que no sea China?", content: "El courier funciona desde USA, Europa o solo China?", category: "consulta", daysAgo: 13, likes: 11, reply: "El courier funciona desde cualquier origen. China es el más popular por precios, pero también se importa desde USA, Europa, Japón, Corea. El proceso es similar, cambian los tiempos y costos de flete." },
    { id: "s27", author: NAMES[26], avatar: AVATARS[26], title: "Me estafaron con un proveedor. Lecciones aprendidas.", content: "Pagué por fuera de Alibaba y el proveedor desapareció. Perdí USD 400. NUNCA paguen fuera de la plataforma.", category: "experiencia", daysAgo: 14, likes: 42, reply: "Gracias por compartir esta experiencia. Es la regla número 1: NUNCA pagues fuera de Alibaba. Trade Assurance es tu seguro. Si el proveedor insiste en pagar por fuera, es red flag." },
    { id: "s28", author: NAMES[27], avatar: AVATARS[27], title: "Qué es el despacho simplificado?", content: "Vi que hay un despacho simplificado para importaciones pequeñas. Es lo mismo que courier?", category: "consulta", daysAgo: 14, likes: 8, reply: "Son conceptos relacionados. El courier usa un despacho simplificado que agiliza el trámite aduanero para envíos de bajo valor. Es lo que hace que importar por courier sea más simple y rápido que el régimen formal." },
    { id: "s29", author: NAMES[28], avatar: AVATARS[28], title: "Cuánto puedo importar por año?", content: "Hay un límite anual para importar por courier simplificado?", category: "costos", daysAgo: 15, likes: 19, reply: "Sí, hay límites anuales que AFIP monitorea. El límite por envío es USD 3.000. Para el acumulado anual, depende de tu perfil fiscal. Si vas a importar con frecuencia, es recomendable consultar con un despachante." },
    { id: "s30", author: NAMES[29], avatar: AVATARS[29], title: "Tips para fotografiar productos importados para ML", content: "Comparto mis tips: fondo blanco, luz natural, múltiples ángulos, y siempre mostrá escala. Mis publicaciones con buenas fotos venden 3x más.", category: "experiencia", daysAgo: 15, likes: 26, reply: "Tips de oro. La presentación es el 50% de la venta online. También recomendamos hacer videos cortos del producto en uso. Muy buen aporte!" },
    { id: "s31", author: NAMES[30], avatar: AVATARS[30], title: "Cómo verifico si un proveedor es fábrica o trading?", content: "Quiero comprar directo a fábrica para mejor precio. Cómo distingo?", category: "alibaba", daysAgo: 16, likes: 14, reply: "En Alibaba fijate el badge 'Manufacturer' vs 'Trading Company'. También podés pedir video de la fábrica, certificados de producción, y comparar precios con otros proveedores. Las fábricas suelen tener MOQ más alto pero mejor precio." },
    { id: "s32", author: NAMES[31], avatar: AVATARS[31], title: "Necesito un despachante de aduana?", content: "Para courier simplificado, necesito contratar un despachante?", category: "aduana", daysAgo: 16, likes: 12, reply: "Para courier simplificado NO necesitás despachante. El courier se encarga del despacho. Solo necesitás despachante para importaciones formales (valores mayores o mercadería especial)." },
    { id: "s33", author: NAMES[32], avatar: AVATARS[32], title: "Importé organizadores de escritorio: caso real", content: "50 unidades a USD 4, las vendo a $8.000. Producto perfecto: liviano, no se rompe, y tiene demanda todo el año.", category: "experiencia", daysAgo: 17, likes: 20, reply: "Producto inteligente. Los organizadores de escritorio tienen demanda constante, no son estacionales y el margen es excelente. Buen ejemplo de producto courier." },
    { id: "s34", author: NAMES[33], avatar: AVATARS[33], title: "Cómo funciona el seguro de envío?", content: "Conviene contratar seguro? Qué cubre exactamente?", category: "costos", daysAgo: 17, likes: 10, reply: "El seguro cubre pérdida o daño durante el transporte. Generalmente cuesta entre 1-3% del valor declarado. Para envíos de alto valor, SIEMPRE contratá seguro. Para productos baratos, es opcional pero recomendable." },
    { id: "s35", author: NAMES[34], avatar: AVATARS[34], title: "Puedo importar electrónica sin homologar?", content: "Quiero traer gadgets electrónicos. Todos necesitan homologación?", category: "aduana", daysAgo: 18, likes: 13, reply: "No todos. Accesorios simples (fundas, cables, soportes) generalmente no. Productos con componentes eléctricos (cargadores, baterías, equipos) sí necesitan. Verificá en la web del ENACOM y del INTI según tu producto." },
    { id: "s36", author: NAMES[35], avatar: AVATARS[35], title: "Cuál es el mejor momento para importar?", content: "Hay épocas del año mejores que otras para comprar en China?", category: "consulta", daysAgo: 18, likes: 16, reply: "Evitá el Año Nuevo Chino (enero-febrero) porque las fábricas cierran 2-4 semanas. El mejor momento para comprar es marzo-mayo y agosto-octubre. Para vender en fiestas, comprá con 2 meses de anticipación." },
    { id: "s37", author: NAMES[36], avatar: AVATARS[36], title: "Qué hago si el producto llega defectuoso?", content: "Llegaron 20 de 100 unidades con fallas. Puedo reclamar?", category: "alibaba", daysAgo: 19, likes: 21, reply: "Si pagaste con Trade Assurance, abrí una disputa en Alibaba con fotos y videos del defecto. Generalmente te reembolsan o envían reposición. Por eso es clave usar la plataforma para pagar." },
    { id: "s38", author: NAMES[37], avatar: AVATARS[37], title: "Cómo calculo el margen real de ganancia?", content: "Quiero saber exactamente cuánto gano. Qué costos tengo que incluir?", category: "costos", daysAgo: 19, likes: 24, reply: "Precio CIF + impuestos + flete local + comisión de ML (si vendés ahí) + packaging + tu tiempo. Usá nuestra calculadora para el costo de importación y después sumale tus costos de venta. El módulo 3 tiene ejemplos prácticos." },
    { id: "s39", author: NAMES[38], avatar: AVATARS[38], title: "Puedo importar repuestos de auto?", content: "Tengo un taller y quiero importar repuestos directamente. Es posible?", category: "consulta", daysAgo: 20, likes: 11, reply: "Sí, es posible. Los repuestos automotores se importan muy bien por courier si son piezas pequeñas. Para piezas grandes o en cantidad, puede convenir régimen formal. Muchos talleres en Argentina ya importan directo." },
    { id: "s40", author: NAMES[39], avatar: AVATARS[39], title: "Importé luces LED: mi experiencia completa", content: "Tiras LED, spots y paneles. 200 unidades, inversión total USD 1.800. Vendí todo en 3 semanas por ML. Margen neto: 85%.", category: "experiencia", daysAgo: 20, likes: 35, reply: "Las luces LED son un clásico del courier: livianas, alta demanda, buen margen. Excelente operación y gracias por compartir los números." },
    { id: "s41", author: NAMES[40], avatar: AVATARS[40], title: "Cómo me protejo de cambios en el dólar?", content: "Entre que compro y que vendo pueden pasar semanas. Cómo manejan el riesgo cambiario?", category: "costos", daysAgo: 21, likes: 17, reply: "Tips: 1) Comprá cuando tengas certeza de venta. 2) Fijá tus precios en pesos con margen que absorba fluctuación. 3) Importá productos de rotación rápida. 4) Tené siempre un colchón del 10-15% en tu cálculo." },
    { id: "s42", author: NAMES[41], avatar: AVATARS[41], title: "Alibaba o AliExpress para importar?", content: "Cuál es la diferencia? Cuándo uso cada uno?", category: "alibaba", daysAgo: 21, likes: 15, reply: "AliExpress = compras unitarias, precios retail. Alibaba = compras al por mayor, precios de fábrica. Si vas a revender, siempre Alibaba. AliExpress es para uso personal o para probar un producto antes de comprar en cantidad." },
    { id: "s43", author: NAMES[42], avatar: AVATARS[42], title: "Cómo describo bien mi producto para aduana?", content: "Vi que muchos tienen problemas por mala descripción. Qué tengo que incluir?", category: "aduana", daysAgo: 22, likes: 13, reply: "Incluí: nombre específico del producto, material, uso, marca si tiene, cantidad, valor unitario y total. Evitá descripciones genéricas como 'accesorios' o 'electronics'. Cuanto más detallado, menos chances de retención." },
    { id: "s44", author: NAMES[43], avatar: AVATARS[43], title: "Primer importación exitosa gracias al curso", content: "Hice el curso completo, usé la calculadora, y traje 50 power banks. Todo salió perfecto. Gracias Shippar!", category: "experiencia", daysAgo: 22, likes: 38, reply: "Nos encanta leer esto! Es exactamente para esto que creamos Shippar Academy. Que el conocimiento se transforme en acción. Felicitaciones por tu primera importación!" },
    { id: "s45", author: NAMES[44], avatar: AVATARS[44], title: "El IVA de importación se puede descontar?", content: "Si soy responsable inscripto, puedo tomar el crédito fiscal del IVA que pago en la importación?", category: "costos", daysAgo: 23, likes: 14, reply: "Sí, si sos Responsable Inscripto podés tomar el crédito fiscal del IVA pagado en la importación. Guardá todos los comprobantes. Consultá con tu contador para hacer el trámite correctamente." },
    { id: "s46", author: NAMES[45], avatar: AVATARS[45], title: "Cómo uso la Calculadora Shippar?", content: "Vi que hay una calculadora pero no entiendo bien todos los campos. Alguien la usó?", category: "consulta", daysAgo: 23, likes: 9, reply: "Es muy simple: ingresás el valor FOB del producto, el peso y las dimensiones. La calculadora te estima el costo total puesto en Argentina incluyendo flete, impuestos y gastos de courier. Probala en shippar-app.vercel.app/cotizador" },
    { id: "s47", author: NAMES[46], avatar: AVATARS[46], title: "Importé herramientas de mano: experiencia", content: "Set de destornilladores profesionales, pinzas y llaves. 30 sets a USD 12. Los vendo a $22.000 el set en ML. Van como pan caliente.", category: "experiencia", daysAgo: 24, likes: 22, reply: "Herramientas de mano son un nicho excelente: no necesitan certificación, son duraderas para el envío y los márgenes son muy buenos. Gran elección!" },
    { id: "s48", author: NAMES[47], avatar: AVATARS[47], title: "Qué pasa si el paquete se pierde?", content: "Quién se hace cargo si mi envío se pierde en tránsito?", category: "consulta", daysAgo: 24, likes: 12, reply: "Si contrataste seguro, la aseguradora cubre hasta el valor declarado. Si no tenés seguro, depende del courier (algunos tienen cobertura básica). Con Shippar todos los envíos tienen seguimiento y cobertura. Siempre contratá seguro para envíos de valor." },
    { id: "s49", author: NAMES[48], avatar: AVATARS[48], title: "Puedo importar con tarjeta de crédito?", content: "No tengo dólares. Puedo pagar la importación con tarjeta?", category: "costos", daysAgo: 25, likes: 16, reply: "Sí, en Alibaba podés pagar con tarjeta de crédito o débito. El cargo se hace en dólares y tu banco lo convierte. Tené en cuenta que puede haber impuesto PAIS y percepciones según tu situación fiscal." },
    { id: "s50", author: NAMES[49], avatar: AVATARS[49], title: "Cómo empiezo? Estoy perdido", content: "Recién me registré y quiero importar pero no sé por dónde arrancar. Me dan un paso a paso?", category: "consulta", daysAgo: 25, likes: 27, reply: "Bienvenido! El paso a paso es: 1) Completá el curso. 2) Elegí un producto con la guía del módulo 2. 3) Cotizá con la calculadora. 4) Pedí muestras. 5) Importá tu primer lote. Si tenés dudas, escribinos por WhatsApp." }
];
