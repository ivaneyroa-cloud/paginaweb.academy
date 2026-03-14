import React from "react";
import { Card } from "./Card";
import { MiniBoxCard } from "./MiniBoxCard";

// Icons
import { BoxIcon, PlusIcon } from "@/shared/components/icons";

/**
 * Tarjeta para gestionar las cajas de embalaje
 *
 * @param {Object} props - Props del componente
 * @param {Array} props.boxes - Lista de cajas
 * @param {function} props.onBoxesChange - Función para cambiar las cajas
 */
export const BoxesCard = ({ boxes, onBoxesChange }) => {
  const handleBoxChange = (id, field, value) => {
    const updatedBoxes = boxes.map((box) =>
      box.id === id ? { ...box, [field]: value } : box
    );
    onBoxesChange(updatedBoxes);
  };

  const addBox = () => {
    const newBox = {
      id: Date.now(),
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
    };
    onBoxesChange([...boxes, newBox]);
  };

  const removeBox = (id) => {
    onBoxesChange(boxes.filter((box) => box.id !== id));
  };

  return (
    <Card
      title="Cajas (Embalaje)"
      icon={<BoxIcon size={22} />}
      className=" transition-all duration-300 hover:shadow-xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {boxes.map((box, index) => (
          <MiniBoxCard
            key={box.id}
            box={box}
            index={index}
            onChange={handleBoxChange}
            onRemove={removeBox}
            isRemovable={boxes.length > 1}
          />
        ))}

        {/* Botón agregar */}
        <button
          onClick={addBox}
          aria-label="Agregar nueva caja"
          className="cursor-pointer p-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-sky-400 hover:bg-sky-50/50 transition-all flex flex-col items-center justify-center text-slate-500 hover:text-sky-600 h-full min-h-[180px]"
        >
          <PlusIcon className="h-8 w-8 mb-2" />
          <span className="font-semibold">Agregar Caja</span>
        </button>
      </div>
    </Card>
  );
};
