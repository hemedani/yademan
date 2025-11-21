"use client";
import { ReactSelectOption } from "@/types/option";
import dynamic from "next/dynamic";
import React from "react";
import {
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import {
  GroupBase,
  OptionsOrGroups,
  PropsValue,
  StylesConfig,
} from "react-select";

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

export type SelectOption = { value: string; label: string };

interface InputProps<
  Option,
  Group extends GroupBase<Option>,
  T extends FieldValues = FieldValues,
> {
  name: FieldPath<T>;
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
  defaultValue?: PropsValue<Option>;
  className?: string;
}

const MyAsyncMultiSelect = <
  Option,
  Group extends GroupBase<Option>,
  T extends FieldValues = FieldValues,
>({
  errMsg,
  name,
  label,
  loadOptions,
  setValue,
  labelAsValue,
  defaultOptions,
  defaultValue,
  className,
  placeholder,
}: InputProps<Option, Group, T>) => {
  const customStyles: StylesConfig<unknown, true> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "48px",
      backgroundColor: errMsg ? "#450a0a" : "#374151", // dark gray background
      borderColor: errMsg
        ? state.isFocused
          ? "#ef4444"
          : "#f87171"
        : state.isFocused
          ? "#ec4899" // pink
          : state.menuIsOpen
            ? "#6b7280"
            : "#4b5563",
      borderWidth: "1px",
      borderRadius: "12px",
      boxShadow: state.isFocused
        ? errMsg
          ? "0 0 0 2px rgba(239, 68, 68, 0.3)"
          : "0 0 0 2px rgba(236, 72, 153, 0.3)" // pink glow
        : "none",
      "&:hover": {
        borderColor: errMsg ? "#ef4444" : "#6b7280",
        backgroundColor: errMsg ? "#450a0a" : "#4b5563",
      },
      transition: "all 0.2s ease-in-out",
      cursor: "pointer",
      direction: "rtl",
    }),

    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 16px",
      direction: "rtl",
      color: "#f3f4f6", // light text
    }),

    input: (provided) => ({
      ...provided,
      margin: "0",
      padding: "0",
      color: "#f3f4f6", // light text
      direction: "rtl",
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af", // gray text
      fontSize: "14px",
      direction: "rtl",
      textAlign: "right",
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "#f3f4f6", // light text
      direction: "rtl",
      textAlign: "right",
    }),

    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#4b5563", // dark gray
      borderRadius: "8px",
      margin: "2px",
      direction: "rtl",
    }),

    multiValueLabel: (provided) => ({
      ...provided,
      color: "#e5e7eb", // light gray text
      fontSize: "13px",
      fontWeight: "500",
      padding: "4px 8px",
      direction: "rtl",
    }),

    multiValueRemove: (provided) => ({
      ...provided,
      color: "#9ca3af", // gray
      borderRadius: "0 8px 8px 0",
      "&:hover": {
        backgroundColor: "#ef4444",
        color: "white",
      },
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#9ca3af", // gray
      padding: "8px 12px",
      "&:hover": {
        color: "#ec4899", // pink
      },
      transform: state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",
      transition: "all 0.2s ease-in-out",
    }),

    clearIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af", // gray
      padding: "8px",
      "&:hover": {
        color: "#ef4444", // red
      },
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
    }),

    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937", // dark blue-gray
      border: "1px solid #374151",
      borderRadius: "12px",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
      marginTop: "4px",
      overflow: "hidden",
      zIndex: 9999,
    }),

    menuList: (provided) => ({
      ...provided,
      padding: "8px",
      maxHeight: "200px",
      "::-webkit-scrollbar": {
        width: "6px",
      },
      "::-webkit-scrollbar-track": {
        background: "#1f2937",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#4b5563",
        borderRadius: "3px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#6b7280",
      },
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#8b5cf6" // purple
        : state.isFocused
          ? "#374151" // dark gray
          : "#1f2937", // dark blue-gray
      color: state.isSelected ? "white" : "#d1d5db",
      borderRadius: "8px",
      margin: "2px 0",
      padding: "12px 16px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: state.isSelected ? "500" : "400",
      direction: "rtl",
      textAlign: "right",
      "&:hover": {
        backgroundColor: state.isSelected ? "#7c3aed" : "#374151",
      },
      transition: "all 0.15s ease-in-out",
    }),

    noOptionsMessage: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "14px",
      padding: "12px 16px",
      direction: "rtl",
      textAlign: "right",
    }),

    loadingMessage: (provided) => ({
      ...provided,
      color: "#9ca3af",
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
        className="text-sm font-medium text-gray-300 text-right"
      >
        {label}
      </label>

      <div className="relative">
        <AsyncSelect
          isMulti
          cacheOptions
          defaultValue={defaultValue}
          loadOptions={loadOptions}
          defaultOptions={defaultOptions}
          onChange={(newVal) =>
            setValue(
              name,
              (newVal as ReactSelectOption[]).map((val) =>
                labelAsValue ? val.label : val.value,
              ) as unknown as PathValue<T, Path<T>>,
            )
          }
          name={name}
          placeholder={placeholder || `${label} را انتخاب کنید`}
          styles={customStyles}
          noOptionsMessage={() => "گزینه‌ای یافت نشد"}
          loadingMessage={() => "در حال بارگذاری..."}
          isRtl={true}
          className="react-select-container"
          classNamePrefix="react-select"
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
  );
};

export default MyAsyncMultiSelect;
