"use client";

import React, { useState, useMemo } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";

export const CategorySelector = ({
  categories,
  selectedCategory,
  onCategoryChange,
  label = "Tipo de Producto",
  placeholder = "Buscar categoría...",
  className = "",
}) => {
  // Estado para el buscador
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filtrar categorías basado en el término de búsqueda
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            value={isSearchOpen ? searchTerm : selectedCategory.name}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder={placeholder}
            className="w-full bg-white rounded-md border-2 border-sky-50 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm transition-all duration-200 py-2 pl-10 pr-10"
          />
          <IoSearchOutline
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={16}
          />
          {isSearchOpen && searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <IoCloseOutline size={16} />
            </button>
          )}
        </div>

        {/* Lista desplegable de resultados */}
        {isSearchOpen && (
          <div className="absolute z-100 w-full mt-1 bg-white border border-sky-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-sky-50 transition-colors ${
                    category.name === selectedCategory.name
                      ? "bg-sky-100 text-sky-700 font-medium"
                      : "text-slate-700"
                  }`}
                >
                  {category.name}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-slate-500 italic">
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
