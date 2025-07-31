// app/(auth)/bank-account.tsx
"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import Navbar from "components/Navbar/Navbar"
import ArrowLeftIcon from "public/arrow-left"
import { ChevronDown, Check } from "lucide-react"

// Mock bank data - replace with actual API call in production
const banks = [
  { code: "044", name: "Access Bank" },
  { code: "063", name: "Access Bank (Diamond)" },
  { code: "035A", name: "ALAT by WEMA" },
  { code: "401", name: "ASO Savings and Loans" },
  { code: "023", name: "Citibank Nigeria" },
  { code: "050", name: "Ecobank Nigeria" },
  { code: "562", name: "Ekondo Microfinance Bank" },
  { code: "070", name: "Fidelity Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "214", name: "First City Monument Bank" },
  { code: "058", name: "Guaranty Trust Bank" },
  { code: "030", name: "Heritage Bank" },
  { code: "301", name: "Jaiz Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "526", name: "Parallex Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "101", name: "Providus Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "068", name: "Standard Chartered Bank" },
  { code: "232", name: "Sterling Bank" },
  { code: "100", name: "Suntrust Bank" },
  { code: "032", name: "Union Bank of Nigeria" },
  { code: "033", name: "United Bank For Africa" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
]

const AddBank: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedBank, setSelectedBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [verifyingAccount, setVerifyingAccount] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!accountName || !selectedBank || !accountNumber) {
      notify("error", "Incomplete Details", {
        description: "Please provide all bank details",
      })
      return
    }

    setLoading(true)

    try {
      notify("success", "Verification successful!", {
        description: "Redirecting to review...",
        duration: 1000,
      })
      setTimeout(() => router.push("/sell/bvn"), 1000)
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

  // Verify account number when bank and account number are provided
  useEffect(() => {
    if (selectedBank && accountNumber.length === 10) {
      const verifyAccount = async () => {
        setVerifyingAccount(true)
        try {
          // Mock API call - replace with actual verification in production
          await new Promise((resolve) => setTimeout(resolve, 1500))
          const mockAccountName = "Young Beni Mulla" // Replace with actual API response
          setAccountName(mockAccountName)
        } catch (error) {
          setAccountName("")
          notify("error", "Account Verification Failed", {
            description: "Could not verify account details",
          })
        } finally {
          setVerifyingAccount(false)
        }
      }

      const timer = setTimeout(verifyAccount, 1000)
      return () => clearTimeout(timer)
    } else {
      setAccountName("")
    }
  }, [selectedBank, accountNumber])

  const filteredBanks = banks.filter((bank) => bank.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedBankName = banks.find((bank) => bank.code === selectedBank)?.name || ""

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
              <h5 className="text-2xl font-medium text-[#F8F8F8]">Add bank account detail</h5>
              <p className="text-xs text-[#F8F8F8]">We'll send funds to the provided account</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-1 block text-sm text-[#f8f8f8]">Select Bank</label>
                <div className="relative">
                  <button
                    type="button"
                    className="flex h-[46px] w-full items-center justify-between rounded-md border border-[#120C20] bg-[#120C20] px-3 py-2 text-left text-base text-[#f8f8f8] outline-none focus:ring-2 focus:ring-[#8859EB]"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {selectedBankName || "Select your bank"}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-[#120C20] bg-[#120C20] shadow-lg">
                      <div className="p-2">
                        <input
                          type="text"
                          placeholder="Search banks..."
                          className="mb-2 w-full rounded-md bg-[#8859EB]/20 px-3 py-2 text-[#f8f8f8] outline-none"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredBanks.length > 0 ? (
                          filteredBanks.map((bank) => (
                            <div
                              key={bank.code}
                              className={`flex cursor-pointer items-center justify-between px-4 py-2 text-[#f8f8f8] hover:bg-[#8859EB]/10 ${
                                selectedBank === bank.code ? "bg-[#8859EB]/20" : ""
                              }`}
                              onClick={() => {
                                setSelectedBank(bank.code)
                                setIsOpen(false)
                                setSearchTerm("")
                              }}
                            >
                              <span>{bank.name}</span>
                              {selectedBank === bank.code && <Check className="h-4 w-4 text-[#8859EB]" />}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-[#8F8F8F]">No banks found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm text-[#f8f8f8]">Account Number</label>
                <div className="flex h-[46px] items-center rounded-md border border-[#120C20] bg-[#120C20] px-3 py-2 focus-within:bg-[#120C20] focus-within:ring-2 focus-within:ring-[#8859EB]">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter your 10-digit account number"
                    className="flex-1 bg-transparent text-base text-[#f8f8f8] outline-none"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                    maxLength={10}
                    required
                  />
                  {verifyingAccount && (
                    <div className="ml-2 h-5 w-5">
                      <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <defs>
                          <linearGradient id="angularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#B088FB" />
                            <stop offset="100%" stopColor="#8859EB" />
                          </linearGradient>
                        </defs>
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="url(#angularGradient)"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="url(#angularGradient)"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm text-[#f8f8f8]">Account Name</label>
                <div className="flex h-[46px] items-center rounded-md border border-[#120C20] bg-[#120C20] px-3 py-2">
                  {accountName ? (
                    <p className="text-base text-[#f8f8f8]">{accountName}</p>
                  ) : (
                    <p className="text-base text-[#8F8F8F]">
                      {accountNumber.length === 10 ? "Verifying..." : "Enter account number"}
                    </p>
                  )}
                </div>
              </div>

              <ButtonModule
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !accountName}
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

              <ButtonModule type="button" variant="outline" size="lg" className="mt-4 w-full" onClick={handleGoBack}>
                Cancel
              </ButtonModule>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AddBank
