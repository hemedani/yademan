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
            <label className="block text-sm font-medium text-gray-300 mb-1 text-right">
              {label}
            </label>
          )}
          <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-600 rounded-md bg-gray-700 mb-2">
            {availableIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                className={`text-2xl p-2 rounded-md hover:bg-gray-600 ${
                  value === icon
                    ? "bg-pink-600 border-2 border-pink-500"
                    : "border border-gray-600"
                }`}
                onClick={() => onChange(icon)}
              >
                {icon}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-300 mb-1 text-right">
              آیکون سفارشی
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-0 focus:border-pink-500"
              placeholder="آیکون سفارشی وارد کنید"
            />
          </div>
          {errMsg && (
            <span className="text-red-400 text-xs font-medium text-right mt-1 flex items-center gap-1">
              <svg
                className="w-3 h-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errMsg}
            </span>
          )}
        </div>
      )}
    />
  );
};

export default IconPicker;
