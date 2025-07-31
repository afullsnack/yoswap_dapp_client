"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import Navbar from "components/Navbar/Navbar"
import ArrowLeftIcon from "public/arrow-left"
import InfoIcon from "public/info-icon"
import ApproveIcon from "public/approve"

const ApproveTransaction: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress] = useState("0x2aBcdef1234567890abcdef1234567890c905")

  const router = useRouter()

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
      setTimeout(() => router.push("/sell/transaction-status"), 1000)
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
              <h5 className="text-2xl font-medium text-[#F8F8F8]">Approve wallet transfer</h5>
              <p className="text-xs text-[#8F8F8F]">Transfer the NGN to the bank account provided below </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
              <ApproveIcon />
              <p className="mb-4 px-20 text-center text-sm text-[#f8f8f8]">
                The wallet will request you to transfer 100 USDT to our address. Approve the request to continue
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
                  "Approve"
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

export default ApproveTransaction
