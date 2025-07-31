"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import Crossfiat from "public/crossfiat-icon"
import WalletConnectionModal from "components/ui/Modal/wallet-connect-modal"
import { ethers } from "ethers"
import MetamaskIcon from "public/metamask-icon"
import TrustWalletIcon from "public/trustwallet-icon"
import CoinbaseWalletIcon from "public/coinbasewallet-icon"
import { CheckIcon, Menu, X } from "lucide-react"

interface NavbarProps {
  loading?: boolean
}

const wallets = [
  {
    name: "MetaMask",
    icon: <MetamaskIcon className="h-5 w-5" />,
    providerName: "metaMask",
    id: "metamask",
  },
  {
    name: "Trust Wallet",
    icon: <TrustWalletIcon className="h-5 w-5" />,
    providerName: "trustWallet",
    id: "trustwallet",
  },
  {
    name: "Coinbase Wallet",
    icon: <CoinbaseWalletIcon className="h-5 w-5" />,
    providerName: "coinbaseWallet",
    id: "coinbase",
  },
]

const Navbar: React.FC<NavbarProps> = ({ loading = false }) => {
  const pathname = usePathname()
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<{
    name: string
    address: string
  } | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Load wallet from localStorage on component mount
  useEffect(() => {
    const storedWallet = localStorage.getItem("connectedWallet")
    if (storedWallet) {
      setConnectedWallet(JSON.parse(storedWallet) as any)
    }
  }, [])

  const navLinks = [
    { name: "Buy", href: "/" },
    { name: "Sell", href: "/sell" },
    { name: "Swap", href: "/swap" },
  ]

  const getLinkStyle = (href: string) => {
    const isActive = pathname === href
    return `text-sm font-semibold ${isActive ? "text-[#B088FB] underline" : "text-[#ffffff]"}`
  }

  const handleWalletConnected = (provider: ethers.BrowserProvider, address: string, walletName: string) => {
    const wallet = {
      name: walletName,
      address: address,
    }
    setConnectedWallet(wallet)
    localStorage.setItem("connectedWallet", JSON.stringify(wallet))
    setIsMobileMenuOpen(false) // Close mobile menu after wallet connection
  }

  const handleDisconnect = () => {
    setConnectedWallet(null)
    localStorage.removeItem("connectedWallet")
  }

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const getWalletIcon = (walletName: string) => {
    const wallet = wallets.find((w) => w.name === walletName)
    return wallet ? wallet.icon : null
  }

  return (
    <>
      <div className="relative mb-20 flex w-full items-center justify-between gap-2 px-4 py-4 md:px-0 md:py-0">
        <div className="flex items-center">
          <Crossfiat />
          {/* Desktop Navigation Links */}
          <div className="ml-10 hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={getLinkStyle(link.href)}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          {connectedWallet ? (
            <ButtonModule
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center gap-2"
            >
              {getWalletIcon(connectedWallet.name)}
              {truncateAddress(connectedWallet.address)}
            </ButtonModule>
          ) : (
            <ButtonModule
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsWalletModalOpen(true)}
              disabled={isConnecting}
              className="hidden sm:flex"
            >
              {isConnecting ? "Connecting..." : "Connect"}
            </ButtonModule>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none md:hidden"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Wallet Button */}
        <div className="hidden items-center gap-2 md:flex">
          {connectedWallet ? (
            <ButtonModule
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center gap-2"
            >
              {getWalletIcon(connectedWallet.name)}
              {truncateAddress(connectedWallet.address)}
            </ButtonModule>
          ) : (
            <ButtonModule
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsWalletModalOpen(true)}
              disabled={isConnecting}
            >
              {isConnecting ? (
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
                  Connecting...
                </div>
              ) : (
                "Connect Wallet"
              )}
            </ButtonModule>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 mt-16 flex flex-col bg-[#1A1A1A] p-4 md:hidden">
          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 text-lg font-semibold ${getLinkStyle(link.href)}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {!connectedWallet && (
              <ButtonModule
                type="button"
                variant="primary"
                size="lg"
                onClick={() => {
                  setIsWalletModalOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                disabled={isConnecting}
                className="mt-4"
              >
                {isConnecting ? (
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
                    Connecting...
                  </div>
                ) : (
                  "Connect Wallet"
                )}
              </ButtonModule>
            )}
          </div>
        </div>
      )}

      <WalletConnectionModal
        isOpen={isWalletModalOpen}
        onRequestClose={() => setIsWalletModalOpen(false)}
        onWalletConnected={handleWalletConnected}
        onDisconnect={handleDisconnect}
        onError={(error) => {
          console.error(error)
          setIsConnecting(false)
        }}
        connectedWallet={connectedWallet}
      />
    </>
  )
}

export default Navbar
