"use client";

import React, { useState, useMemo } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";

/**
 * CategorySelectorV2 - Selector de categorías específico para Cotizador V2
 * 
 * Usa el esquema nuevo de categorías con las propiedades:
 * - nombre (en lugar de name)
 * - derechos_importacion
 * - tasa_estadistica
 * - iva
 * - activa
 */
export const CategorySelectorV2 = ({
  categories,
  selectedCategory,
  onCategoryChange,
  label = "Tipo de Producto",
  placeholder = "BUSCAR CATEGORÍA...",
  className = "",
}) => {
  // Estado para el buscador
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filtrar categorías basado en el término de búsqueda
  // Solo muestra categorías activas
  const filteredCategories = useMemo(() => {
    const activeCategories = categories.filter((category) => category.activa !== false);
    
    if (!searchTerm.trim()) return activeCategories;
    
    return activeCategories.filter((category) =>
      category.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Manejar selección de categoría
  const handleCategorySelect = (categoryName) => {
    onCategoryChange(categoryName);
    setSearchTerm("");
    setIsSearchOpen(false);
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor="category"
        className="block text-sm font-medium text-slate-600 mb-1"
      >
        {label}
      </label>

      {/* Buscador de categorías */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={isSearchOpen ? searchTerm : selectedCategory.nombre}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder={placeholder}
            className="w-full cursor-pointer bg-white rounded-md border-2 border-sky-50 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm uppercase font-medium opacity-90 transition-all duration-200 py-3 pl-10 pr-10 tracking-wide placeholder:opacity-60 placeholder:text-slate-400"
          />
          <IoSearchOutline
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          {isSearchOpen && searchTerm && (
            <button
              onClick={clearSearch}
              className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <IoCloseOutline size={18} />
            </button>
          )}
        </div>

        {/* Lista desplegable de resultados */}
        {isSearchOpen && (
          <div className="absolute z-100 w-full mt-1 bg-white border border-sky-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <button
                  key={category.nombre}
                  onClick={() => handleCategorySelect(category.nombre)}
                  className={`cursor-pointer w-full text-left px-4 py-2.5 text-sm uppercase font-medium opacity-90 hover:opacity-100 transition-all tracking-wide ${
                    category.nombre === selectedCategory.nombre
                      ? "bg-sky-100 text-sky-700"
                      : "text-slate-700 hover:bg-sky-50"
                  }`}
                >
                  {category.nombre}
                </button>
              ))
            ) : (
              <div className="px-4 py-2.5 text-sm text-slate-500 italic opacity-75">
                No se encontraron categorías que coincidan con "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside para cerrar */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsSearchOpen(false)}
        />
      )}
    </div>
  );
};
