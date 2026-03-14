/**
 * calculationsV2.js
 * 
 * Archivo de lógica de negocio para el Cotizador de Importaciones V2.
 * Todas las funciones, variables y comentarios están en español.
 * 
 * CONCEPTO CLAVE: Dos tipos de flete diferentes:
 * 
 * 1. FLETE ADUANERO (Teórico/Normativo):
 *    - Valor normativo exigido por aduana
 *    - Solo se usa para calcular el Valor CIF (Base Imponible)
 *    - NO es visible para el cliente final
 *    - NO es un ítem a pagar
 *    - Tarifa actual: $2.5/kg
 * 
 * 2. COSTO DE ENVÍO SHIPPAR (Real/Comercial):
 *    - Precio comercial que Shippar cobra al cliente
 *    - Es el ingreso real de la empresa logística
 *    - SE muestra en la UI como "Envío Internacional Shippar"
 *    - Es el monto sobre el que se aplican descuentos
 *    - Tarifa actual: $3.5/kg
 * 
 * FLUJO DE CÁLCULO:
 * 1. Valor FOB (base)
 * 2. Flete Aduanero = pesoComputable * $2.5/kg (solo para CIF)
 * 3. Envío Shippar = pesoComputable * $3.5/kg (costo real al cliente)
 * 4. Seguro = (FOB + Flete Aduanero) * 1%
 * 5. Valor CIF = FOB + Flete Aduanero + Seguro
 * 6. Impuestos en cascada sobre CIF:
 *    - Tasa Estadística: sobre Valor CIF
 *    - Derechos de Importación: sobre Valor CIF
 *    - IVA: sobre (Valor CIF + Derechos de Importación)
 * 7. Costo de Importación = Envío Shippar + Seguro + Impuestos + Gasto Documental
 * 8. Costo Final Total = FOB + Costo de Importación
 */

// --- Constantes ---

// Tarifa de flete aduanero (USD por kg) - Valor normativo solo para calcular CIF
// Este valor NO se muestra al cliente final, solo se usa para la base imponible
export const TARIFA_FLETE_ADUANERO = 2.5;

// Porcentaje de seguro (1% de FOB + Flete)
export const PORCENTAJE_SEGURO = 0.01;

// --- Funciones de Cálculo de Producto ---

/**
 * Calcula el valor FOB total.
 * @param {number} precioUnitario - Precio por unidad del producto.
 * @param {number} cantidad - Cantidad de unidades.
 * @returns {number} El valor FOB total.
 */
export const calcularFob = (precioUnitario, cantidad) => {
  return precioUnitario * cantidad;
};

/**
 * Calcula el precio unitario basado en el FOB total y la cantidad.
 * @param {number} fob - Valor FOB total.
 * @param {number} cantidad - Cantidad de unidades.
 * @returns {number} El precio por unidad.
 */
export const calcularPrecioUnitario = (fob, cantidad) => {
  if (cantidad === 0) return 0;
  return fob / cantidad;
};

// --- Funciones de Cálculo de Embalaje y Peso ---

/**
 * Calcula el peso volumétrico de una caja.
 * Fórmula: (Largo × Ancho × Alto) / 5000.
 * @param {number} largo - Largo en cm.
 * @param {number} ancho - Ancho en cm.
 * @param {number} alto - Alto en cm.
 * @returns {number} El peso volumétrico en kg.
 */
export const calcularPesoVolumetrico = (largo, ancho, alto) => {
  return (largo * ancho * alto) / 5000;
};

/**
 * Determina el peso base de una caja (mayor entre real y volumétrico)
 * y le aplica el Redondeo Shippar al escalón superior de 0.5kg
 * @param {number} pesoReal - Peso real en kg.
 * @param {number} pesoVolumetrico - Peso volumétrico en kg.
 * @returns {number} El peso facturable redondeado en kg.
 */
export const calcularPesoComputable = (pesoReal, pesoVolumetrico) => {
  const pesoBase = Math.max(pesoReal, pesoVolumetrico);
  // Redondeo Shippar: siempre al escalón de 0.5 kg superior
  return Math.ceil(pesoBase * 2) / 2;
};

/**
 * Calcula el peso computable total sumando el de todas las cajas.
 * @param {Array} cajas - Array de objetos de caja.
 * @returns {number} El peso computable total en kg.
 */
export const calcularPesoComputableTotal = (cajas) => {
  return cajas.reduce((total, caja) => {
    const volumetrico = calcularPesoVolumetrico(
      caja.length,
      caja.width,
      caja.height
    );
    const computable = calcularPesoComputable(caja.weight, volumetrico);
    return total + computable;
  }, 0);
};

// --- Funciones de Cálculo de Flete ---

/**
 * Calcula el flete aduanero (teórico) - SOLO para calcular el Valor CIF.
 * Este valor es normativo y no se muestra al cliente como un ítem a pagar.
 * Fórmula: pesoComputableTotal * TARIFA_FLETE_ADUANERO
 * @param {number} pesoComputableTotal - Peso computable total en kg.
 * @returns {number} El flete aduanero en USD.
 */
export const calcularFleteAduanero = (pesoComputableTotal) => {
  return pesoComputableTotal * TARIFA_FLETE_ADUANERO;
};

/**
 * Busca la tarifa correspondiente en una tabla de precios según el peso facturable.
 * @param {number} pesoFacturable - Peso redondeado.
 * @param {Array} tarifas - Array de tarifas ordenado por peso.
 * @param {string} keyValor - Nombre de la columna que contiene el valor a retornar ('precio_por_kg_usd' o 'precio_total_usd')
 * @returns {number} Valor encontrado o 0 si hay error.
 */
const buscarTarifaPorPeso = (pesoFacturable, tarifas, keyValor) => {
  if (!tarifas || tarifas.length === 0) return 0;

  // Buscar coincidencia exacta
  const tarifaExacta = tarifas.find(t => Number(t.peso) === pesoFacturable);
  if (tarifaExacta) return Number(tarifaExacta[keyValor]);

  // Si no hay exacta (por algún motivo), buscar la inmediata superior
  const tarifaSuperior = tarifas.find(t => Number(t.peso) > pesoFacturable);
  if (tarifaSuperior) return Number(tarifaSuperior[keyValor]);

  // Fallback a la más alta
  return Number(tarifas[tarifas.length - 1][keyValor]);
};

/**
 * Calcula el Costo Base de Envío (Standard) cruzando las tablas de tarifas
 * @param {number} pesoFacturable - Peso computable total (ya redondeado)
 * @param {number} porcentajeDescuento - Cupón validado (ej. 85 para 85% de descuento, 0 si no hay)
 * @param {Object} configuraciones - Parámetros globales de Supabase
 * @param {Array} tarifasPublicas - Tabla de precios públicos (por kg)
 * @param {Array} tarifasInternacionales - Tabla de precios del proveedor (crudos, total)
 * @returns {Object} Desglose: { costoBase, valorCrudo, aplicaDescuento }
 */
export const calcularCostoBaseEnvio = (
  pesoFacturable,
  porcentajeDescuento,
  configuraciones,
  tarifasPublicas,
  tarifasInternacionales
) => {
  let costoBase = 0;
  let valorCrudo = 0;
  const tieneCupon = porcentajeDescuento > 0;

  if (!tieneCupon) {
    // ESCENARIO A: SIN CUPÓN (Tarifa Pública)
    if (pesoFacturable >= Number(configuraciones.peso_limite_tarifa_publica)) {
      // Excede la tabla: multiplicador extra
      costoBase = pesoFacturable * Number(configuraciones.precio_kg_extra_publico);
    } else {
      // Dentro de tabla: buscar tarifa_publica (precio por kg)
      const precioPorKg = buscarTarifaPorPeso(pesoFacturable, tarifasPublicas, 'precio_por_kg_usd');
      costoBase = pesoFacturable * precioPorKg;
    }
  } else {
    // ESCENARIO B: CON CUPÓN (Tarifa Internacional + Matemática)
    if (pesoFacturable >= Number(configuraciones.peso_limite_tarifa_internacional)) {
      // Excede la tabla: multiplicador extra crudo
      valorCrudo = pesoFacturable * Number(configuraciones.precio_kg_extra_internacional);
    } else {
      // Dentro de tabla: buscar tarifa_internacional (precio total)
      valorCrudo = buscarTarifaPorPeso(pesoFacturable, tarifasInternacionales, 'precio_total_usd');
    }

    // Fórmula Final con Fuel Surcharge y Cupón
    const factorDescuento = 1 - (porcentajeDescuento / 100);
    const factorFuel = 1 + (Number(configuraciones.recargo_fuel) / 100);

    costoBase = (valorCrudo * factorDescuento) * factorFuel;
  }

  return {
    costoBase,
    valorCrudo,
    aplicaDescuento: tieneCupon
  };
};

/**
 * Calcula el Costo de Envío Express basado en el Costo Base
 * @param {number} costoBase - Costo base calculado para Standard
 * @param {number} recargoExpress - Porcentaje de recargo (Ej: 10)
 * @returns {number} Costo express
 */
export const calcularEnvioExpress = (costoBase, recargoExpress) => {
  const factorExpress = 1 + (Number(recargoExpress) / 100);
  return costoBase * factorExpress;
};

// --- Funciones de Cálculo de Valor CIF ---

/**
 * Calcula el costo del seguro.
 * Fórmula: (FOB + Flete Aduanero) * 1%
 * Nota: Se usa el flete aduanero (normativo) para este cálculo.
 * @param {number} valorFob - Valor FOB total.
 * @param {number} fleteAduanero - Costo del flete aduanero.
 * @returns {number} El costo del seguro en USD.
 */
export const calcularSeguro = (valorFob, fleteAduanero) => {
  return (valorFob + fleteAduanero) * PORCENTAJE_SEGURO;
};

/**
 * Calcula el Valor CIF (Cost, Insurance and Freight).
 * Fórmula: FOB + Flete Aduanero + Seguro
 * Este es el valor base imponible para los impuestos.
 * Nota: Se usa el flete aduanero (normativo) para este cálculo.
 * @param {number} valorFob - Valor FOB total.
 * @param {number} fleteAduanero - Costo del flete aduanero.
 * @param {number} seguro - Costo del seguro.
 * @returns {number} El Valor CIF en USD.
 */
export const calcularValorCif = (valorFob, fleteAduanero, seguro) => {
  return valorFob + fleteAduanero + seguro;
};

// --- Funciones de Cálculo de Impuestos (Cascada) ---

/**
 * Calcula el IVA basado en el Valor CIF.
 * @param {number} baseImponible - Base imponible (Valor CIF + Derechos de Importación).
 * @param {number} porcentajeIva - Porcentaje de IVA (de la categoría como número entero, ej: 21 o 10.5).
 * @returns {number} El monto del IVA en USD.
 */
export const calcularIva = (baseImponible, porcentajeIva) => {
  return baseImponible * (porcentajeIva / 100);
};

/**
 * Calcula la Tasa Estadística basada en el Valor CIF.
 * @param {number} valorCif - Valor CIF.
 * @param {number} porcentajeTasaEstadistica - Porcentaje de la tasa estadística (de la categoría como número entero, ej: 3).
 * @returns {number} El monto de la tasa estadística en USD.
 */
export const calcularTasaEstadistica = (valorCif, porcentajeTasaEstadistica) => {
  return valorCif * (porcentajeTasaEstadistica / 100);
};

/**
 * Calcula los Derechos de Importación basados en el Valor CIF.
 * @param {number} valorCif - Valor CIF.
 * @param {number} porcentajeDerechos - Porcentaje de derechos de importación (de la categoría como número entero, ej: 35).
 * @returns {number} El monto de los derechos de importación en USD.
 */
export const calcularDerechosImportacion = (valorCif, porcentajeDerechos) => {
  const baseImponible = valorCif;
  return baseImponible * (porcentajeDerechos / 100);
};

/**
 * Calcula todos los impuestos y tasas aplicables.
 * Orden de cálculo en cascada:
 * 1. IVA sobre Valor CIF
 * 2. Tasa Estadística sobre Valor CIF
 * 3. Derechos de Importación sobre (Valor CIF + IVA)
 * 
 * NOTA: La estructura retornada es compatible con el componente CostChart
 * 
 * @param {number} valorCif - Valor CIF.
 * @param {Object} categoria - Objeto de la categoría seleccionada con porcentajes de impuestos.
 * @returns {Object} Objeto con el desglose de cada impuesto.
 */
export const calcularImpuestosCascada = (valorCif, categoria) => {
  // 1. Calcular Tasa Estadística sobre Valor CIF
  const montoTasaEstadistica = calcularTasaEstadistica(valorCif, categoria.tasa_estadistica);

  // 2. Calcular Derechos de Importación sobre Valor CIF
  const montoDerechosImportacion = calcularDerechosImportacion(
    valorCif,
    categoria.derechos_importacion
  );

  // 3. Calcular IVA sobre (Derechos de importacion + CIF)
  let baseImponible = valorCif + montoDerechosImportacion;
  const montoIva = calcularIva(baseImponible, categoria.iva);

  // Estructura compatible con CostChart
  return {
    iva: {
      name: `IVA ${categoria.iva}%`,
      percentage: categoria.iva,
      amount: montoIva,
    },
    statisticalFee: {
      name: "Tasa Estadística",
      percentage: categoria.tasa_estadistica,
      amount: montoTasaEstadistica,
    },
    importDuty: {
      name: "Derechos de Importación",
      percentage: categoria.derechos_importacion,
      amount: montoDerechosImportacion,
    },
  };
};

/**
 * Calcula el total de impuestos y tasas.
 * @param {Object} impuestos - Objeto con el desglose de impuestos.
 * @returns {number} El total de impuestos en USD.
 */
export const calcularTotalImpuestos = (impuestos) => {
  return Object.values(impuestos).reduce((suma, impuesto) => suma + impuesto.amount, 0);
};

// --- Funciones de Cálculo de Gastos Documentales ---

/**
 * Calcula el gasto documental de aduana.
 * Fórmula: SI(FOB>=500, MIN(FOB*9.35%, 120), MIN(FOB*20%, 60))
 * @param {number} fob - Valor FOB total.
 * @returns {number} El costo del gasto documental en USD.
 */
export const calcularGastoDocumental = (fob) => {
  if (fob >= 500) {
    return Math.min(fob * 0.0935, 120); // 9.35% con tope de $120
  } else {
    return Math.min(fob * 0.2, 60); // 20% con tope de $60
  }
};

// --- Funciones de Cálculo de Costo Final ---

/**
 * Calcula el costo total de importación (sin incluir el FOB).
 * Incluye: Envío Shippar (real) + Seguro + Impuestos + Gastos Documentales
 * @param {number} envioShippar - Costo de envío comercial de Shippar.
 * @param {number} seguro - Costo del seguro.
 * @param {number} totalImpuestos - Total de impuestos y tasas.
 * @param {number} gastoDocumental - Gasto documental de aduana.
 * @returns {number} El costo total de importación en USD.
 */
export const calcularCostoImportacion = (
  envioShippar,
  seguro,
  totalImpuestos,
  gastoDocumental
) => {
  return envioShippar + seguro + totalImpuestos + gastoDocumental;
};

/**
 * Calcula el costo final total (incluyendo el FOB).
 * @param {number} valorFob - Valor FOB total.
 * @param {number} costoImportacion - Costo de importación.
 * @returns {number} El costo final total en USD.
 */
export const calcularCostoFinalTotal = (valorFob, costoImportacion) => {
  return valorFob + costoImportacion;
};

/**
 * Calcula el costo final por unidad.
 * @param {number} costoFinalTotal - Costo final total.
 * @param {number} cantidad - Cantidad de unidades.
 * @returns {number} El costo final por unidad en USD.
 */
export const calcularCostoUnitarioFinal = (costoFinalTotal, cantidad) => {
  if (cantidad === 0) return 0;
  return costoFinalTotal / cantidad;
};

/**
 * Función principal que ejecuta todos los cálculos del cotizador.
 * Retorna un objeto completo con todos los valores calculados.
 * 
 * @param {Object} datos - Objeto con los datos de entrada.
 * @param {number} datos.precioUnitario - Precio unitario del producto.
 * @param {number} datos.cantidad - Cantidad de unidades.
 * @param {number} datos.valorFob - Valor FOB (puede ser calculado o ingresado directamente).
 * @param {Array} datos.cajas - Array de cajas de embalaje.
 * @param {Object} datos.categoria - Objeto de categoría con porcentajes de impuestos.
 * @param {number} datos.porcentajeDescuento - Porcentaje validado del cupón.
 * @param {Object} datos.configuraciones - Settings de Supabase.
 * @param {Array} datos.tarifasPublicas - Tabla pública.
 * @param {Array} datos.tarifasInternacionales - Tabla proveedor.
 * @returns {Object} Objeto con todos los valores calculados.
 */
export const calcularCotizacionCompleta = ({
  precioUnitario,
  cantidad,
  valorFob,
  cajas,
  categoria,
  porcentajeDescuento = 0,
  configuraciones,
  tarifasPublicas,
  tarifasInternacionales
}) => {
  // 1. Calcular FOB (si no se proporciona)
  const fob = valorFob || calcularFob(precioUnitario, cantidad);

  // 2. Calcular peso computable total (facturable con redondeo)
  const pesoComputableTotal = calcularPesoComputableTotal(cajas);

  // 3. Calcular flete aduanero (teórico para CIF)
  const fleteAduanero = calcularFleteAduanero(pesoComputableTotal);

  // 4. Calcular el Costo de Envío Base (Standard) y Express
  const resultadoEnvio = calcularCostoBaseEnvio(
    pesoComputableTotal,
    porcentajeDescuento,
    configuraciones,
    tarifasPublicas,
    tarifasInternacionales
  );

  const costoEnvioStandard = resultadoEnvio.costoBase; // Renombramos de envioShippar
  const costoEnvioExpress = calcularEnvioExpress(
    resultadoEnvio.costoBase,
    configuraciones.recargo_express
  );

  // 5. Calcular seguro (usando flete aduanero, como antes)
  const seguro = calcularSeguro(fob, fleteAduanero);

  // 6. Calcular Valor CIF (usando flete aduanero, como antes)
  const valorCif = calcularValorCif(fob, fleteAduanero, seguro);

  // 7. Calcular impuestos en cascada
  const impuestos = calcularImpuestosCascada(valorCif, categoria);
  const totalImpuestos = calcularTotalImpuestos(impuestos);

  // 8. Calcular gasto documental
  const gastoDocumental = calcularGastoDocumental(fob);

  // 9. Calcular costo de importación base (Standard por defecto)
  const costoImportacionStandard = calcularCostoImportacion(
    resultadoEnvio.costoBase,
    seguro,
    totalImpuestos,
    gastoDocumental
  );

  const costoImportacionExpress = calcularCostoImportacion(
    costoEnvioExpress,
    seguro,
    totalImpuestos,
    gastoDocumental
  );

  // 10. Calcular costo final total
  const costoFinalStandard = calcularCostoFinalTotal(fob, costoImportacionStandard);
  const costoFinalExpress = calcularCostoFinalTotal(fob, costoImportacionExpress);

  // 11. Calcular costo unitario final
  const costoUnitarioStandard = calcularCostoUnitarioFinal(costoFinalStandard, cantidad);

  return {
    // Datos base
    valorFob: fob,
    cantidad,
    precioUnitario,

    // Embalaje y peso
    cajas,
    pesoComputableTotal,

    // Flete aduanero (CIF)
    fleteAduanero,
    tarifaFleteAduanero: TARIFA_FLETE_ADUANERO,
    seguro,

    // Nuevos métodos de Envío Dinámico
    envio: {
      standard: resultadoEnvio.costoBase,
      express: costoEnvioExpress,
      valorCrudoOriginal: resultadoEnvio.valorCrudo,
      aplicoDescuento: resultadoEnvio.aplicaDescuento
    },

    // Valor CIF
    valorCif,

    // Impuestos y tasas
    impuestos,
    totalImpuestos,

    // Gastos adicionales
    gastoDocumental,

    // Costos finales totales separados por tipo de envío
    costosFinales: {
      standard: {
        importacion: costoImportacionStandard,
        total: costoFinalStandard,
        unitario: costoUnitarioStandard
      },
      express: {
        importacion: costoImportacionExpress,
        total: costoFinalExpress,
        unitario: calcularCostoUnitarioFinal(costoFinalExpress, cantidad)
      }
    }
  };
};
