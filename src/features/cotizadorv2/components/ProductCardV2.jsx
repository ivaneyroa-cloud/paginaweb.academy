import React from "react";
import { Card } from "./Card";
import { Input } from "@/shared/components/ui/Input";

// Selector
import { CategorySelectorV2 } from "./ui";

// Icons
import { IoBagHandleOutline as ProductIcon } from "react-icons/io5";

/**
 * ProductCardV2 - Tarjeta simplificada solo con inputs
 * Muestra: Categoría y FOB (sin cálculos automáticos)
 * 
 * @param {Object} props - Props del componente
 * @param {Array} props.categories - Lista de categorías disponibles
 * @param {Object} props.categoriaSeleccionada - Categoría seleccionada
 * @param {number} props.valorFob - Valor FOB total
 * @param {function} props.onCategoriaChange - Función para cambiar categoría
 * @param {function} props.onFobChange - Función para cambiar el FOB
 * @param {Object} props.errores - Objeto con errores de validación
 */
export const ProductCardV2 = ({
  categories,
  categoriaSeleccionada,
  valorFob,
  onCategoriaChange,
  onFobChange,
  errores = {},
}) => {
  return (
    <Card
      title="Producto"
      icon={<ProductIcon size={22} />}
      tooltip="Categoría del producto y valor FOB (Free On Board)."
      className="h-full"
    >
      {/* Badge instructivo
      <div className="mb-4 p-3 bg-sky-50 border border-sky-200 rounded-lg">
        <p className="text-sm text-sky-800">
          <strong> Completa estos datos:</strong> Selecciona la categoría de tu producto e ingresa el valor FOB total.
        </p>
      </div> */}

      <div className="space-y-4">
        {/* Selector de categoría */}
        <CategorySelectorV2
          categories={categories}
          selectedCategory={categoriaSeleccionada}
          onCategoryChange={onCategoriaChange}
          label="Categoría"
        />

        {/* Valor FOB */}
        <div>
          <Input
            label="Valor FOB"
            value={valorFob}
            onChange={onFobChange}
            prefix="$"
            tip="Declarado en factura comercial, sin flete ni seguro."
            className={errores.fob ? "mb-1" : "mb-4"}
          />
          {errores.fob && (
            <p className="text-xs text-red-600 font-medium mt-1 mb-3">{errores.fob}</p>
          )}
        </div>

        {/* Información adicional de la categoría */}
        {/* Usamos bg-slate-50/80 y un borde muy sutil para que no parezca un input */}
        <div className="mt-5 flex items-start gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
          
          {/* Ícono indicador (Asegurate de importar LuInfo de react-icons/lu o usar uno similar que ya tengas) */}
          <div className="flex-shrink-0 mt-0.5 text-sky-500">
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Contenido de texto */}
          <div className="flex flex-col">
            <p className="text-sm text-slate-800">
              <span className="font-semibold">Categoría:   </span> <span className="uppercase">{categoriaSeleccionada.nombre}</span> 
            </p>
            {/* Convertimos los porcentajes en metadatos técnicos (chiquitos, en mayúscula y con separación clara) */}
            <p className="text-[11px] text-slate-700 font-medium mt-1.5 leading-relaxed uppercase tracking-widest">
              Derechos {categoriaSeleccionada.derechos_importacion.toFixed(1)}% <span className="mx-2 text-slate-700">•</span> 
              T. Estadística {categoriaSeleccionada.tasa_estadistica.toFixed(1)}% <span className="mx-2 text-slate-700">•</span> 
              IVA {categoriaSeleccionada.iva.toFixed(1)}% 

            </p>
          </div>

        </div>
      </div>
    </Card>
  );
};
