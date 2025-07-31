// app/(auth)/BVN.tsx
"use client"
import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import Navbar from "components/Navbar/Navbar"
import ArrowLeftIcon from "public/arrow-left"

interface OtpInputProps {
  value: string
  onChange: (otp: string) => void
  onVerify?: (otp: string) => Promise<boolean>
  length?: number
  className?: string
}

const OtpInputModule: React.FC<OtpInputProps> = ({ value = "", onChange, onVerify, length = 6, className = "" }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const [activeInput, setActiveInput] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (value.length === 0) {
      setOtp(Array(length).fill(""))
    }
  }, [value, length])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digit characters

    if (value === "") {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1) // Only take the last character
    setOtp(newOtp)

    const combinedOtp = newOtp.join("")
    onChange(combinedOtp)

    // Auto focus next input
    if (value && index < length - 1) {
      setActiveInput(index + 1)
    }

    // Verify if all fields are filled
    if (combinedOtp.length === length && onVerify) {
      verifyOtp(combinedOtp)
    } else {
      setIsVerified(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "")
    if (pastedData.length === length) {
      const newOtp = pastedData.split("").slice(0, length)
      setOtp(newOtp)
      onChange(newOtp.join(""))
      if (onVerify) {
        verifyOtp(newOtp.join(""))
      }
      setActiveInput(length - 1)
    }
  }

  const verifyOtp = async (otp: string) => {
    setIsVerifying(true)
    try {
      if (onVerify) {
        const isValid = await onVerify(otp)
        setIsVerified(isValid)
      }
    } catch (error) {
      setIsVerified(false)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="mb-1 flex justify-center gap-4">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={otp[index] || ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={() => setActiveInput(index)}
            className={`h-12 w-12 rounded-md border bg-[#120C20] text-center text-[#f8f8f8] outline-none transition-all duration-200 ${
              activeInput === index ? "border-[#8859EB] ring-2 ring-[#8859EB]" : "border-[#120C20]"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center">
        {isVerifying ? (
          <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : isVerified ? (
          <span className="text-sm text-green-500">Verified</span>
        ) : null}
      </div>
    </div>
  )
}

const VerificationCode: React.FC = () => {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(59)

  const router = useRouter()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleGoBack = () => {
    router.back()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isOtpVerified) {
      notify("error", "OTP Verification Required", {
        description: "Please enter and verify the OTP before proceeding",
      })
      return
    }

    setLoading(true)

    try {
      notify("success", "Verification successful!", {
        description: "Redirecting to review...",
        duration: 1000,
      })
      setTimeout(() => router.push("/liveness-checker"), 1000)
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

  const handleOtpVerification = async (otp: string) => {
    // Simple validation - replace with real API call
    const isValid = otp.length === 6 && /^\d+$/.test(otp)

    if (isValid) {
      setIsOtpVerified(true)
      const mockUserName = "Young Beni Mulla" // Replace with actual API response
      setUserName(mockUserName)
    } else {
      setIsOtpVerified(false)
      setUserName(null)
    }

    return isValid
  }

  const handleResendCode = () => {
    // Add your resend code logic here
    setCountdown(59)
    notify("info", "New code sent", {
      description: "A new verification code has been sent to your email",
    })
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
            <div className="mb-6 flex cursor-pointer items-center gap-2" onClick={handleGoBack}>
              <ArrowLeftIcon />
              <p className="text-xs text-[#F8F8F8]">Back</p>
            </div>
            <div className="mb-4">
              <h5 className="text-2xl font-medium text-[#F8F8F8]">Enter the verification code</h5>
              <p className="text-xs text-[#F8F8F8]">
                We've sent the code to <span className="text-[#B088FB]">bennymulla@crossfiat.com</span>
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <OtpInputModule value={otp} onChange={setOtp} onVerify={handleOtpVerification} />

              <p className="mb-10 mt-4 text-[#B088FB] transition-all duration-300 ease-in-out">
                {countdown > 0 ? (
                  `Resend Code: (00:${countdown.toString().padStart(2, "0")})`
                ) : (
                  <button type="button" onClick={handleResendCode} className="underline hover:text-[#8859EB]">
                    Resend Code
                  </button>
                )}
              </p>
              <ButtonModule
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !isOtpVerified}
                className="w-full"
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

export default VerificationCode
