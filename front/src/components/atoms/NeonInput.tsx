import React from "react";

interface NeonInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const NeonInput: React.FC<NeonInputProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  rows,
  disabled = false,
  className = "",
  label,
}) => {
  const baseClasses = "w-full bg-[#1e1e1e] text-white rounded-lg border-2 focus:outline-none transition-all duration-300";
  const activeClasses = "border-[#FF007A] shadow-[0_0_10px_rgba(255,0,122,0.5)]";
  const inactiveClasses = "border-gray-600";

  const element = type === "textarea" ? (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`${baseClasses} ${inactiveClasses} focus:${activeClasses} p-3 ${className}`}
    />
  ) : (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${inactiveClasses} focus:${activeClasses} px-3 py-2 ${className}`}
    />
  );

  return label ? (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      {element}
    </div>
  ) : (
    element
  );
};

export default NeonInput;
