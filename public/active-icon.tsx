// OtechPlusIcon.tsx
import React from "react"

export interface IconProps {
  className?: string
}

const ActiveIcon: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="2" width="20" height="20" rx="10" stroke="#B088FB" stroke-width="2" />
      <circle cx="11" cy="12" r="6" fill="#B088FB" />
    </svg>
  )
}

export default ActiveIcon
