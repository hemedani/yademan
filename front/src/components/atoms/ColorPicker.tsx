import React from "react";
import { Controller, Control } from "react-hook-form";
import { availableColors } from "@/app/actions/category/types";

interface ColorPickerProps {
  name: string;
  control: Control<any>;
  label?: string;
  defaultValue?: string;
  errMsg?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  name,
  control,
  label,
  defaultValue = "#3B82F6",
  errMsg,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <div className="flex flex-col gap-2">
          {label && (
            <label className="block text-sm font-medium text-gray-300 mb-1 text-right">
              {label}
            </label>
          )}
          <div className="grid grid-cols-10 gap-2 mt-2 mb-2">
            {availableColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${
                  value === color
                    ? "border-gray-800 ring-2 ring-offset-2"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="#RRGGBB"
            />
          </div>
          {errMsg && <p className="text-red-500 text-xs mt-1">{errMsg}</p>}
        </div>
      )}
    />
  );
};

export default ColorPicker;
