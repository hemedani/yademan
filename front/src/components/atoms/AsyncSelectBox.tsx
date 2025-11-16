"use client";
import dynamic from "next/dynamic";
import React from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { GroupBase, OptionsOrGroups, StylesConfig } from "react-select";

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

interface InputProps<
  Option,
  Group extends GroupBase<Option>,
  T extends FieldValues = FieldValues,
> {
  name: FieldPath<T>;
  control: any; // Use any type for control to handle react-hook-form's control prop
  label: string;
  setValue: UseFormSetValue<T>;
  labelAsValue?: boolean;
  errMsg?: string;
  placeholder?: string;
  loadOptions?: (
    inputValue: string,
    callback: (options: OptionsOrGroups<Option, Group>) => void,
  ) => Promise<OptionsOrGroups<Option, Group>> | void;
  defaultOptions?: OptionsOrGroups<Option, Group> | boolean;
  className?: string;
}

const AsyncSelectBox = <
  Option,
  Group extends GroupBase<Option>,
  T extends FieldValues = FieldValues,
>({
  errMsg,
  name,
  control,
  label,
  loadOptions,
  setValue,
  labelAsValue,
  defaultOptions,
  className,
  placeholder,
}: InputProps<Option, Group, T>) => {
  const customStyles: StylesConfig<unknown, false> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "48px",
      backgroundColor: errMsg ? "#fef2f2" : "white",
      borderColor: errMsg
        ? state.isFocused
          ? "#ef4444"
          : "#fca5a5"
        : state.isFocused
          ? "#3b82f6"
          : state.menuIsOpen
            ? "#64748b"
            : "#cbd5e1",
      borderWidth: "1px",
      borderRadius: "12px",
      boxShadow: state.isFocused
        ? errMsg
          ? "0 0 0 2px rgba(239, 68, 68, 0.1)"
          : "0 0 0 2px rgba(59, 130, 246, 0.1)"
        : "none",
      "&:hover": {
        borderColor: errMsg ? "#f87171" : "#64748b",
        backgroundColor: errMsg ? "#fef2f2" : "#f8fafc",
      },
      transition: "all 0.2s ease-in-out",
      cursor: "pointer",
      direction: "rtl",
    }),

    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 16px",
      direction: "rtl",
    }),

    input: (provided) => ({
      ...provided,
      margin: "0",
      padding: "0",
      color: "#1e293b",
      direction: "rtl",
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
      fontSize: "14px",
      direction: "rtl",
      textAlign: "right",
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "#1e293b",
      direction: "rtl",
      textAlign: "right",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#64748b",
      padding: "8px 12px",
      "&:hover": {
        color: "#3b82f6",
      },
      transform: state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",
      transition: "all 0.2s ease-in-out",
    }),

    clearIndicator: (provided) => ({
      ...provided,
      color: "#64748b",
      padding: "8px",
      "&:hover": {
        color: "#ef4444",
      },
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
    }),

    menu: (provided) => ({
      ...provided,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      marginTop: "4px",
      overflow: "hidden",
      zIndex: 9999,
    }),

    menuList: (provided) => ({
      ...provided,
      padding: "8px",
      maxHeight: "200px",
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
          ? "#f1f5f9"
          : "transparent",
      color: state.isSelected ? "white" : "#1e293b",
      borderRadius: "8px",
      margin: "2px 0",
      padding: "12px 16px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: state.isSelected ? "500" : "400",
      direction: "rtl",
      textAlign: "right",
      "&:hover": {
        backgroundColor: state.isSelected ? "#2563eb" : "#f1f5f9",
      },
      transition: "all 0.15s ease-in-out",
    }),

    noOptionsMessage: (provided) => ({
      ...provided,
      color: "#64748b",
      fontSize: "14px",
      padding: "12px 16px",
      direction: "rtl",
      textAlign: "right",
    }),

    loadingMessage: (provided) => ({
      ...provided,
      color: "#64748b",
      fontSize: "14px",
      padding: "12px 16px",
      direction: "rtl",
      textAlign: "right",
    }),
  };

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <label
        htmlFor={name}
        className="text-sm font-medium text-slate-700 text-right"
      >
        {label}
      </label>

      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange } }) => (
            <AsyncSelect
              cacheOptions
              defaultOptions={defaultOptions}
              loadOptions={loadOptions}
              onChange={(newVal: any, actionMeta: any) => {
                if (newVal) {
                  const selectedValue = labelAsValue
                    ? newVal.label
                    : newVal.value;
                  onChange(selectedValue as PathValue<T, Path<T>>);
                  // Also call setValue to ensure form is updated properly
                  setValue(name, selectedValue as PathValue<T, Path<T>>);
                } else {
                  onChange(null as PathValue<T, Path<T>>);
                  setValue(name, null as PathValue<T, Path<T>>);
                }
              }}
              name={name}
              placeholder={placeholder || `${label} را انتخاب کنید`}
              styles={customStyles}
              noOptionsMessage={() => "گزینه‌ای یافت نشد"}
              loadingMessage={() => "در حال بارگذاری..."}
              isClearable
              isRtl={true}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          )}
        />
      </div>

      {errMsg && (
        <span className="text-red-500 text-xs font-medium text-right mt-1 flex items-center gap-1">
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
  );
};

export default AsyncSelectBox;
