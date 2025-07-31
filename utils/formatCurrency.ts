export const formatCurrency = (value: number | string, currency: string = ""): string => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value

  if (isNaN(numericValue)) {
    return `${currency} 0.00`
  }

  const formattedValue = numericValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return `${currency} ${formattedValue}`
}
