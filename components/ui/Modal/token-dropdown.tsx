// components/ui/Dropdown/TokenDropdown.tsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import NGIcon from "public/NG"
import UsdtIcon from "public/usdt-icon"
import { ChevronDown } from "lucide-react"

interface Token {
  symbol: string
  icon: React.ReactNode
  name: string
}

interface TokenDropdownProps {
  selectedToken: Token
  onSelect: (token: Token) => void
}

const tokens: Token[] = [
  { symbol: "NGN", icon: <NGIcon />, name: "Naira" },
  { symbol: "USDT", icon: <UsdtIcon />, name: "Tether" },
  // Add more tokens as needed
]

const TokenDropdown: React.FC<TokenDropdownProps> = ({ selectedToken, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-full bg-[#271E3D] p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedToken.icon}
        <p className="text-white">{selectedToken.symbol}</p>
        <ChevronDown className={`h-4 w-4 text-white transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-[#1E1338] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {tokens.map((token) => (
              <button
                key={token.symbol}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-[#271E3D] ${
                  selectedToken.symbol === token.symbol ? "bg-[#271E3D]" : ""
                }`}
                onClick={() => {
                  onSelect(token)
                  setIsOpen(false)
                }}
              >
                <div className="flex h-6 w-6 items-center justify-center">{token.icon}</div>
                <div>
                  <p className="font-medium text-white">{token.symbol}</p>
                  <p className="text-xs text-gray-400">{token.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TokenDropdown
