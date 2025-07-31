// BVNInputModule.tsx
"use client"
import React, { useState, useEffect } from "react"
import { RiCheckLine } from "react-icons/ri"

interface BVNInputProps {
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  error?: boolean
  onVerify?: (bvn: string) => Promise<boolean>
}

export const BVNInputModule: React.FC<BVNInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  className = "",
  error = false,
  onVerify,
}) => {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timer])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange(e)
    setIsVerified(false)

    // Clear previous timer
    if (timer) clearTimeout(timer)

    // Only verify if length is 11
    if (value.length === 11 && onVerify) {
      setIsVerifying(true)
      const newTimer = setTimeout(async () => {
        try {
          const isValid = await onVerify(value)
          setIsVerified(isValid)
        } catch (error) {
          setIsVerified(false)
        } finally {
          setIsVerifying(false)
        }
      }, 1500) // 1.5 second delay before verification
      setTimer(newTimer)
    } else {
      setIsVerifying(false)
    }
  }

  return (
    <div className={` ${className}`}>
      <label className="mb-1 block text-sm text-[#f8f8f8]">{label}</label>
      <div
        className={`
        flex h-[46px] items-center rounded-md border px-3
        py-2 ${error ? "border-[#D14343]" : "border-[#120C20]"}
        ${isFocused ? "bg-[#120C20] ring-2 ring-[#8859EB]" : "bg-[#120C20]"}
        transition-all duration-200
      `}
      >
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-base text-[#f8f8f8] outline-none"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={11}
        />
        <div className="ml-2 h-5 w-5">
          {isVerifying ? (
            <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="angularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B088FB" />
                  <stop offset="100%" stopColor="#8859EB" />
                </linearGradient>
              </defs>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="url(#angularGradient)" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="url(#angularGradient)"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : isVerified ? (
            <RiCheckLine className="h-5 w-5 text-green-500" />
          ) : null}
        </div>
      </div>
    </div>
  )
}
