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
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isBvnVerified, setIsBvnVerified] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(59 * 60) // 59 minutes in seconds

  // Bank details
  const [bankDetails] = useState({
    bankName: "Providus Bank",
    accountName: "Benny Mulla",
    accountNumber: "123456789",
    narration: "Yoswap on the go",
    amount: "₦15,000",
  })

  const router = useRouter()

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setDataLoaded(true)
    }, 1500)

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
      setTimeout(() => router.push("/transaction-status"), 1000)
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

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notify("success", "Copied!", {
          description: `${fieldName} copied to clipboard`,
          duration: 2000,
        })
      })
      .catch(() => {
        notify("error", "Failed to copy", {
          description: `Could not copy ${fieldName}`,
        })
      })
  }

  const handleCopyAmount = () => {
    handleCopy(bankDetails.amount.replace(/[^0-9]/g, ""), "Amount")
  }

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
            <div className="flex items-center justify-between">
              <div className="mb-4">
                <h5 className="text-2xl font-medium text-[#F8F8F8]">Transaction Status</h5>
                <p className="text-xs text-[#8F8F8F]">Transfer the NGN to the bank account provided below </p>
              </div>
              <div className="rounded-md bg-[#120C20] ">
                <p className="p-2 text-[#f8f8f8]">{formatTime(timeLeft)}</p>
              </div>
            </div>
            <div className="mb-3 flex w-full items-center justify-center gap-2">
              <p className="text-center text-2xl font-bold text-[#f8f8f8]">Amount: {bankDetails.amount}</p>
              <button
                type="button"
                onClick={handleCopyAmount}
                className="text-[#F8F8F8] transition-colors hover:text-[#B088FB]"
              >
                <CopyIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {!dataLoaded ? (
                <div className="mb-3 flex w-full flex-col gap-3 rounded-lg bg-[#120C20] p-4">
                  {/* Bank Name Skeleton */}
                  <div>
                    <div className="mb-1 h-4 w-24 animate-pulse rounded bg-[#1F1A2C]"></div>
                    <div className="h-4 w-32 animate-pulse rounded bg-[#1F1A2C]"></div>
                  </div>

                  {/* Account Name Skeleton */}
                  <div>
                    <div className="mb-1 h-4 w-28 animate-pulse rounded bg-[#1F1A2C]"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-40 animate-pulse rounded bg-[#1F1A2C]"></div>
                      <div className="h-4 w-4 animate-pulse rounded bg-[#1F1A2C]"></div>
                    </div>
                  </div>

                  {/* Account Number Skeleton */}
                  <div>
                    <div className="mb-1 h-4 w-32 animate-pulse rounded bg-[#1F1A2C]"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-32 animate-pulse rounded bg-[#1F1A2C]"></div>
                      <div className="h-4 w-4 animate-pulse rounded bg-[#1F1A2C]"></div>
                    </div>
                  </div>

                  {/* Narration Skeleton */}
                  <div>
                    <div className="mb-1 h-4 w-20 animate-pulse rounded bg-[#1F1A2C]"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-48 animate-pulse rounded bg-[#1F1A2C]"></div>
                      <div className="h-4 w-4 animate-pulse rounded bg-[#1F1A2C]"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex w-full flex-col gap-3 rounded-lg bg-[#120C20] p-4">
                  <div>
                    <p className="text-sm text-[#8F8F8F]">Bank Name</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#F8F8F8]">{bankDetails.bankName}</p>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankDetails.bankName, "Bank name")}
                        className="text-[#F8F8F8] transition-colors hover:text-[#B088FB]"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#8F8F8F]">Account Name</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#F8F8F8]">{bankDetails.accountName}</p>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankDetails.accountName, "Account name")}
                        className="text-[#F8F8F8] transition-colors hover:text-[#B088FB]"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#8F8F8F]">Account Number</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#F8F8F8]">{bankDetails.accountNumber}</p>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankDetails.accountNumber, "Account number")}
                        className="text-[#F8F8F8] transition-colors hover:text-[#B088FB]"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#8F8F8F]">Narration</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#F8F8F8]">{bankDetails.narration}</p>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankDetails.narration, "Narration")}
                        className="text-[#F8F8F8] transition-colors hover:text-[#B088FB]"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <p className="mb-3 text-xs text-[#F8F8F8]">
                After making the payment, click the button below to confirm. Your transaction will be processed once
                payment is verified.
              </p>

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
                  "I've sent the money"
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
