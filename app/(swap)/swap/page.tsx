"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { FormInputModule } from "components/ui/Input/Input"
import { ButtonModule } from "components/ui/Button/Button"
import Navbar from "components/Navbar/Navbar"
import SwitchBtnIcon from "public/switch-btn-icon"
import MenuIcon from "public/menu-icon"
import UsdtIcon from "public/usdt-icon"
import NGIcon from "public/NG"

import { notify } from "components/ui/Notification/Notification"
import InfoIcon from "public/info-icon"
import BuyIcon from "public/money-send-circle"
import SellIcon from "public/money-receive-circle"
import SwapIcon from "public/swap-icon"
import HistoryIcon from "public/history-icon"
import SupportIcon from "public/support-icon"

const Buy: React.FC = () => {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSwitched, setIsSwitched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [buyCurrency, setBuyCurrency] = useState({
    symbol: "NGN",
    icon: <NGIcon />,
    name: "Naira",
  })
  const [receiveCurrency, setReceiveCurrency] = useState({
    symbol: "USDT",
    icon: <UsdtIcon />,
    name: "Tether",
  })
  const [showFees, setShowFees] = useState(false)
  const [calculatingFees, setCalculatingFees] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const router = useRouter()

  const handleSwitch = () => {
    setIsSwitched(!isSwitched)
    // Swap currencies
    const temp = buyCurrency
    setBuyCurrency(receiveCurrency)
    setReceiveCurrency(temp)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)

    if (value.trim() === "") {
      setShowFees(false)
      return
    }

    // Simulate fee calculation
    setCalculatingFees(true)
    setTimeout(() => {
      setCalculatingFees(false)
      setShowFees(true)
    }, 1000)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      notify("success", "Login successful!", {
        description: "Redirecting to dashboard...",
        duration: 1000,
      })
      setTimeout(() => router.push("/swap/wallet-connected"), 1000)
    } catch (error: any) {
      const errorMessage = "Login failed. Please try again."
      setError(errorMessage)
      notify("error", "Login failed", {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuAction = (action: string) => {
    setIsMenuOpen(false)
    switch (action) {
      case "buy":
        router.push("/buy")
        break
      case "sell":
        router.push("/sell")
        break
      case "swap":
        router.push("/swap")
        break
      case "history":
        router.push("/history")
        break
      case "support":
        router.push("/support")
        break
      default:
        break
    }
  }

  return (
    <section className="relative flex h-screen flex-col bg-[#110B1F] px-4 py-2 md:px-16 md:py-4">
      <div className="absolute top-14 overflow-hidden">
        <img src="/bg-image.png" alt="Background" />
      </div>

      <Navbar loading={loading} />

      <div className="relative flex w-full flex-col items-center max-sm:mt-10 md:mt-0">
        <div className="flex h-auto flex-col rounded-lg bg-[#FFFFFF0F] px-5 py-8 max-sm:w-[95%] md:w-[586px] xl:w-[586px]">
          <div className="mb-4 flex w-full items-center justify-between">
            <div className="relative">
              <button onClick={toggleMenu}>
                <MenuIcon />
              </button>
              {isMenuOpen && (
                <div className="absolute left-0 top-10 z-50 w-48 rounded-md bg-[#1F1A2C] shadow-lg">
                  <div className="py-1">
                    <button
                      onClick={() => handleMenuAction("/")}
                      className=" flex w-full gap-2 px-4 py-2 text-left text-sm text-white hover:bg-[#B088FB]"
                    >
                      <BuyIcon />
                      Buy
                    </button>
                    <button
                      onClick={() => handleMenuAction("sell")}
                      className=" flex w-full gap-2 px-4 py-2 text-left text-sm text-white hover:bg-[#B088FB]"
                    >
                      <SellIcon />
                      Sell
                    </button>
                    <button
                      onClick={() => handleMenuAction("swap")}
                      className=" flex w-full gap-2 px-4 py-2 text-left text-sm text-white hover:bg-[#B088FB]"
                    >
                      <SwapIcon />
                      Swap
                    </button>
                    <button
                      onClick={() => handleMenuAction("history")}
                      className=" flex w-full gap-2 px-4 py-2 text-left text-sm text-white hover:bg-[#B088FB]"
                    >
                      <HistoryIcon />
                      Transaction History
                    </button>
                    <button
                      onClick={() => handleMenuAction("support")}
                      className=" flex w-full gap-2 px-4 py-2 text-left text-sm text-white hover:bg-[#B088FB]"
                    >
                      <SupportIcon />
                      Support
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <ButtonModule type="button" variant="secondary" size="md">
                Buy
              </ButtonModule>
              <ButtonModule type="button" variant="secondary" size="md">
                Sell
              </ButtonModule>
              <ButtonModule type="button" variant="primary" size="md">
                Swap
              </ButtonModule>
            </div>
          </div>
          <div className="w-full justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
              <div className="relative w-full">
                <FormInputModule
                  label="Buy"
                  type="number"
                  placeholder="Min 15,000"
                  value={amount}
                  onChange={handleAmountChange}
                  currency={buyCurrency.symbol}
                  currencyIcon={buyCurrency.icon}
                  onCurrencyChange={setBuyCurrency}
                />

                <button
                  type="button"
                  className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                  onClick={handleSwitch}
                >
                  <SwitchBtnIcon />
                </button>

                <div className="mt-4">
                  <FormInputModule
                    label="You Receive"
                    type="number"
                    placeholder="0"
                    value={amount ? (parseFloat(amount) / 1500).toFixed(6) : ""}
                    onChange={() => {}}
                    currency={receiveCurrency.symbol}
                    currencyIcon={receiveCurrency.icon}
                    onCurrencyChange={setReceiveCurrency}
                    readOnly
                  />
                </div>
              </div>

              <div className="my-4 flex w-full justify-between">
                <p className="text-[#AFB4C0]">1 USDT = 1,500 NGN</p>
                <p className="text-[#AFB4C0]">Network • BEP20</p>
              </div>

              {calculatingFees && (
                <div className="flex w-full flex-col gap-3 rounded-lg bg-[#120C20] p-4">
                  {/* YoSwap Fee Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-20 animate-pulse rounded bg-[#1F1A2C]"></div>
                      <InfoIcon />
                    </div>
                    <div className="h-4 w-16 animate-pulse rounded bg-[#1F1A2C]"></div>
                  </div>

                  {/* Blockchain Fee Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-24 animate-pulse rounded bg-[#1F1A2C]"></div>
                      <InfoIcon />
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="h-4 w-16 animate-pulse rounded bg-[#1F1A2C]"></div>
                      <div className="mt-1 h-3 w-12 animate-pulse rounded bg-[#1F1A2C]"></div>
                    </div>
                  </div>

                  {/* Payment Gateway Fee Skeleton */}
                  <div className="flex items-center justify-between border-b border-[#1F1A2C] pb-1">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-28 animate-pulse rounded bg-[#1F1A2C]"></div>
                      <InfoIcon />
                    </div>
                    <div className="h-4 w-16 animate-pulse rounded bg-[#1F1A2C]"></div>
                  </div>

                  {/* Total Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-12 animate-pulse rounded bg-[#1F1A2C]"></div>
                      <InfoIcon />
                    </div>
                    <div className="h-5 w-20 animate-pulse rounded bg-[#FFFFFF0D]"></div>
                  </div>

                  {/* Payment Method Skeleton */}
                  <div className="flex w-full items-center gap-3 rounded-md bg-[#FFFFFF0D] p-4">
                    <div className="h-4 w-28 animate-pulse rounded bg-[#FFFFFF0D]"></div>
                    <div className="h-6 w-32 animate-pulse rounded-md bg-[#FFFFFF0D]"></div>
                  </div>
                </div>
              )}

              {showFees && !calculatingFees && (
                <div className="flex w-full flex-col gap-3 rounded-lg bg-[#120C20] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-[#8F8F8F]">YoSwap</p>
                      <InfoIcon />
                    </div>
                    <div>
                      <p className="text-sm text-[#F8F8F8]">₦0.00</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-[#8F8F8F]">Blockchain fee</p>
                      <InfoIcon />
                    </div>
                    <div>
                      <p className="text-end text-sm text-[#ffffff]">₦0.00</p>
                      <p className="text-sm text-[#F8F8F8]">(0 USDT)</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1F1A2C] pb-1">
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-[#8F8F8F]">Payment gateway fee</p>
                      <InfoIcon />
                    </div>
                    <div>
                      <p className="text-end text-sm text-[#F8F8F8]">₦360.00</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-[#F8F8F8]">Total</p>
                      <InfoIcon />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F8F8F8]">₦{(parseFloat(amount) + 360).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              <ButtonModule
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !amount.trim()}
                className="mt-6 w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Continue"
                )}
              </ButtonModule>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Buy
