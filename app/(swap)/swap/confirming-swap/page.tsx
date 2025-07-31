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
import ArrowRightIcon from "public/arrow-right"

const ConfirmingSwap: React.FC = () => {
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
        <div className="flex h-auto flex-col rounded-lg bg-[#FFFFFF0F] px-5 py-4 max-sm:w-[95%] md:w-[586px] xl:w-[586px]">
          <div className="mb-6 flex items-center gap-2">
            <ArrowLeftIcon />
            <p className="text-xs text-[#F8F8F8]">Back</p>
          </div>
          <div className="w-full justify-center">
            <div className="mb-4 flex flex-col items-center justify-center">
              <h5 className="text-2xl font-medium text-[#F8F8F8]">Confirming swap</h5>

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
                  <p className="font-semibold text-[#F8F8F8]">Confirm swap</p>
                  <div className="mt-2 flex  items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                      <img src="/base.png" className=" w-10" />
                      <p className="text-xl text-[#f8f8f8]">150,000.00 cNGN</p>
                    </div>
                    <ArrowRightIcon />
                    <div className="flex items-center gap-2">
                      <img src="/bsc.png" className="w-10" />
                      <p className="text-xl text-[#f8f8f8]">150,000.00 cNGN</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[#8f8f8f]">Proceed in your wallet</p>
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
                  <p className="font-semibold text-[#F8F8F8]">Swap successful!</p>
                  <p className="text-center text-sm text-[#F8F8F8] md:px-10">
                    Your swap of 150,000.00 cNGN from Ethereum to Polygon has been successful.
                  </p>
                  <div className="mt-3 rounded-md bg-[#110B1F] p-2">
                    <p className="text-sm text-[#F8F8F8]">Tx: 0x7a23b5...e92f1c</p>
                  </div>
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

export default ConfirmingSwap
