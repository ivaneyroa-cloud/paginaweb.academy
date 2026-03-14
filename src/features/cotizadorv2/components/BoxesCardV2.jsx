import React from "react";
import { Card } from "./Card";
import { MiniBoxCardV2 } from "./MiniBoxCardV2";

// Icons
import { BoxIcon, PlusIcon } from "@/shared/components/icons";

/**
 * BoxesCardV2 - Versión adaptada para V2 con título "Cajas - Peso"
 *
 * @param {Object} props - Props del componente
 * @param {Array} props.boxes - Lista de cajas
 * @param {function} props.onBoxesChange - Función para cambiar las cajas
 * @param {Object} props.erroresCajas - Objeto con errores de validación por caja
 */
export const BoxesCardV2 = ({ boxes, onBoxesChange, erroresCajas = {} }) => {
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

  const duplicateBox = (box) => {
    const duplicatedBox = {
      ...box,
      id: Date.now(),
    };
    onBoxesChange([...boxes, duplicatedBox]);
  };

  return (
    <Card
      title="Paso 2: Dimensiones y Peso"
      icon={<BoxIcon size={22} />}
      tooltip="Ingresá las dimensiones (largo × ancho × alto en cm) y el peso de cada caja."
      className="h-full"
    >
      {/* Badge instructivo
      <div className="mb-4 p-3 bg-sky-50 border border-sky-200 rounded-lg">
        <p className="text-sm text-sky-800">
          <strong> Agrega tus cajas:</strong> Ingresa las dimensiones (largo × ancho × alto) y el peso de cada caja.
        </p>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
        {boxes.map((box, index) => (
          <MiniBoxCardV2
            key={box.id}
            box={box}
            index={index}
            onChange={handleBoxChange}
            onRemove={removeBox}
            onDuplicate={duplicateBox}
            isRemovable={boxes.length > 1}
            errores={erroresCajas[index] || {}}
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
