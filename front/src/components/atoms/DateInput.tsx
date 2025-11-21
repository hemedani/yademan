"use client";
import React from "react";
import { FieldPath, FieldValues, Control, Controller } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import "./DateInput.css";
import type { Value } from "react-multi-date-picker";
import DateObject from "react-date-object";
import gregorian_en from "react-date-object/locales/gregorian_en";
import gregorian_fa from "react-date-object/locales/gregorian_fa";

interface DateInputProps {
  name: string;
  label: string;
  control: Control<any>; // Using any to make it flexible with forms
  className?: string;
  errMsg?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: "date" | "datetime" | "time";
  format?: string;
  range?: boolean;
  multiple?: boolean;
  locale?: "en" | "fa";
}

type DateValue = Date | string | null;
type DateRangeValue = { start: DateValue; end: DateValue } | null;
type DateMultipleValue = DateValue[];

const DateInput = ({
  className,
  errMsg,
  name,
  label,
  placeholder,
  control,
  disabled = false,
  type = "date",
  format,
  range = false,
  multiple = false,
  locale = "en",
}: DateInputProps) => {
  // Determine the format based on type if not provided
  const defaultFormat = {
    date: "YYYY/MM/DD",
    datetime: "YYYY/MM/DD HH:mm",
    time: "HH:mm",
  };

  const displayFormat = format || defaultFormat[type];

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-300 text-right"
      >
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            value={value || (range ? [] : undefined)}
            onChange={(date) => {
              // Convert to appropriate format based on type
              if (date) {
                if (Array.isArray(date)) {
                  // Handle range or multiple dates
                  if (range && date.length === 2) {
                    // Format range as [start, end]
                    const dateArray = date as DateObject[];
                    onChange({
                      start: dateArray[0]
                        ? dateArray[0] instanceof DateObject
                          ? dateArray[0].toDate().toISOString()
                          : typeof dateArray[0] === "string"
                            ? dateArray[0]
                            : new Date(dateArray[0]).toISOString()
                        : null,
                      end: dateArray[1]
                        ? dateArray[1] instanceof DateObject
                          ? dateArray[1].toDate().toISOString()
                          : typeof dateArray[1] === "string"
                            ? dateArray[1]
                            : new Date(dateArray[1]).toISOString()
                        : null,
                    });
                  } else if (multiple) {
                    // Format multiple dates as array of ISO strings
                    const dateArray = date as DateObject[];
                    onChange(
                      dateArray.map((d) => {
                        if (d instanceof DateObject)
                          return d.toDate().toISOString();
                        if (typeof d === "string") return d;
                        if (d) return new Date(d).toISOString();
                        return null;
                      }),
                    );
                  }
                } else {
                  // Single date
                  const singleDate = date as DateObject;
                  if (singleDate instanceof DateObject) {
                    onChange(singleDate.toDate().toISOString());
                  } else if (typeof singleDate === "string") {
                    onChange(singleDate);
                  } else {
                    onChange(new Date(singleDate).toISOString());
                  }
                }
              } else {
                onChange(null);
              }
            }}
            format={displayFormat}
            range={range}
            multiple={multiple}
            locale={locale === "fa" ? gregorian_fa : gregorian_en}
            className={`
              rmdp-wrapper
              w-full px-4 py-3 text-white bg-gray-700 border rounded-xl
              placeholder:text-gray-400 text-right
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-0 focus:border-pink-500
              hover:border-gray-500
              ${
                disabled
                  ? "bg-gray-700 cursor-not-allowed opacity-60"
                  : "hover:bg-gray-600/50"
              }
              ${
                errMsg
                  ? "border-red-500 bg-red-900/30 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-600"
              }
            `}
            containerClassName="w-full"
            inputClass={`
              w-full h-full bg-transparent border-none
              focus:outline-none focus:ring-0 focus:shadow-none
            `}
            disabled={disabled}
            placeholder={placeholder || label}
          />
        )}
      />

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

export default DateInput;
