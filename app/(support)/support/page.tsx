"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import Navbar from "components/Navbar/Navbar"
import SupportIcon from "public/support-icon"
import SwapIcon from "public/swap-icon"
import SellIcon from "public/money-receive-circle"
import BuyIcon from "public/money-send-circle"
import MenuIcon from "public/menu-icon"
import HistoryIcon from "public/history-icon"
import { Check, ChevronDown } from "lucide-react"

const SupportPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Form states
  const [email, setEmail] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [issueCategory, setIssueCategory] = useState("")
  const [description, setDescription] = useState("")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  const router = useRouter()

  const issueCategories = [
    "Transaction Issues",
    "Account Problems",
    "Verification",
    "Payment Disputes",
    "Technical Problems",
    "Other",
  ]

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email || !transactionId || !issueCategory || !description) {
      notify("error", "Incomplete Form", {
        description: "Please fill all required fields",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      notify("success", "Support Request Submitted", {
        description: "We'll get back to you shortly",
        duration: 3000,
      })
      // Reset form
      setEmail("")
      setTransactionId("")
      setIssueCategory("")
      setDescription("")
    } catch (error: any) {
      const errorMessage = "Submission failed. Please try again."
      setError(errorMessage)
      notify("error", "Submission Failed", {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
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
            <div className="mb-6 flex cursor-pointer items-center gap-2">
              <div className="relative flex w-full items-center justify-between">
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
                <p className="text-center text-3xl text-[#f8f8f8]">Support</p>
                <p></p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-1 block text-sm text-[#f8f8f8]">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-[46px] w-full items-center rounded-md border border-[#120C20] bg-[#120C20] px-3 py-2 text-base text-[#f8f8f8] outline-none focus:ring-2 focus:ring-[#8859EB]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm text-[#f8f8f8]">Transaction ID (if applicable)</label>
                <input
                  type="text"
                  placeholder="Enter transaction ID"
                  className="flex h-[46px] w-full items-center rounded-md border border-[#120C20] bg-[#120C20] px-3 py-2 text-base text-[#f8f8f8] outline-none focus:ring-2 focus:ring-[#8859EB]"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm text-[#f8f8f8]">Issue Category</label>
                <div className="relative">
                  <button
                    type="button"
                    className="flex h-[46px] w-full items-center justify-between rounded-md border border-[#120C20] bg-[#120C20] px-3 py-2 text-left text-base text-[#f8f8f8] outline-none focus:ring-2 focus:ring-[#8859EB]"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  >
                    {issueCategory || "Select issue category"}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isCategoryOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-[#120C20] bg-[#120C20] shadow-lg">
                      <div className="max-h-60 overflow-y-auto">
                        {issueCategories.map((category) => (
                          <div
                            key={category}
                            className={`flex cursor-pointer items-center justify-between px-4 py-2 text-[#f8f8f8] hover:bg-[#8859EB]/10 ${
                              issueCategory === category ? "bg-[#8859EB]/20" : ""
                            }`}
                            onClick={() => {
                              setIssueCategory(category)
                              setIsCategoryOpen(false)
                            }}
                          >
                            <span>{category}</span>
                            {issueCategory === category && <Check className="h-4 w-4 text-[#8859EB]" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm text-[#f8f8f8]">Description</label>
                <textarea
                  placeholder="Describe your issue in detail"
                  rows={4}
                  className="flex w-full items-center rounded-md border border-[#120C20] bg-[#120C20] px-3 py-2 text-base text-[#f8f8f8] outline-none focus:ring-2 focus:ring-[#8859EB]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <ButtonModule
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !email || !issueCategory || !description}
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
                    Submitting...
                  </div>
                ) : (
                  "Submit Request"
                )}
              </ButtonModule>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SupportPage
