"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import Navbar from "components/Navbar/Navbar"
import ArrowLeftIcon from "public/arrow-left"
import InfoIcon from "public/info-icon"
import BankIcon from "public/bank-icon"
import Bep20 from "public/bep-20"
import CopyIcon from "public/copy-icon"

const TransactionStatus: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress] = useState("0x2aBcdef1234567890abcdef1234567890c905")
  const [transactionStatus, setTransactionStatus] = useState<"pending" | "success" | "failed">("pending")

  const router = useRouter()

  // Simulate data loading and transaction completion
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false)
      setDataLoaded(true)
    }, 1500)

    // Simulate transaction completion after 5 seconds
    const statusTimer = setTimeout(() => {
      setTransactionStatus("success")
    }, 5000)

    return () => {
      clearTimeout(loadingTimer)
      clearTimeout(statusTimer)
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      notify("success", "Verification successful!", {
        description: "Redirecting to dashboard...",
        duration: 1000,
      })
      setTimeout(() => router.push("/"), 1000)
    } catch (error: any) {
      const errorMessage = "Verification failed. Please try again."
      setError(errorMessage)
      notify("error", "Verification failed", {
        description: errorMessage,
      })
      setTransactionStatus("failed")
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
            <div className="mb-4 flex flex-col items-center justify-center">
              <h5 className="text-2xl font-medium text-[#F8F8F8]">Transaction Status</h5>

              {transactionStatus === "pending" ? (
                <>
                  <div className="my-4">
                    <svg
                      className="h-12 w-12 animate-spin text-[#F8F8F8]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 200 200"
                    >
                      <radialGradient id="a11" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
                        <stop offset="0" stopColor="#F8F8F8"></stop>
                        <stop offset=".3" stopColor="#F8F8F8" stopOpacity=".9"></stop>
                        <stop offset=".6" stopColor="#F8F8F8" stopOpacity=".6"></stop>
                        <stop offset=".8" stopColor="#F8F8F8" stopOpacity=".3"></stop>
                        <stop offset="1" stopColor="#F8F8F8" stopOpacity="0"></stop>
                      </radialGradient>
                      <circle
                        style={{ transformOrigin: "center" }}
                        fill="none"
                        stroke="url(#a11)"
                        strokeWidth="20"
                        strokeLinecap="round"
                        strokeDasharray="200 1000"
                        strokeDashoffset="0"
                        cx="100"
                        cy="100"
                        r="65"
                      >
                        <animateTransform
                          type="rotate"
                          attributeName="transform"
                          calcMode="spline"
                          dur="2"
                          values="360;0"
                          keyTimes="0;1"
                          keySplines="0 0 1 1"
                          repeatCount="indefinite"
                        ></animateTransform>
                      </circle>
                      <circle
                        style={{ transformOrigin: "center" }}
                        fill="none"
                        opacity=".2"
                        stroke="#F8F8F8"
                        strokeWidth="20"
                        strokeLinecap="round"
                        cx="100"
                        cy="100"
                        r="65"
                      ></circle>
                    </svg>
                  </div>
                  <p className="font-semibold text-[#F8F8F8]">Order in Progress...</p>
                  <p className="text-xs text-[#F8F8F8]">Expected waiting time: 30 seconds</p>
                </>
              ) : transactionStatus === "success" ? (
                <>
                  <div className="my-4 text-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-semibold text-[#F8F8F8]">Transaction Successful!</p>
                  <p className="text-xs text-[#F8F8F8]">Your transaction has been completed</p>
                </>
              ) : (
                <>
                  <div className="my-4 text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="font-semibold text-[#F8F8F8]">Transaction Failed</p>
                  <p className="text-xs text-[#F8F8F8]">Please try again</p>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              {!dataLoaded ? (
                <div className="mb-3 flex w-full flex-col gap-3 rounded-lg bg-[#120C20] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-20 animate-pulse rounded bg-[#1F1A2C]"></div>
                      <InfoIcon />
                    </div>
                    <div className="h-4 w-16 animate-pulse rounded bg-[#1F1A2C]"></div>
                  </div>

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

                  <div className="flex items-center justify-between border-b border-[#1F1A2C] pb-1">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-28 animate-pulse rounded bg-[#1F1A2C]"></div>
                      <InfoIcon />
                    </div>
                    <div className="h-4 w-16 animate-pulse rounded bg-[#1F1A2C]"></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-12 animate-pulse rounded bg-[#1F1A2C]"></div>
                      <InfoIcon />
                    </div>
                    <div className="h-5 w-20 animate-pulse rounded bg-[#FFFFFF0D]"></div>
                  </div>

                  <div className="flex w-full items-center gap-3 rounded-md bg-[#FFFFFF0D] p-4">
                    <div className="h-4 w-28 animate-pulse rounded bg-[#FFFFFF0D]"></div>
                    <div className="h-6 w-32 animate-pulse rounded-md bg-[#FFFFFF0D]"></div>
                  </div>
                </div>
              ) : transactionStatus === "success" ? (
                <div className="mb-4 flex w-full flex-col gap-3 rounded-lg bg-[#120C20] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8F8F8F]">Transaction Type</p>
                    <p className="text-sm text-[#F8F8F8]">Buy USDT</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8F8F8F]">Amount</p>
                    <p className="text-sm text-[#F8F8F8]">1,000 USDT</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8F8F8F]">Trx ID</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#F8F8F8]">1234567899</p>
                      <button onClick={() => handleCopy("1234567899", "Transaction ID")}>
                        <CopyIcon />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8F8F8F]">Timestamp</p>
                    <p className="text-sm text-[#F8F8F8]">14:32 | 25/06/2025</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8F8F8F]">Hash</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#F8F8F8]">34567890...56789</p>
                      <button onClick={() => handleCopy("34567890-098765456789", "Transaction Hash")}>
                        <CopyIcon />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8F8F8F]">Wallet Address</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#F8F8F8]">0x54e...3456</p>
                      <button onClick={() => handleCopy("0x54e3456", "Wallet Address")}>
                        <CopyIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex w-full flex-col gap-3 rounded-lg bg-[#120C20] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8F8F8F]">Bank transfer amount</p>
                    <p className="text-sm text-[#F8F8F8]">₦15,000.00</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8F8F8F]">USDT Amount</p>
                    <p className="text-end text-sm text-[#ffffff]">10 USDT</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8F8F8F]">Price</p>
                    <p className="text-end text-sm text-[#F8F8F8]">1 USDT = ₦1,500</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8F8F8F]">Total Fees</p>
                    <p className="text-end text-sm text-[#F8F8F8]">₦350</p>
                  </div>
                </div>
              )}

              {transactionStatus === "success" && (
                <>
                  <ButtonModule type="submit" variant="primary" size="lg" className="w-full">
                    New Transaction
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
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TransactionStatus
