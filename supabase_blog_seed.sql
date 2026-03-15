-- ═══════════════════════════════════════════════
-- Seed: 3 initial blog posts for Shippar
-- Run AFTER creating the blog_posts table
-- ═══════════════════════════════════════════════

INSERT INTO blog_posts (slug, title, meta_title, meta_description, excerpt, content, tags, read_time, icon, published)
VALUES

-- ────────────────────────────
-- BLOG 1: Cómo importar
-- ────────────────────────────
(
  'como-importar-argentina',
  'Cómo importar productos a Argentina: guía completa 2026',
  'Cómo Importar Productos a Argentina en 2026: Guía Paso a Paso | Shippar',
  'Aprende cómo importar productos a Argentina desde China, USA y Europa. Modalidades, costos, impuestos, tiempos y requisitos explicados con datos reales.',
  'Todo lo que necesitás saber para importar: modalidades, costos, impuestos, tiempos, requisitos y los errores que cometen (casi) todos los que arrancan.',
  '<p>Si estás pensando en importar y no sabés por dónde arrancar, esta guía es para vos.</p>
<p>No importa si sos emprendedor, monotributista o si ya tenés una empresa — importar productos es una forma concreta de mejorar tus márgenes, conseguir productos que en Argentina no se fabrican, o directamente montar un negocio. Lo que necesitás es información clara para arrancar sin meter la pata.</p>

<h2>¿Se puede importar sin ser importador registrado?</h2>
<p>Sí. Y esto es lo primero que sorprende a mucha gente.</p>
<p>Si importás <strong>vía courier internacional</strong>, no necesitás tener CUIT habilitado como importador ni estar inscripto en ningún registro. Esto significa que un monotributista, un emprendedor que vende por redes sociales, o cualquier persona puede recibir mercadería del exterior sin trámites previos.</p>
<p>Si tu operación va por <strong>marítimo o carga aérea general</strong>, ahí sí necesitás CUIT importador, ser responsable inscripto en IVA y contratar un despachante de aduanas.</p>
<p>La conclusión es simple: <strong>si estás arrancando, el courier es tu puerta de entrada al mundo de la importación</strong>. Sin burocracia, sin habilitaciones, sin despachante.</p>

<h2>Modalidades de importación: ¿cuál es la tuya?</h2>

<h3>Courier internacional</h3>
<p>Es la modalidad más popular para emprendedores e importadores que arrancan. El envío se gestiona puerta a puerta — Shippar recoge la mercadería en origen y la entrega en tu domicilio en Argentina.</p>
<p><strong>Lo que tenés que saber:</strong></p>
<ul>
<li><strong>Peso máximo:</strong> 50 kg por caja. Recomendamos 20-25 kg — las cajas más chicas se deforman menos y los operarios las manipulan mejor.</li>
<li><strong>Cantidad de cajas:</strong> Infinitas. Podés enviar 1 o 300, siempre que el FOB total no pase de USD 3.000.</li>
<li><strong>CUIT importador:</strong> No se necesita.</li>
<li><strong>Impuestos:</strong> Pagás ~30% menos que en una importación formal. No se cobran IVA adicional (21%), percepción de ganancias (6%) ni IIBB (3,5%).</li>
<li><strong>Entrega en domicilio:</strong> Incluida.</li>
<li><strong>Depósito fiscal:</strong> No aplica.</li>
</ul>
<p><strong>¿Para quién es?</strong> Para el emprendedor que quiere testear un producto, el monotributista que no puede ir por marítimo, el vendedor de repuestos que necesita stock rápido, o cualquier operación donde velocidad y simplicidad sean prioridad.</p>

<h3>Carga marítima</h3>
<p>Es la modalidad para escalar. Se envía por barco en contenedores completos (FCL) o en carga consolidada con otros importadores (LCL).</p>
<p>El marítimo es más económico que el aéreo porque <strong>se cobra por CBM</strong> (metro cúbico — espacio ocupado), no por kilo. El valor base ronda los USD 30 por CBM, con un máximo de 1.000 kg por CBM. Se aplica la regla W/M: la naviera cobra por lo que sea mayor — 1 CBM o 1 tonelada.</p>
<p>Pero ojo: el flete es solo una parte del costo. El marítimo tiene costos adicionales importantes: despachante de aduanas (~USD 600 mínimo), depósito fiscal (USD 900-1.000), gastos SIM, desconsolidación y flete desde el depósito fiscal hasta tu domicilio. Un envío chico de 1 CBM puede terminar costando <strong>más de USD 1.500</strong> todo incluido.</p>
<p>Tiempo estimado: <strong>2 a 3 meses</strong> de punta a punta.</p>
<p><strong>Dato clave:</strong> Si sos monotributista, <strong>no podés importar vía marítima</strong>. Necesitás ser responsable inscripto.</p>

<h3>Carga aérea general</h3>
<p>Es el punto medio. Se usa cuando el envío supera los límites del courier pero no querés esperar 3 meses por un barco. Shippar brinda el transporte internacional; el despacho queda por cuenta del cliente.</p>

<h2>¿Qué productos se pueden importar?</h2>
<p>La mayoría se pueden importar sin problemas: electrónica, textiles, accesorios, insumos industriales, repuestos, herramientas, artículos para el hogar, juguetes (sin pilas), y mucho más.</p>
<p>Pero hay excepciones que tenés que conocer <strong>antes de comprar</strong>.</p>

<h3>Productos que NO se pueden importar</h3>
<ul>
<li><strong>Productos con marca registrada</strong> (Nike, Apple, Samsung): No entran por courier ni marítimo, salvo representante oficial con autorización documentada.</li>
<li><strong>Líquidos:</strong> Prohibidos en courier.</li>
<li><strong>Maquillajes y cosméticos:</strong> Requieren habilitación de ANMAT.</li>
<li><strong>Productos prohibidos:</strong> Armas, sustancias controladas, material peligroso.</li>
</ul>

<h3>Productos con intervención de terceros organismos</h3>
<p>Algunos productos necesitan autorización de organismos como <strong>ANMAT</strong> (productos médicos, alimentos), <strong>INTI</strong> (productos industriales), o la <strong>Secretaría de Energía y Secretaría de Comercio</strong> (artefactos eléctricos que se conectan a la red).</p>
<p>Shippar puede transportar estos productos, pero <strong>no gestiona las certificaciones</strong> — eso lo resuelve el cliente. Sí asesoramos sobre qué productos suelen requerir intervención.</p>
<blockquote><p><strong>Dato útil:</strong> Vía courier, podés importar productos que requieren certificación de seguridad eléctrica sin tenerla habilitada al momento del envío. Pero para la venta posterior en Argentina, sí la necesitás.</p></blockquote>

<h2>¿Cuánto cuesta importar un producto?</h2>
<p>El costo de importar no es solo lo que le pagás al proveedor. Hay varias capas de costos que se suman.</p>

<h3>Los componentes del costo</h3>
<ol>
<li><strong>Valor FOB</strong> (Free On Board): El costo del producto puesto en origen.</li>
<li><strong>Flete internacional + seguro:</strong> El transporte. Depende del peso facturable, origen y servicio.</li>
<li><strong>Valor CIF</strong> (Cost, Insurance and Freight): FOB + Flete + Seguro.</li>
<li><strong>Derechos de importación</strong> (arancel): Entre 0% y 35% según posición arancelaria. Se calcula sobre el CIF.</li>
<li><strong>Base imponible:</strong> CIF + Derechos de importación. <strong>Esta es la base para el resto de los impuestos</strong>.</li>
<li><strong>Impuestos:</strong> Tasa estadística (3%), IVA aduanero (21%), y en importaciones formales: IVA adicional (21%), percepciones ganancias (6%), IIBB (3,5%).</li>
</ol>
<p>Para calcular todo esto con tus datos reales → <a href="/cotizadorv2">cotizador de importación de Shippar</a>.</p>

<h3>Peso real vs. peso volumétrico</h3>
<p>El flete aéreo no se calcula solo por cuánto pesa tu caja. Se calcula por el <strong>peso facturable</strong>, que es el mayor entre el peso real y el peso volumétrico.</p>
<p><strong>La fórmula es:</strong> (Largo cm × Ancho cm × Alto cm) ÷ 5.000 = Peso volumétrico en kg</p>
<div class="blog-info-box">
<strong>Ejemplo práctico</strong>
<p>Una caja de 60×40×40 cm que pesa 15 kg reales: Peso volumétrico = (60 × 40 × 40) ÷ 5.000 = <strong>19,2 kg</strong>. Se cobra por 19,2 kg porque es mayor que el peso real.</p>
</div>
<p><strong>Consejo:</strong> Armá las cajas lo más compactas posible. Reducir 5 cm de alto puede ahorrarte plata real en el flete.</p>

<h2>¿Cuánto tarda una importación?</h2>

<h3>Courier</h3>
<table>
<thead><tr><th>Origen</th><th>Tiempo estimado</th></tr></thead>
<tbody>
<tr><td>🇨🇳 China → Argentina</td><td>5 a 10 días hábiles</td></tr>
<tr><td>🇺🇸 Estados Unidos → Argentina</td><td>5 a 7 días hábiles</td></tr>
<tr><td>🇪🇸 España → Argentina</td><td>6 días hábiles</td></tr>
<tr><td>🇵🇰 Pakistán → Argentina</td><td>9 días hábiles</td></tr>
</tbody>
</table>
<p>Estos tiempos pueden variar si la carga pasa por <strong>canal rojo</strong> en aduana (inspección física).</p>

<h3>Marítimo</h3>
<p>Tránsito puro: ~45 días. Pero planificá con <strong>2 a 3 meses</strong> de punta a punta.</p>

<h2>Paso a paso: cómo importar con Shippar</h2>
<ol>
<li><strong>Elegí tu producto y proveedor.</strong> Investigá precios, calidad y cantidades mínimas.</li>
<li><strong>Cotizá el costo total.</strong> Usá el <a href="/cotizadorv2">cotizador de importación</a> para estimar flete, impuestos y costo total.</li>
<li><strong>Evaluá si es rentable.</strong> Pasá por la <a href="/calculadora">calculadora de rentabilidad</a> para saber si margen y ROI cierran.</li>
<li><strong>Coordiná el envío.</strong> Una vez que decidiste, coordinamos recolección en origen y transporte.</li>
<li><strong>Seguí tu carga.</strong> Rastreá el estado en tiempo real.</li>
<li><strong>Recibí en tu puerta y vendé.</strong></li>
</ol>

<h2>Errores comunes al importar por primera vez</h2>
<ul>
<li><strong>Comprar sin cotizar.</strong> Muchos compran sin calcular el costo real. Cuando suman todo, el negocio no cierra.</li>
<li><strong>Ignorar el peso volumétrico.</strong> Productos livianos pero grandes pueden salir mucho más caros de flete.</li>
<li><strong>Importar con marca.</strong> La aduana retiene mercadería con marcas registradas.</li>
<li><strong>No verificar certificaciones.</strong> Productos que necesitan ANMAT, INTI o seguridad eléctrica pueden quedar retenidos.</li>
<li><strong>Subestimar tiempos en marítimo.</strong> 45 días de tránsito no son 45 días de punta a punta.</li>
<li><strong>Olvidar impuestos recuperables.</strong> Son recuperables, pero hay que poder bancar el desembolso inicial.</li>
</ul>

<h2>¿Es rentable importar?</h2>
<p>Depende de tu producto, tu canal de venta y cuán bien hagas los números.</p>
<p>En <strong>Mercado Libre</strong>, un margen neto del <strong>20-25%</strong> suele ser un piso razonable. Con <strong>web propia</strong> (Tienda Nube, por ejemplo), los márgenes pueden ser más altos pero tenés que invertir en adquisición de clientes.</p>
<p>Lo más importante: <strong>calculá antes de comprar</strong>. Usá la <a href="/calculadora">calculadora de rentabilidad de Shippar</a> para saber si el negocio cierra con tus datos reales.</p>

<h2>Preguntas frecuentes</h2>
<details>
<summary>¿Necesito CUIT importador para traer productos del exterior?</summary>
<div>Para courier, no. Cualquier persona o monotributista puede importar sin habilitación. Para marítimo, sí necesitás CUIT habilitado.</div>
</details>
<details>
<summary>¿Cuánto cuesta importar un producto de USD 100 FOB?</summary>
<div>Depende del peso, dimensiones y categoría. El <a href="/cotizadorv2">cotizador de importación</a> te da el desglose completo en 2 minutos.</div>
</details>
<details>
<summary>¿Puedo importar productos con marca como Nike o Apple?</summary>
<div>No. Están prohibidos vía courier y marítimo, salvo que seas representante oficial con autorización documentada.</div>
</details>
<details>
<summary>¿Qué pasa si mi envío cae en canal rojo?</summary>
<div>Significa inspección física en aduana. Puede agregar días pero no es un problema — es una verificación de rutina.</div>
</details>
<details>
<summary>¿Cuánto tarda un envío desde China por courier?</summary>
<div>Entre 5 y 10 días hábiles. Por marítimo, 2 a 3 meses de punta a punta.</div>
</details>',
  ARRAY['Guía', 'Principiantes'],
  '12 min',
  'truck',
  true
),

-- ────────────────────────────
-- BLOG 2: Courier vs Marítimo
-- ────────────────────────────
(
  'courier-vs-maritimo',
  'Courier vs. Carga Marítima: cuándo conviene cada modalidad',
  'Courier vs. Carga Marítima: Cuándo Conviene Cada Modalidad | Shippar',
  '¿Importar por courier o por marítimo? Comparamos tiempos, costos reales, impuestos, requisitos y riesgos para que elijas la modalidad correcta.',
  'Comparamos tiempos, costos reales, impuestos, requisitos y riesgos de cada modalidad. Con datos concretos para que elijas bien.',
  '<p>Elegir entre courier y marítimo no es una decisión menor. Cada modalidad tiene ventajas concretas — y costos ocultos que cambian completamente la ecuación si no los tenés en cuenta.</p>
<p>En esta guía comparamos las dos opciones con números reales para que puedas decidir cuál te conviene según tu producto, tu volumen y tu situación fiscal.</p>

<h2>Qué es el courier internacional</h2>
<p>El courier es un servicio de envío puerta a puerta. Shippar recoge la mercadería en origen, la transporta por avión, pasa por aduana con despacho simplificado y te la entrega en tu domicilio.</p>
<p>Es la forma más directa de importar — y la más accesible si estás arrancando.</p>
<ul>
<li><strong>Peso máximo:</strong> 50 kg por caja. Recomendamos 20-25 kg.</li>
<li><strong>Cantidad de cajas:</strong> Sin límite (FOB total hasta USD 3.000).</li>
<li><strong>CUIT importador:</strong> No se necesita.</li>
<li><strong>Despacho aduanero:</strong> Incluido.</li>
<li><strong>Depósito fiscal:</strong> No aplica. La carga va directo a tu domicilio.</li>
<li><strong>Tiempos:</strong> China 5-10 días, USA 5-7, España 6, Pakistán 9.</li>
</ul>

<h2>Qué es la carga marítima</h2>
<p>La carga marítima es para operaciones de volumen. Se envía por barco en contenedores completos (FCL) o en carga consolidada (LCL).</p>

<h3>Cómo se cobra el flete marítimo</h3>
<p>A diferencia del courier (que se cobra por <strong>kilo</strong>), el marítimo se cobra por <strong>CBM</strong> — metro cúbico, es decir, espacio ocupado.</p>
<p>El valor base ronda los <strong>USD 30 por CBM</strong>, con un máximo de 1.000 kg por metro cúbico. Se aplica la regla <strong>W/M</strong> (Weight or Measurement): la naviera cobra por lo que sea mayor — 1 CBM o 1 tonelada.</p>

<h3>Los costos que nadie te cuenta del marítimo</h3>
<p>El flete barato viene con una lista de costos fijos que aplican en cada operación:</p>
<table>
<thead><tr><th>Concepto</th><th>Costo aproximado</th></tr></thead>
<tbody>
<tr><td>Flete internacional (base)</td><td>~USD 30/CBM</td></tr>
<tr><td>Despachante de aduanas</td><td>Mínimo ~USD 600</td></tr>
<tr><td>Depósito fiscal</td><td>USD 900 a 1.000</td></tr>
<tr><td>Gastos SIM (declaración aduanera)</td><td>Variable</td></tr>
<tr><td>Desconsolidación</td><td>Variable</td></tr>
<tr><td>Flete desde depósito a domicilio</td><td>Variable</td></tr>
</tbody>
</table>
<blockquote><p>Un envío chico de 1 CBM puede terminar costando <strong>más de USD 1.500</strong> entre todos estos conceptos. Y eso es sin contar los impuestos de importación.</p></blockquote>
<p>Requisitos: CUIT importador obligatorio, responsable inscripto en IVA, despachante de aduanas. <strong>Monotributistas no pueden importar vía marítima.</strong></p>
<p>Tiempos: tránsito ~45 días, pero de punta a punta planificá <strong>2 a 3 meses</strong>.</p>

<h2>Comparativa directa</h2>
<table>
<thead><tr><th>Aspecto</th><th>Courier</th><th>Carga marítima</th></tr></thead>
<tbody>
<tr><td>Tiempo de entrega</td><td>5 a 10 días hábiles</td><td>2 a 3 meses</td></tr>
<tr><td>Se cobra por</td><td>Peso (kg)</td><td>Espacio (CBM) o peso (W/M)</td></tr>
<tr><td>FOB máximo por envío</td><td>USD 3.000</td><td>Sin límite</td></tr>
<tr><td>CUIT importador</td><td>No necesita</td><td>Obligatorio</td></tr>
<tr><td>Monotributista</td><td>✅ Puede importar</td><td>❌ No puede</td></tr>
<tr><td>Despacho aduanero</td><td>Incluido</td><td>~USD 600+</td></tr>
<tr><td>Depósito fiscal</td><td>No aplica</td><td>~USD 900-1.000</td></tr>
<tr><td>Entrega a domicilio</td><td>Incluida</td><td>Costo adicional</td></tr>
<tr><td>Carga impositiva</td><td>~30% menos impuestos</td><td>Todos los impuestos</td></tr>
<tr><td>Riesgo financiero</td><td>Bajo (montos acotados)</td><td>Alto (miles de dólares)</td></tr>
</tbody>
</table>

<h2>La ventaja fiscal del courier</h2>
<p>Esta es una de las diferencias más importantes y menos conocidas.</p>
<p>Cuando importás por courier, pagás <strong>aproximadamente un 30% menos de impuestos</strong>. No se cobran:</p>
<ul>
<li><strong>IVA adicional:</strong> 21%</li>
<li><strong>Percepción de ganancias:</strong> 6%</li>
<li><strong>Ingresos brutos:</strong> 3,5%</li>
</ul>
<p>En una importación marítima, estos impuestos se pagan al despachar. Son <strong>recuperables</strong> como crédito fiscal — pero representan un desembolso financiero inicial enorme que tenés que poder bancar.</p>
<p>En courier, ese desembolso directamente no existe.</p>

<h2>Cuándo conviene courier</h2>

<h3>Para emprendedores que arrancan</h3>
<p>No necesitás CUIT importador, no necesitás despachante, no pagás depósito fiscal, la entrega llega a tu puerta y los montos son acotados. Si algo sale mal, el impacto es controlable.</p>

<h3>Para monotributistas</h3>
<p>Si sos monotributista, el courier es tu única opción para importar. No podés hacer importaciones marítimas. La buena noticia: <strong>con una tarifa competitiva por kilo, si tu producto es liviano, el costo queda muy bien</strong>.</p>

<h3>Para repuestos de todo tipo</h3>
<p>Los repuestos son uno de los productos estrella del courier — automotores, electrónicos, industriales, médicos:</p>
<ul>
<li><strong>Llegan rápido:</strong> 5-10 días desde China.</li>
<li><strong>Son livianos:</strong> El costo por kilo queda bajo.</li>
<li><strong>Menos carga fiscal:</strong> ~30% menos impuestos.</li>
<li><strong>Sin CUIT importador:</strong> Operás como monotributista.</li>
<li><strong>Urgencia:</strong> Un repuesto que se necesita ya no puede esperar un barco.</li>
</ul>

<h3>Para productos con seguridad eléctrica</h3>
<p>Vía courier, podés importar productos que requieren certificación de seguridad eléctrica (habilitación de la <strong>Secretaría de Energía y la Secretaría de Comercio</strong>) <strong>sin tenerla al momento de la importación</strong>.</p>
<p>Pero atención: para la <strong>venta posterior</strong> en Argentina, sí la necesitás.</p>

<h3>Para testear antes de escalar</h3>
<p>Querés probar un proveedor, validar calidad o testear demanda? El courier te permite importar cantidades chicas con riesgo mínimo. Si funciona, escalás.</p>

<h2>Cuándo conviene marítimo</h2>

<h3>Para volúmenes grandes</h3>
<p>Si necesitás reponer 500, 1.000 o 5.000 unidades, el marítimo diluye los costos fijos entre muchas unidades y el costo por CBM queda mucho más bajo que el equivalente aéreo.</p>

<h3>Para productos pesados o voluminosos</h3>
<p>Muebles, maquinaria, materiales de construcción, materia prima en cantidad — productos donde el flete aéreo sería prohibitivo.</p>

<h3>Para operaciones recurrentes</h3>
<p>Si ya tenés proveedor estable, producto validado y ventas predecibles, el marítimo optimiza el costo por unidad.</p>

<h2>¿Cuándo NO conviene marítimo?</h2>
<p>Si tu operación es chica, el marítimo puede ser <strong>más caro</strong> que el courier. Los costos fijos (despachante ~USD 600, depósito fiscal ~USD 900-1.000, SIM, desconsolidación, flete local) se aplican igual mandes 1 CBM o 10.</p>
<blockquote><p><strong>La regla práctica:</strong> Si tus productos son livianos y no estás moviendo miles de unidades, probablemente te conviene quedarte en courier. El marítimo empieza a tener sentido cuando el volumen diluye los costos fijos — o cuando tus productos son tan pesados que no hay alternativa aérea viable.</p></blockquote>

<h2>El factor riesgo</h2>
<p>Un error en una importación marítima — mercadería mal clasificada, proveedor que envió cualquier cosa — <strong>puede costar miles de dólares</strong>. Contenedores varados, almacenaje portuario, tiempos que se estiran.</p>
<p>En courier, el riesgo financiero es acotado. Trabajás con montos de hasta USD 3.000. Si algo sale mal, el impacto es manejable.</p>

<h2>¿Se pueden combinar las dos modalidades?</h2>
<p>Sí, y es la estrategia inteligente de muchos importadores:</p>
<ol>
<li><strong>Primer lote por courier</strong> → Testeás producto, validás calidad, probás demanda.</li>
<li><strong>Si funciona, escalás a marítimo</strong> → Pedido grande, mejor costo por unidad.</li>
<li><strong>Reposiciones urgentes por courier</strong> → Si se acaba el stock mientras esperás el barco.</li>
</ol>
<p>Lo mejor de los dos mundos: velocidad para arrancar, costo optimizado para escalar.</p>

<h2>Cómo cotizar cada modalidad</h2>
<p>Para <strong>courier</strong>, estimá el costo completo con el <a href="/cotizadorv2">cotizador de importación de Shippar</a>. Ingresás FOB, peso y dimensiones → obtenés desglose de flete, impuestos y total.</p>
<p>Para <strong>marítimo</strong>, los costos dependen del volumen, tipo de carga y origen. <a href="https://shippar.net" target="_blank" rel="noopener">Contactá a Shippar</a> para una cotización personalizada.</p>
<p>Una vez que tengas el costo, usá la <a href="/calculadora">calculadora de rentabilidad</a> para saber si el negocio cierra.</p>

<h2>Preguntas frecuentes</h2>
<details>
<summary>¿Puedo importar por courier y marítimo al mismo tiempo?</summary>
<div>Sí. Son operaciones independientes. Podés tener un envío courier en tránsito mientras planificás un despacho marítimo.</div>
</details>
<details>
<summary>¿Cuál es más barato?</summary>
<div>Depende del volumen. Para operaciones chicas, courier suele ser más económico (incluye despacho, entrega y tiene menos impuestos). Para volúmenes grandes, marítimo optimiza el costo — pero hay que sumar despachante, depósito y flete local.</div>
</details>
<details>
<summary>¿Un monotributista puede pasarse a marítimo después?</summary>
<div>Sí, si se inscribe como responsable inscripto y habilita su CUIT como importador. Tiene sentido cuando el volumen justifica el cambio de régimen.</div>
</details>
<details>
<summary>¿Cuántos CBM necesito para que el marítimo convenga?</summary>
<div>No hay un número exacto, pero como referencia: con menos de 3-4 CBM, los costos fijos representan un porcentaje alto del total. A partir de 5-10 CBM, el marítimo empieza a ser claramente más económico.</div>
</details>',
  ARRAY['Comparativa', 'Estrategia'],
  '10 min',
  'ship',
  true
),

-- ────────────────────────────
-- BLOG 3: Rentabilidad
-- ────────────────────────────
(
  'rentabilidad-importar',
  'Cómo saber si tu importación es rentable antes de invertir',
  'Cómo Calcular la Rentabilidad de tu Importación Antes de Comprar | Shippar',
  'Aprende a calcular ganancia neta, margen, ROI y punto de equilibrio de tu importación. Ejemplo práctico con números reales para que decidas con datos.',
  'Aprende a calcular ganancia neta, margen, ROI y punto de equilibrio con un ejemplo práctico de un producto de USD 10 FOB.',
  '<p>El error más caro en importación no es elegir un mal producto. Es comprar sin haber hecho los números.</p>
<p>Muchos importadores hacen una cuenta rápida: "lo compro a USD 10, lo vendo a $30.000, me queda un montón". Pero se olvidan de todo lo que pasa en el medio — flete, impuestos, comisiones de Mercado Libre, cuotas, IIBB, envío al comprador. Cuando suman todo, ese margen del 60% termina siendo del 5%.</p>
<p>Esta guía te enseña a calcular la rentabilidad <strong>real</strong> de una importación antes de poner un peso.</p>

<h2>Por qué calcular rentabilidad antes de comprar</h2>
<p>Importar implica comprometer capital por adelantado. Pagás el producto, pagás el flete, pagás impuestos — y recién recuperás cuando vendés. Si los números no cierran, lo descubrís cuando ya invertiste.</p>
<p>Y a diferencia de un negocio local donde podés devolver stock al proveedor, en importación la mercadería ya cruzó una frontera.</p>
<p>Hacer los números antes te permite:</p>
<ul>
<li><strong>Saber si el negocio cierra</strong> antes de transferir un dólar</li>
<li><strong>Definir tu precio de venta</strong> con todos los costos reales</li>
<li><strong>Comparar productos y proveedores</strong> con criterio financiero</li>
<li><strong>Detectar costos ocultos</strong> que hacen la diferencia entre ganar y perder</li>
</ul>

<h2>Los costos que tenés que incluir (todos)</h2>
<p>Acá es donde la mayoría se pierde. No es solo lo que le pagás al proveedor.</p>

<h3>1. Costos de producto</h3>
<p>El precio que le pagás al proveedor por cada unidad. Si comprás por lote, dividí el total por la cantidad de unidades.</p>

<h3>2. Costos de importación</h3>
<p>Todo lo que necesitás pagar para traer el producto a Argentina:</p>
<ul>
<li>Flete internacional (depende del peso facturable y el origen)</li>
<li>Seguro de transporte</li>
<li>Derechos de importación (arancel según NCM)</li>
<li>Tasa estadística (3%)</li>
<li>IVA aduanero (21% sobre base imponible)</li>
</ul>
<p><strong>Dato clave:</strong> Si importás por <strong>courier</strong>, pagás ~30% menos de impuestos. No se cobra IVA adicional (21%), percepción de ganancias (6%) ni IIBB (3,5%). En <strong>marítimo</strong>, estos impuestos se suman — son recuperables como crédito fiscal, pero son un desembolso inicial grande.</p>
<p>Para calcular esto con tus datos reales → <a href="/cotizadorv2">cotizador de importación de Shippar</a>.</p>

<h3>3. Costos de venta</h3>
<ul>
<li><strong>Comisión de plataforma:</strong> En Mercado Libre ronda el 13-17% según categoría.</li>
<li><strong>Comisión de medio de pago:</strong> Típicamente 3-4%.</li>
<li><strong>Costo por ofrecer cuotas:</strong> Si ofrecés cuotas sin interés, la pasarela te cobra un porcentaje adicional.</li>
<li><strong>Costo de envío al comprador:</strong> Si absorbés el envío (envío gratis), es un costo tuyo.</li>
</ul>

<h3>4. Impuestos sobre la venta</h3>
<ul>
<li><strong>Ingresos brutos (IIBB):</strong> Varía según jurisdicción, típicamente 3-5%.</li>
<li><strong>Retenciones:</strong> Dependen de tu régimen fiscal y la plataforma.</li>
</ul>
<p>Estos costos parecen chicos individualmente. Pero sumados pueden representar <strong>el 40-50% del precio de venta</strong>.</p>

<h2>Los 4 indicadores clave de tu operación</h2>

<h3>Ganancia neta por unidad</h3>
<p>Lo que te queda en el bolsillo por cada unidad que vendés.</p>
<p><strong>Cálculo:</strong> Precio de venta neto − todos los costos (producto + importación + comisiones + impuestos + envío)</p>
<p><strong>¿Cómo leerlo?</strong> Si es positivo, ganás. Si es negativo, <strong>perdés plata con cada venta</strong> — y cuanto más vendés, más perdés.</p>

<h3>Margen sobre ingresos</h3>
<p>El porcentaje de tu facturación que queda como ganancia.</p>
<p><strong>Cálculo:</strong> (Ganancia Neta / Precio de Venta Neto) × 100</p>
<p><strong>¿Cómo leerlo?</strong> Un margen del 25% significa que de cada $100 que facturás, $25 son ganancia real. En Mercado Libre, un <strong>margen neto del 20-25%</strong> suele ser un piso razonable.</p>

<h3>ROI (Return on Investment)</h3>
<p>Cuánto rendimiento sacás por cada peso invertido.</p>
<p><strong>Cálculo:</strong> (Ganancia Neta / Inversión Total) × 100</p>
<p><strong>¿Cómo leerlo?</strong> Un ROI del 50% significa que invertiste $100 y ganaste $50 netos. Para importaciones en Argentina, un <strong>ROI del 40-60% suele ser un buen rango</strong>.</p>

<h3>Punto de equilibrio (Break-even)</h3>
<p>El precio mínimo de venta para cubrir todos tus costos y no perder.</p>
<p><strong>¿Cómo leerlo?</strong> Si tu precio está muy cerca del punto de equilibrio, cualquier imprevisto te pone en pérdida. Cuanto más lejos esté tu precio del break-even, más sano es tu negocio.</p>

<h2>Ejemplo práctico: producto de USD 10 FOB</h2>
<p>Supongamos que querés importar un accesorio electrónico de <strong>USD 10 FOB desde China, vía courier</strong>.</p>

<h3>Costos de importación estimados</h3>
<table>
<thead><tr><th>Concepto</th><th>Valor</th></tr></thead>
<tbody>
<tr><td>Costo del producto (FOB)</td><td>USD 10,00</td></tr>
<tr><td>Flete courier (por unidad)</td><td>USD 3,50</td></tr>
<tr><td>Impuestos de importación (courier)</td><td>USD 4,20</td></tr>
<tr><td>Gastos de gestión</td><td>USD 0,80</td></tr>
<tr><td><strong>Costo total en Argentina</strong></td><td><strong>USD 18,50</strong></td></tr>
</tbody>
</table>

<h3>Venta en Mercado Libre</h3>
<table>
<thead><tr><th>Concepto</th><th>Valor</th></tr></thead>
<tbody>
<tr><td>Precio de venta bruto</td><td>USD 35,00</td></tr>
<tr><td>Comisión ML (15%)</td><td>−USD 5,25</td></tr>
<tr><td>Medio de pago (4%)</td><td>−USD 1,40</td></tr>
<tr><td>IIBB (3,5%)</td><td>−USD 1,22</td></tr>
<tr><td>Envío (si lo absorbés)</td><td>−USD 2,00</td></tr>
<tr><td><strong>Precio de venta neto</strong></td><td><strong>USD 25,13</strong></td></tr>
</tbody>
</table>

<h3>Resultado</h3>
<table>
<thead><tr><th>Indicador</th><th>Valor</th><th>¿Es bueno?</th></tr></thead>
<tbody>
<tr><td><strong>Ganancia neta</strong></td><td>USD 6,63</td><td>✅ Positiva</td></tr>
<tr><td><strong>Margen</strong></td><td>26,4%</td><td>✅ Arriba del piso de 20%</td></tr>
<tr><td><strong>ROI</strong></td><td>35,8%</td><td>⚠️ Aceptable, mejorable</td></tr>
<tr><td><strong>Break-even</strong></td><td>USD 25,90</td><td>✅ Lejos del precio de venta</td></tr>
</tbody>
</table>
<p>En este caso, el negocio cierra. Tenés margen del 26%, tu precio está bastante arriba del break-even, y la ganancia por unidad es razonable.</p>
<p><strong>Pero:</strong> si el costo de importación sube, si la comisión de ML cambia, o si ofrecés cuotas sin interés... los números se mueven rápido.</p>
<p>Para hacer esta simulación con <strong>tus datos reales</strong> → <a href="/calculadora">calculadora de rentabilidad de Shippar</a>.</p>

<h2>El flujo inteligente: cotizar → calcular → decidir</h2>
<ol>
<li><strong>Cotizá tu importación</strong> con el <a href="/cotizadorv2">cotizador</a> → sabés cuánto cuesta traer el producto.</li>
<li><strong>Calculá la rentabilidad</strong> con la <a href="/calculadora">calculadora</a> → sabés si margen, ROI y break-even cierran.</li>
<li><strong>Decidí con datos</strong> → si los números dan, comprá. Si no, buscá otro producto o negociá mejor precio.</li>
</ol>

<h2>Errores comunes al calcular rentabilidad</h2>
<ul>
<li><strong>Comparar FOB con precio de venta directamente.</strong> El FOB es solo el costo del producto. Falta flete, impuestos, comisiones y más.</li>
<li><strong>Olvidar comisiones de plataforma y pago.</strong> En ML, comisiones + medio de pago pueden sumar un 20% del precio de venta.</li>
<li><strong>No incluir IIBB ni retenciones.</strong> Parecen chicos (3-5%) pero sobre cada venta.</li>
<li><strong>Ignorar el costo de ofrecer cuotas.</strong> La pasarela te descuenta un porcentaje adicional.</li>
<li><strong>Calcular margen sobre el costo.</strong> El margen relevante es sobre el precio de venta, no sobre lo que invertiste (eso es el ROI).</li>
<li><strong>No contemplar el tipo de cambio.</strong> Comprás en USD, vendés en pesos. Una devaluación te mejora; una apreciación te destruye.</li>
</ul>

<h2>Preguntas frecuentes</h2>
<details>
<summary>¿Cuánto margen necesito para que mi importación sea sostenible?</summary>
<div>Un margen neto del 20-25% sobre precio de venta es un piso razonable para Mercado Libre. Con Tienda Nube u otra web, los márgenes pueden ser más altos pero tenés que contemplar el costo de adquirir clientes.</div>
</details>
<details>
<summary>¿Los impuestos de importación se pueden recuperar?</summary>
<div>En importaciones formales (marítimo, carga aérea), sí — IVA adicional, percepciones de ganancias e IIBB son recuperables como crédito fiscal. En courier, esos impuestos directamente no se cobran.</div>
</details>
<details>
<summary>¿Conviene vender en Mercado Libre o con web propia?</summary>
<div>Depende de tu producto y tu capacidad de generar tráfico. ML te da visibilidad inmediata pero cobra comisiones altas (13-17%). Una web propia tiene márgenes más altos pero necesitás invertir en publicidad y logística.</div>
</details>
<details>
<summary>¿Cómo afecta el tipo de cambio a mi rentabilidad?</summary>
<div>Si comprás en USD y vendés en pesos, una devaluación del peso mejora tu margen (tus costos ya están pagados en dólares). Una apreciación hace lo contrario.</div>
</details>',
  ARRAY['Rentabilidad', 'Negocio'],
  '9 min',
  'chart',
  true
)

ON CONFLICT (slug) DO NOTHING;
