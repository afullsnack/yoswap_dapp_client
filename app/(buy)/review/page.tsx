"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import Navbar from "components/Navbar/Navbar"
import { BVNInputModule } from "components/ui/Input/PasswordInput"
import ArrowLeftIcon from "public/arrow-left"
import InfoIcon from "public/info-icon"
import BankIcon from "public/bank-icon"
import Bep20 from "public/bep-20"
import CopyIcon from "public/copy-icon"

const ReviewOrder: React.FC = () => {
  const [loading, setLoading] = useState(true) // Start with loading true
  const [dataLoaded, setDataLoaded] = useState(false) // New state to track when data is loaded
  const [error, setError] = useState<string | null>(null)
  const [isBvnVerified, setIsBvnVerified] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [walletAddress] = useState("0x2aBcdef1234567890abcdef1234567890c905") // Full wallet address

  const router = useRouter()

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setDataLoaded(true)
    }, 1500) // Simulate 1.5 second loading time

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)

    try {
      notify("success", "Verification successful!", {
        description: "Redirecting to dashboard...",
        duration: 1000,
      })
      setTimeout(() => router.push("/transfer"), 1000)
    } catch (error: any) {
      const errorMessage = "Verification failed. Please try again."
      setError(errorMessage)
      notify("error", "Verification failed", {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(walletAddress)
      .then(() => {
        notify("success", "Copied!", {
          description: "Wallet address copied to clipboard",
          duration: 2000,
        })
      })
      .catch(() => {
        notify("error", "Failed to copy", {
          description: "Please try again",
        })
      })
  }

  const displayWalletAddress = `${walletAddress.substring(0, 5)}...${walletAddress.substring(walletAddress.length - 5)}`

  return (
    <section className="relative flex h-screen flex-col bg-[#110B1F] px-4 py-2 md:px-16 md:py-4">
      <div className="absolute top-14 overflow-hidden">
        <img src="/bg-image.png" alt="Background" />
      </div>

      <Navbar loading={loading} />

      <div className="relative flex w-full flex-col items-center max-sm:mt-10 md:mt-0">
        <div className="flex h-auto rounded-lg bg-[#FFFFFF0F] px-5 py-4 max-sm:w-[95%] md:w-[586px] xl:w-[586px]">
          <div className="w-full justify-center">
            <div className="mb-6 flex items-center gap-2">
              <ArrowLeftIcon />
              <p className="text-xs text-[#F8F8F8]">Back</p>
            </div>
            <div className="mb-4">
              <h5 className="text-2xl font-medium text-[#F8F8F8]">Review Order</h5>
              <p className="text-xs text-[#8F8F8F]">
                Please review the details of the order before submitting your request.{" "}
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              {!dataLoaded ? (
                <div className="mb-3 flex w-full flex-col gap-3 rounded-lg bg-[#120C20] p-4">
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
              ) : (
                <div className="mb-4 flex w-full flex-col gap-3 rounded-lg bg-[#120C20] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-[#8F8F8F]">Bank transfer amount</p>
                      <InfoIcon />
                    </div>
                    <div>
                      <p className="text-sm text-[#F8F8F8]">₦15,000.00</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-[#8F8F8F]">USDT Amount</p>
                      <InfoIcon />
                    </div>
                    <div>
                      <p className="text-end text-sm text-[#ffffff]">10 USDT</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-[#8F8F8F]">Wallet address</p>
                      <InfoIcon />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-end text-sm text-[#F8F8F8]">BEP20</p>
                      <Bep20 />
                      <p className="text-end text-sm text-[#F8F8F8]">{displayWalletAddress}</p>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="text-[#F8F8F8] transition-colors hover:text-[#B088FB]"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  </div>

                  <div className="flex w-full items-center gap-3 rounded-md bg-[#FFFFFF0D] p-4">
                    <p className="text-sm text-[#F8F8F8]">Payment method</p>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-md bg-[#120C20] p-1 text-xs text-[#F8F8F8] transition-all duration-300 ease-in-out hover:bg-[#B088FB]"
                    >
                      <BankIcon /> BANK TRANSFER
                    </button>
                  </div>
                </div>
              )}

              <ButtonModule type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
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
                  "Transfer funds"
                )}
              </ButtonModule>

              <ButtonModule
                type="button"
                variant="outline"
                size="lg"
                className="mt-4 w-full"
                onClick={() => router.back()}
              >
                Cancel
              </ButtonModule>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReviewOrder
