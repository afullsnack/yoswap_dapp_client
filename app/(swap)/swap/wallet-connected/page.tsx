// app/(auth)/BVN.tsx
"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import Navbar from "components/Navbar/Navbar"
import ArrowLeftIcon from "public/arrow-left"
import UnlinkIcon from "public/unlink-icon"
import { CheckIcon, ChevronDown } from "lucide-react"
import CopyIcon from "public/copy-icon"
import ActiveIcon from "public/active-icon"
import InactiveIcon from "public/inactive-icon"

const networks = [
  {
    id: "assetchain",
    name: "cNGN x Assetchain",
    icon: <img src="/assetchain.png" className="h-5 w-5" />,
  },
  {
    id: "binance",
    name: "cNGN x BSC",
    icon: <img src="/bsc.png" className="h-5 w-5" />,
  },
  {
    id: "bantu",
    name: "cNGN x bantu",
    icon: <img src="/bantu.png" className="h-5 w-5" />,
  },
  {
    id: "base",
    name: "cNGN x base",
    icon: <img src="/base.png" className="h-5 w-5" />,
  },
  {
    id: "eth",
    name: "cNGN x ethereum",
    icon: <img src="/eth.png" className="h-5 w-5" />,
  },
  {
    id: "polygon",
    name: "cNGN x polygon",
    icon: <img src="/polygon.png" className="h-5 w-5" />,
  },
]

const ConnectedWallet: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [walletInfo, setWalletInfo] = useState<{
    name: string
    address: string
  } | null>(null)
  const [useDifferentWallet, setUseDifferentWallet] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const handleStorageChange = () => {
      const storedWallet = localStorage.getItem("connectedWallet")
      if (storedWallet) {
        const wallet = JSON.parse(storedWallet)
        setWalletInfo(wallet)
        setIsVerified(true)
      } else {
        setWalletInfo(null)
        setIsVerified(false)
      }
    }

    // Initial load
    handleStorageChange()

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Also listen for wallet connection within the same tab
  useEffect(() => {
    const interval = setInterval(() => {
      const storedWallet = localStorage.getItem("connectedWallet")
      if (storedWallet) {
        const wallet = JSON.parse(storedWallet)
        if (!walletInfo || wallet.address !== walletInfo.address) {
          setWalletInfo(wallet)
          setIsVerified(true)
        }
      } else if (walletInfo) {
        setWalletInfo(null)
        setIsVerified(false)
      }
    }, 500) // Check every 500ms

    return () => clearInterval(interval)
  }, [walletInfo])

  const handleGoBack = () => {
    router.back()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (useDifferentWallet && !walletAddress) {
      notify("error", "Wallet Address Required", {
        description: "Please enter a wallet address or use your connected wallet",
      })
      return
    }

    if (useDifferentWallet && !selectedNetwork) {
      notify("error", "Network Required", {
        description: "Please select a network for your wallet",
      })
      return
    }

    if (!isVerified) {
      notify("error", "Verification Required", {
        description: "Please verify your wallet before proceeding",
      })
      return
    }

    setLoading(true)

    try {
      notify("success", "Verification successful!", {
        description: "Redirecting to review...",
        duration: 1000,
      })
      setTimeout(() => router.push("/swap/confirm-swap"), 1000)
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

  const handleDisconnectWallet = () => {
    localStorage.removeItem("connectedWallet")
    setWalletInfo(null)
    setIsVerified(false)
    notify("success", "Wallet Disconnected", {
      description: "Your wallet has been disconnected",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    notify("success", "Copied", {
      description: "Wallet address copied to clipboard",
      duration: 1000,
    })
  }

  const truncateAddress = (address: string) => {
    if (!address) return "Not connected"
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const validateWalletAddress = (address: string) => {
    return address.length > 20 && address.startsWith("0x")
  }

  const getSelectedNetworkIcon = () => {
    const network = networks.find((n) => n.id === selectedNetwork)
    return network ? network.icon : null
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
              <h5 className="text-2xl font-medium text-[#F8F8F8]">
                {walletInfo ? "Wallet Connected" : "No Wallet Connected"}
              </h5>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-[#F8F8F8]">Wallet Address</label>
                <div className="flex items-center justify-between rounded-lg border border-[#120C20] bg-[#120C20] p-3">
                  <p className="text-sm text-[#F8F8F8]">{walletInfo ? walletInfo.address : "No wallet connected"}</p>
                  <div className="flex items-center gap-2">
                    {walletInfo && (
                      <>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(walletInfo.address)}
                          className="text-[#8F8F8F] hover:text-[#F8F8F8]"
                        >
                          <CopyIcon />
                        </button>
                        {isVerified && (
                          <div className="flex items-center gap-1 text-sm text-[#27B973]">
                            <CheckIcon size={16} />
                            Verified
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {walletInfo && (
                <div className="mb-6 mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDisconnectWallet}
                    className="flex items-center gap-2 text-sm text-[#B088FB] hover:text-[#8859EB]"
                  >
                    <UnlinkIcon />
                    Disconnect Wallet
                  </button>
                </div>
              )}

              <div className="mb-4 flex flex-col gap-2">
                <div
                  className={`flex cursor-pointer gap-3 rounded-lg p-3 ${!useDifferentWallet ? "" : ""}`}
                  onClick={() => setUseDifferentWallet(false)}
                >
                  {!useDifferentWallet ? <ActiveIcon /> : <InactiveIcon />}
                  <div>
                    <h4 className="text-lg font-bold text-[#f8f8f8]">Use current wallet for receiving cNGN</h4>
                    <p className="text-[#f8f8f8]">Your connected wallet supports the selected network</p>
                  </div>
                </div>

                <div
                  className={`flex cursor-pointer gap-3 rounded-lg p-3 ${useDifferentWallet ? "" : ""}`}
                  onClick={() => setUseDifferentWallet(true)}
                >
                  {useDifferentWallet ? <ActiveIcon /> : <InactiveIcon />}
                  <div>
                    <h4 className="text-lg font-bold text-[#f8f8f8]">Enter different wallet address</h4>
                    <p className="text-[#f8f8f8]">
                      Use this if your current wallet doesn't support the selected network
                    </p>
                  </div>
                </div>
              </div>

              {useDifferentWallet && (
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#F8F8F8]">Wallet Address</label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter wallet address (0x...)"
                      className="w-full rounded-lg border border-[#120C20] bg-[#120C20] p-3 text-sm text-[#F8F8F8]"
                    />
                    {walletAddress && !validateWalletAddress(walletAddress) && (
                      <p className="mt-1 text-xs text-[#E33B32]">Please enter a valid wallet address</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="mb-2 block text-sm font-medium text-[#F8F8F8]">Network</label>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg border border-[#120C20] bg-[#120C20] p-3 text-left text-sm text-[#F8F8F8]"
                      onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                    >
                      <div className="flex items-center gap-2">
                        {selectedNetwork && getSelectedNetworkIcon()}
                        {selectedNetwork || "Select network"}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isNetworkDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isNetworkDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full rounded-lg border border-[#120C20] bg-[#120C20] shadow-lg">
                        {networks.map((network) => (
                          <div
                            key={network.id}
                            className={`flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-[#F8F8F8] hover:bg-[#8859EB]/10 ${
                              selectedNetwork === network.id ? "bg-[#8859EB]/20" : ""
                            }`}
                            onClick={() => {
                              setSelectedNetwork(network.id)
                              setIsNetworkDropdownOpen(false)
                            }}
                          >
                            {network.icon}
                            <span className="flex-1">{network.name}</span>
                            {selectedNetwork === network.id && <CheckIcon className="h-4 w-4 text-[#8859EB]" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <ButtonModule
                type="submit"
                variant="primary"
                size="lg"
                disabled={
                  loading ||
                  (!useDifferentWallet && !walletInfo) ||
                  (useDifferentWallet && (!walletAddress || !selectedNetwork))
                }
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

export default ConnectedWallet
