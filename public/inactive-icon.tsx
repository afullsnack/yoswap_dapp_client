// OtechPlusIcon.tsx
import React from "react"

export interface IconProps {
  className?: string
}

const InactiveIcon: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="2" width="20" height="20" rx="10" stroke="#8F8F8F" stroke-width="2" />
    </svg>
  )
}

export default InactiveIcon
