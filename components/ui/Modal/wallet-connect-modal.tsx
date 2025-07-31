"use client"

import React, { useState, useEffect } from "react"
import Modal from "react-modal"
import { ethers } from "ethers"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import MetamaskIcon from "public/metamask-icon"
import TrustWalletIcon from "public/trustwallet-icon"
import CoinbaseWalletIcon from "public/coinbasewallet-icon"
import Crossfiat from "public/crossfiat-icon"
import { CheckIcon } from "lucide-react"

interface WalletConnectionModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onWalletConnected: (provider: ethers.BrowserProvider, address: string, walletName: string) => void
  onDisconnect: () => void
  onError: (error: Error) => void
  connectedWallet?: {
    name: string
    address: string
  } | null
}

const wallets = [
  {
    name: "MetaMask",
    icon: <MetamaskIcon />,
    providerName: "metaMask",
    id: "metamask",
  },
  {
    name: "Trust Wallet",
    icon: <TrustWalletIcon />,
    providerName: "trustWallet",
    id: "trustwallet",
  },
  {
    name: "Coinbase Wallet",
    icon: <CoinbaseWalletIcon />,
    providerName: "coinbaseWallet",
    id: "coinbase",
  },
]

const WalletConnectionModal: React.FC<WalletConnectionModalProps> = ({
  isOpen,
  onRequestClose,
  onWalletConnected,
  onDisconnect,
  onError,
  connectedWallet,
}) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [activeWallet, setActiveWallet] = useState<string | null>(null)

  useEffect(() => {
    if (connectedWallet) {
      const wallet = wallets.find((w) => w.name === connectedWallet.name)
      setActiveWallet(wallet?.id || null)
    } else {
      setActiveWallet(null)
    }
  }, [connectedWallet])

  const customStyles = {
    content: {
      top: "100px",
      right: "40px",
      left: "auto",
      bottom: "auto",
      marginRight: "20px",
      transform: "none",
      width: "350px",
      padding: "0",
      border: "none",
      borderRadius: "8px",
      backgroundColor: "#FFFFFF0D",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      paddingTop: "20px",
    },
  }

  const connectWallet = async (wallet: (typeof wallets)[0]) => {
    try {
      setIsConnecting(true)
      setActiveWallet(wallet.id)

      if (!window.ethereum) {
        throw new Error("Ethereum provider not found. Please install a wallet extension.")
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      // Create ethers provider
      const provider = new ethers.BrowserProvider(window.ethereum)

      // Get the signer
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      // Notify parent component
      onWalletConnected(provider, address, wallet.name)
      onRequestClose()
    } catch (error) {
      console.error("Wallet connection error:", error)
      setActiveWallet(null)
      onError(error instanceof Error ? error : new Error("Failed to connect wallet"))
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    onDisconnect()
    setActiveWallet(null)
  }

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
      closeTimeoutMS={200}
    >
      <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
        <Crossfiat />
        <h3 className="text-[#FFFFFF]">{connectedWallet ? "Wallet Connected" : "Connect Your Wallet"}</h3>
      </div>
      <div className="px-4 pb-6">
        {connectedWallet ? (
          <div className="my-4 space-y-4">
            <div className="flex items-center justify-between rounded-[12px] bg-[#271E3D] p-4">
              <div className="flex items-center gap-3">
                {wallets.find((w) => w.name === connectedWallet.name)?.icon || null}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{connectedWallet.name}</span>
                <span className="text-sm text-gray-400">{truncateAddress(connectedWallet.address)}</span>
                <div className="h-4 w-4 text-green-400">
                  <CheckIcon />
                </div>
              </div>
            </div>
            <ButtonModule
              variant="secondary"
              size="lg"
              className="w-full justify-center gap-3 rounded-[12px] bg-[#120C20] hover:bg-[#271E3D]"
              onClick={handleDisconnect}
            >
              Disconnect
            </ButtonModule>
          </div>
        ) : (
          <div className="my-4 space-y-3">
            {wallets.map((wallet) => (
              <ButtonModule
                key={wallet.id}
                variant="secondary"
                size="lg"
                className={`w-full justify-between gap-3 rounded-[12px] ${
                  activeWallet === wallet.id ? "bg-[#271E3D]" : "bg-[#120C20]"
                } hover:bg-[#271E3D]`}
                onClick={() => connectWallet(wallet)}
                disabled={isConnecting}
              >
                <div className="flex w-full items-center justify-between gap-3 text-sm">
                  <p>{wallet.name}</p>
                  {wallet.icon}
                </div>
                {activeWallet === wallet.id && (
                  <div className="h-4 w-4">
                    {isConnecting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : null}
                  </div>
                )}
              </ButtonModule>
            ))}
          </div>
        )}

        <p className="mt-4 text-center text-xs text-gray-400">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </Modal>
  )
}

export default WalletConnectionModal
