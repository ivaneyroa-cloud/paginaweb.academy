import React from "react";
import { Card } from "./Card";
import { Input } from "@/shared/components/ui/Input";

// Selector
import { CategorySelector } from "./ui/CategorySelector";

// Icons
import { IoBagHandleOutline as ProductIcon } from "react-icons/io5";

/**
 * Tarjeta para ingresar la información básica del producto.
 * Contiene "campos inteligentes": si se edita el FOB, se recalcula el precio unitario,
 * y viceversa. Ahora incluye el selector de categoría.
 *
 * @param {Object} props - Props del componente
 * @param {Array} props.categories - Lista de categorías disponibles
 * @param {Object} props.selectedCategory - Categoría seleccionada
 * @param {number} props.unitPrice - Precio unitario
 * @param {number} props.quantity - Cantidad de unidades
 * @param {number} props.fob - Valor FOB total
 * @param {function} props.onCategoryChange - Función para cambiar categoría
 * @param {function} props.onUnitPriceChange - Función para cambiar el precio unitario
 * @param {function} props.onQuantityChange - Función para cambiar la cantidad
 * @param {function} props.onFobChange - Función para cambiar el FOB
 */
export const ProductCard = ({
  categories,
  selectedCategory,
  unitPrice,
  quantity,
  fob,
  onCategoryChange,
  onUnitPriceChange,
  onQuantityChange,
  onFobChange,
}) => {
  return (
    <Card
      title="Producto"
      icon={<ProductIcon size={22} />}
      className="transition-all duration-300 hover:shadow-xl"
    >
      {/* Contenedor principal para todos los campos con espaciado uniforme y aumentado */}
      <div className="space-y-4">
        {/* Selector de categoría/tipo de producto */}
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          label="Tipo de Producto"
          placeholder="Buscar categoría..."
        />

        {/* Nueva fila en grid para agrupar Precio y Cantidad */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Precio Unitario"
            value={unitPrice}
            onChange={onUnitPriceChange}
            prefix="$"
            maxDecimals={4}
            className="" // Se anula el margen por defecto para el layout de grid
          />
          <Input
            label="Cantidad de Unidades"
            value={quantity}
            onChange={onQuantityChange}
            className="" // Se anula el margen por defecto para el layout de grid
          />
        </div>

        <Input
          label="Valor FOB Total"
          value={fob}
          onChange={onFobChange}
          maxDecimals={4}
          prefix="$"
        />
      </div>
    </Card>
  );
};
