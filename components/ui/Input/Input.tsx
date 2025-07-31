"use client"
import React, { useState } from "react"
import TokenDropdown from "../Modal/token-dropdown"
import NGIcon from "public/NG"

interface FormInputProps {
  label: string
  type: string
  name?: string
  placeholder: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  error?: boolean
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  currency?: string
  currencyIcon?: React.ReactNode
  onCurrencyChange?: any
}

export const FormInputModule: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  value,
  name,
  onChange,
  className = "bg-[#120B20]",
  error = false,
  required = false,
  disabled = false,
  readOnly = false,
  currency = "NGN",
  currencyIcon = <NGIcon />,
  onCurrencyChange,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div
      className={`
        h-[90px] items-center rounded-md px-3 py-2 
        ${error ? "border-[#D14343]" : ""}
        ${isFocused ? "bg-[#120B20] ring-2 ring-[#8859EB]" : "bg-[#120B20]"}
        ${disabled ? "bg-gray-100" : ""}
        transition-all duration-200
      `}
    >
      <label className="mb-1 block text-sm text-[#F8F8F8]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div className="flex">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-4xl text-[#f8f8f8] outline-none disabled:cursor-not-allowed disabled:text-gray-500"
          value={value}
          name={name}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
        />

        {onCurrencyChange ? (
          <TokenDropdown
            selectedToken={{
              symbol: currency,
              icon: currencyIcon,
              name: currency === "NGN" ? "Naira" : "Tether",
            }}
            onSelect={onCurrencyChange}
          />
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-full bg-[#271E3D] p-2">
            {currencyIcon}
            <p className="text-white">{currency}</p>
          </div>
        )}
      </div>
    </div>
  )
}
