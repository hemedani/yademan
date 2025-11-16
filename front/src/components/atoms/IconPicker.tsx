import React from "react";
import { Controller, Control } from "react-hook-form";
import { availableIcons } from "@/app/actions/category/types";

interface IconPickerProps {
  name: string;
  control: Control<any>;
  label?: string;
  defaultValue?: string;
  errMsg?: string;
}

const IconPicker: React.FC<IconPickerProps> = ({
  name,
  control,
  label,
  defaultValue = "📍",
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
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              {label}
            </label>
          )}
          <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md mb-2">
            {availableIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                className={`text-2xl p-2 rounded-md hover:bg-gray-100 ${
                  value === icon
                    ? "bg-blue-100 border-2 border-blue-500"
                    : ""
                }`}
                onClick={() => onChange(icon)}
              >
                {icon}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
              آیکون سفارشی
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="آیکون سفارشی وارد کنید"
            />
          </div>
          {errMsg && <p className="text-red-500 text-xs mt-1">{errMsg}</p>}
        </div>
      )}
    />
  );
};

export default IconPicker;
