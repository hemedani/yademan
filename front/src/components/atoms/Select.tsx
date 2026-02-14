"use client";
import React from "react";
import Select, { GroupBase, OptionsOrGroups, PropsValue } from "react-select";
import { FieldValues, FieldPath, UseFormSetValue, PathValue, Path } from "react-hook-form";
import { ReactSelectOption } from "@/types/option";

interface SelectBoxProps<
  Option,
  Group extends GroupBase<Option>,
  T extends FieldValues = FieldValues,
> {
  name: FieldPath<T>;
  label: string;
  setValue: UseFormSetValue<T> | ((name: FieldPath<T>, value: any, options?: any) => void);
  options: ReactSelectOption[];
  placeholder?: string;
  labelAsValue?: boolean;
  className?: string;
  errMsg?: string;
  defaultValue?: PropsValue<ReactSelectOption>;
  defaultOptions?: OptionsOrGroups<Option, Group> | boolean;
}

const SelectBox = <Option, Group extends GroupBase<Option>, T extends FieldValues = FieldValues>({
  name,
  setValue,
  label,
  options,
  errMsg,
  placeholder = "انتخاب کنید",
  className = "",
  labelAsValue,
  defaultValue,
}: SelectBoxProps<Option, Group, T>) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <Select
        id={name}
        options={options}
        onChange={(newVal) => {
          const value = (labelAsValue ? newVal!.label : newVal!.value) as unknown as PathValue<
            T,
            Path<T>
          >;
          setValue(name, value);
        }}
        placeholder={placeholder}
        classNamePrefix="react-select"
        className={`text-sm ${errMsg ? "border-red-500" : "border-gray-300"}`}
        defaultValue={defaultValue}
        styles={{
          control: (provided, state) => ({
            ...provided,
            backgroundColor: "#374151", // gray-700
            border: state.isFocused
              ? errMsg
                ? "1px solid #ef4444" // red-500
                : "1px solid #ec4899" // pink-500
              : "1px solid #4b5563", // gray-600
            borderRadius: "0.75rem",
            boxShadow: state.isFocused
              ? errMsg
                ? "0 0 0 2px rgba(239, 68, 68, 0.3)" // red-500/30
                : "0 0 0 2px rgba(236, 72, 153, 0.3)" // pink-500/30
              : "none",
            "&:hover": {
              borderColor: errMsg ? "#ef4444" : "#6b7280", // gray-500
            },
            minHeight: "48px",
            color: "#f3f4f6", // gray-100
            direction: "rtl",
          }),
          input: (provided) => ({
            ...provided,
            color: "#f3f4f6", // gray-100
            direction: "rtl",
            textAlign: "right",
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af", // gray-400
            direction: "rtl",
            textAlign: "right",
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "#f3f4f6", // gray-100
            direction: "rtl",
            textAlign: "right",
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: "#1f2937", // gray-800
            border: "1px solid #374151", // gray-700
            borderRadius: "0.75rem",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? "#8b5cf6" // purple-500
              : state.isFocused
                ? "#374151" // gray-700
                : "#1f2937", // gray-800
            color: state.isSelected ? "white" : "#d1d5db", // gray-300
            "&:hover": {
              backgroundColor: state.isSelected ? "#7c3aed" : "#374151",
            },
            direction: "rtl",
            textAlign: "right",
          }),
        }}
      />
      {errMsg && <span className="text-red-400 text-xs">{errMsg}</span>}
    </div>
  );
};

export default SelectBox;
