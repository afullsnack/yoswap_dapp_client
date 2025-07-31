// app/(auth)/BVN.tsx
"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import Navbar from "components/Navbar/Navbar"

import ArrowLeftIcon from "public/arrow-left"
import { EmailInputModule } from "components/ui/Input/EmailInputModule"

const LinkEmail: React.FC = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const router = useRouter()

  const handleGoBack = () => {
    router.back() // Navigates to the previous page in history
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isEmailVerified) {
      notify("error", "Email Verification Required", {
        description: "Please verify your email before proceeding",
      })
      return
    }

    setLoading(true)

    try {
      notify("success", "Verification successful!", {
        description: "Redirecting to review...",
        duration: 1000,
      })
      setTimeout(() => router.push("/verification-code"), 1000)
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

  const handleEmailVerification = async (email: string) => {
    // Simple email validation - replace with real API call
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (isValid) {
      setIsEmailVerified(true)
      const mockUserName = "Young Beni Mulla" // Replace with actual API response
      setUserName(mockUserName)
    } else {
      setIsEmailVerified(false)
      setUserName(null)
    }

    return isValid
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
              <h5 className="text-2xl font-medium text-[#F8F8F8]">Link e-mail to continue</h5>
              <p className="text-xs text-[#F8F8F8]">Please add your e-mail for account updates</p>
            </div>
            <form onSubmit={handleSubmit}>
              <EmailInputModule
                label="Email Address"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onVerify={handleEmailVerification}
              />
              {isEmailVerified && userName ? (
                <p className="mb-3 mt-1 text-sm font-medium text-[#f8f8f8]">{userName}</p>
              ) : (
                <p></p>
              )}

              <p className="mb-10 mt-1  text-sm text-[#F8F8F8]">
                By clicking Continue, you agree to the{" "}
                <span className="underline transition-all duration-300 ease-in-out hover:text-[#B088FB]">
                  Terms and Conditions
                </span>{" "}
                and{" "}
                <span className="underline transition-all duration-300 ease-in-out hover:text-[#B088FB]">
                  Privacy Policy
                </span>{" "}
                of crossfiat.com
              </p>
              <ButtonModule
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !isEmailVerified}
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

export default LinkEmail
