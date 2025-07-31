"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import Navbar from "components/Navbar/Navbar"
import ArrowLeftIcon from "public/arrow-left"

const TransactionStatus: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [transactionStatus, setTransactionStatus] = useState<"pending" | "success" | "failed">("pending")
  const [countdown, setCountdown] = useState(5)

  const router = useRouter()

  useEffect(() => {
    if (transactionStatus !== "pending") return

    const stepTimers = [
      setTimeout(() => setCurrentStep(2), 2000),
      setTimeout(() => setCurrentStep(3), 4000),
      setTimeout(() => {
        setCurrentStep(4)
        setTransactionStatus("success")
      }, 6000),
    ]

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      stepTimers.forEach((timer) => clearTimeout(timer))
      clearInterval(countdownInterval)
    }
  }, [transactionStatus])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      notify("success", "Transaction completed!", {
        description: "Redirecting to dashboard...",
        duration: 1000,
      })
      setTimeout(() => router.push("/"), 1000)
    } catch (error) {
      notify("error", "Transaction failed", {
        description: "Please try again",
      })
      setTransactionStatus("failed")
    } finally {
      setLoading(false)
    }
  }

  const handleNewTransaction = () => {
    setCurrentStep(1)
    setTransactionStatus("pending")
    setCountdown(5)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
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
            <p className="font-semibold text-[#F8F8F8]">Looking for 100USDT deposit</p>
            <p className="my-2 w-[388px] text-center text-xs text-[#F8F8F8]">Verifying your transaction...</p>
            <p className="w-[388px] text-center text-xs text-[#8F8F8F]">This usually takes less than a minute</p>
          </>
        )
      case 2:
        return (
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
            <p className="font-semibold text-[#F8F8F8]">Converting Crypto to Fiat</p>
            <p className="my-2 w-[388px] text-center text-xs text-[#F8F8F8]">Converting Crypto</p>
            <p className="w-[388px] text-center text-xs text-[#8F8F8F]">
              Just wait a few seconds as we sell your crypto to get Fiat currency
            </p>
          </>
        )
      case 3:
        return (
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
            <p className="font-semibold text-[#F8F8F8]"> Sending Money to Bank</p>
            <p className="my-2 w-[388px] text-center text-xs text-[#F8F8F8]">Sending Money...</p>
            <p className="w-[388px] text-center text-xs text-[#8F8F8F]">
              We’ve sold your crypto. Now, we’ll send the money to your bank account.
            </p>
          </>
        )
      case 4:
        return (
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
            <p className="my-2 w-[388px] text-center text-xs text-[#F8F8F8]">
              We have successfully sent the money to your bank account. It may take 2 minutes for the amount to reflect.
            </p>
            <p className="text-xs text-[#8F8F8F]">You may now close this window.</p>
          </>
        )
      default:
        return null
    }
  }

  const renderProgressSteps = () => {
    return <div className="mb-6 flex items-center justify-between px-4"></div>
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
            <div className="mb-6 flex cursor-pointer items-center gap-2" onClick={() => router.back()}>
              <ArrowLeftIcon />
              <p className="text-xs text-[#F8F8F8]">Back</p>
            </div>
            <div className="mb-4">
              <h5 className="text-2xl font-medium text-[#F8F8F8]">
                {currentStep === 4 ? "Transaction Complete" : "Confirming Transaction"}
              </h5>
            </div>

            {renderProgressSteps()}

            <div className="mb-6 flex flex-col items-center justify-center">{renderStepContent()}</div>

            <form onSubmit={handleSubmit}>
              {currentStep === 4 ? (
                <>
                  <ButtonModule
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleNewTransaction}
                  >
                    New Transaction
                  </ButtonModule>
                  <ButtonModule
                    type="button"
                    variant="outline"
                    size="lg"
                    className="mt-4 w-full"
                    onClick={() => router.push("/")}
                  >
                    Back to Dashboard
                  </ButtonModule>
                </>
              ) : (
                <ButtonModule
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setTransactionStatus("failed")
                    notify("error", "Transaction cancelled", {
                      description: "You cancelled the transaction",
                    })
                  }}
                >
                  Cancel Transaction
                </ButtonModule>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TransactionStatus
