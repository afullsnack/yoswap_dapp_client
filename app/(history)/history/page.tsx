"use client"
import React, { useState, useEffect, useRef } from "react"
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
import ArrowRightIcon from "public/arrow-right"
import CopyIcon from "public/copy-icon"
import Filtericon from "public/filter-icon"
import { Check, ChevronDown, X } from "lucide-react"
import Modal from "react-modal"
import { MdClose } from "react-icons/md"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import ShareIcon from "public/share-icon"

interface Transaction {
  id: string
  type: "buy" | "sell" | "swap"
  amount: number
  currency: string
  receivedAmount: number
  receivedCurrency: string
  date: string
  status: "success" | "pending" | "failed"
  txId: string
  rate: string
  timestamp: number
  fee?: number
  network?: string
  paymentMethod?: string
}

const TransactionHistory: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<"all" | "buy" | "sell" | "swap">("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter states
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  })
  const [selectedToken, setSelectedToken] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)

  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null)

  const tokens = ["all", "USDT", "BTC", "NGN", "ETH"]
  const statuses = ["all", "success", "pending", "failed"]

  // Mock data - replace with actual API call in production
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        const mockTransactions: Transaction[] = [
          {
            id: "1",
            type: "buy",
            amount: 15000,
            currency: "NGN",
            receivedAmount: 9.48,
            receivedCurrency: "USDT",
            date: "June 26, 2025 • 14:32",
            status: "success",
            txId: "Tx_2345654329d",
            rate: "₦1,500 / USDT",
            timestamp: new Date("2025-06-26T14:32:00").getTime(),
            fee: 360,
            network: "BEP20",
            paymentMethod: "Bank Transfer",
          },
          {
            id: "2",
            type: "sell",
            amount: 25,
            currency: "USDT",
            receivedAmount: 39506.25,
            receivedCurrency: "NGN",
            date: "June 25, 2025 • 09:15",
            status: "success",
            txId: "Tx_9876543210a",
            rate: "₦1,580.25 / USDT",
            timestamp: new Date("2025-06-25T09:15:00").getTime(),
            fee: 0.5,
            network: "BEP20",
            paymentMethod: "Bank Transfer",
          },
          {
            id: "3",
            type: "swap",
            amount: 0.05,
            currency: "BTC",
            receivedAmount: 1250,
            receivedCurrency: "USDT",
            date: "June 24, 2025 • 18:45",
            status: "pending",
            txId: "Tx_5678901234b",
            rate: "25,000 USDT / BTC",
            timestamp: new Date("2025-06-24T18:45:00").getTime(),
            fee: 0.001,
            network: "BTC Network",
            paymentMethod: "Wallet Transfer",
          },
          {
            id: "4",
            type: "buy",
            amount: 30000,
            currency: "NGN",
            receivedAmount: 19.23,
            receivedCurrency: "USDT",
            date: "June 23, 2025 • 11:20",
            status: "failed",
            txId: "Tx_3456789012c",
            rate: "₦1,560 / USDT",
            timestamp: new Date("2025-06-23T11:20:00").getTime(),
            fee: 360,
            network: "BEP20",
            paymentMethod: "Bank Transfer",
          },
          {
            id: "5",
            type: "swap",
            amount: 50,
            currency: "USDT",
            receivedAmount: 0.0019,
            receivedCurrency: "BTC",
            date: "June 22, 2025 • 16:30",
            status: "success",
            txId: "Tx_7890123456d",
            rate: "26,315.79 USDT / BTC",
            timestamp: new Date("2025-06-22T16:30:00").getTime(),
            fee: 1.25,
            network: "BTC Network",
            paymentMethod: "Wallet Transfer",
          },
        ]

        setTransactions(mockTransactions)
      } catch (error) {
        setError("Failed to load transactions")
        notify("error", "Error", {
          description: "Could not load transaction history",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuAction = (action: string) => {
    setIsMenuOpen(false)
    switch (action) {
      case "buy":
        router.push("/")
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    notify("success", "Copied", {
      description: "Transaction ID copied to clipboard",
      duration: 1000,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-[#27B973]"
      case "pending":
        return "text-[#DC9D24]"
      case "failed":
        return "text-[#E33B32]"
      default:
        return "text-[#8F8F8F]"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "buy":
        return "bg-[#054F31]"
      case "sell":
        return "bg-[#7A271A]"
      case "swap":
        return "bg-[#3E1C96]"
      default:
        return "bg-[#120C20]"
    }
  }

  const applyFilters = () => {
    setIsFilterOpen(false)
  }

  const resetFilters = () => {
    setDateRange({ start: "", end: "" })
    setSelectedToken("all")
    setSelectedStatus("all")
  }

  const filteredTransactions = transactions.filter((tx) => {
    // Filter by type
    if (filter !== "all" && tx.type !== filter) return false

    // Filter by token
    if (selectedToken !== "all" && tx.currency !== selectedToken && tx.receivedCurrency !== selectedToken) {
      return false
    }

    // Filter by status
    if (selectedStatus !== "all" && tx.status !== selectedStatus) return false

    // Filter by date range
    if (dateRange.start && tx.timestamp < new Date(dateRange.start).getTime()) return false
    if (dateRange.end && tx.timestamp > new Date(dateRange.end).getTime()) return false

    return true
  })

  const hasActiveFilters = selectedToken !== "all" || selectedStatus !== "all" || dateRange.start || dateRange.end

  const openTransactionModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const closeTransactionModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  const handleDownloadPDF = async () => {
    if (!modalRef.current) return

    try {
      const canvas = await html2canvas(modalRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`Transaction_${selectedTransaction?.txId}_Details.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      notify("error", "PDF Generation Failed", {
        description: "Failed to generate PDF. Please try again.",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTokenImage = (currency: string) => {
    switch (currency) {
      case "USDT":
        return "/usdt.png"
      case "BTC":
        return "/btc.png"
      case "ETH":
        return "/eth.png"
      case "NGN":
        return "/cngn.png"
      default:
        return "/default-token.png"
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
                <p className="text-center text-3xl text-[#f8f8f8]">Transaction History</p>
                <p></p>
              </div>
            </div>

            {loading && !transactions.length ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 w-full animate-pulse rounded-xl bg-[#120C20]" />
                ))}
              </div>
            ) : error ? (
              <div className="flex h-40 items-center justify-center text-[#8F8F8F]">{error}</div>
            ) : (
              <div className="flex w-full flex-col gap-4 rounded-xl bg-[#120C20] p-4">
                <div className="flex justify-between gap-2 pb-2">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <ButtonModule
                      type="button"
                      variant={filter === "all" ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setFilter("all")}
                    >
                      All
                    </ButtonModule>
                    <ButtonModule
                      type="button"
                      variant={filter === "buy" ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setFilter("buy")}
                    >
                      Buy
                    </ButtonModule>
                    <ButtonModule
                      type="button"
                      variant={filter === "sell" ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setFilter("sell")}
                    >
                      Sell
                    </ButtonModule>
                    <ButtonModule
                      type="button"
                      variant={filter === "swap" ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setFilter("swap")}
                    >
                      Swap
                    </ButtonModule>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={`flex items-center gap-2 rounded-full bg-[#FFFFFF0D] px-4 py-1 ${
                        hasActiveFilters ? "ring-2 ring-[#8859EB]" : ""
                      }`}
                    >
                      <Filtericon />
                      {hasActiveFilters && <div className="h-2 w-2 rounded-full bg-[#8859EB]"></div>}
                    </button>

                    {isFilterOpen && (
                      <div className="absolute right-0 top-10 z-50 w-64 rounded-lg bg-[#1F1A2C] p-4 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-medium text-[#F8F8F8]">Filters</h3>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="text-[#8F8F8F] hover:text-[#F8F8F8]"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {/* Date Range Filter */}
                        <div className="mb-4">
                          <label className="mb-2 block text-sm font-medium text-[#F8F8F8]">Date Range</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              className="rounded-md border border-[#120C20] bg-[#120C20] p-2 text-sm text-[#F8F8F8]"
                              value={dateRange.start}
                              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            />
                            <input
                              type="date"
                              className="rounded-md border border-[#120C20] bg-[#120C20] p-2 text-sm text-[#F8F8F8]"
                              value={dateRange.end}
                              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Token Filter */}
                        <div className="mb-4">
                          <label className="mb-2 block text-sm font-medium text-[#F8F8F8]">Token</label>
                          <div className="relative">
                            <button
                              type="button"
                              className="flex w-full items-center justify-between rounded-md border border-[#120C20] bg-[#120C20] px-3 py-2 text-left text-sm text-[#F8F8F8]"
                              onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                            >
                              {selectedToken === "all" ? "All Tokens" : selectedToken}
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${isTokenDropdownOpen ? "rotate-180" : ""}`}
                              />
                            </button>
                            {isTokenDropdownOpen && (
                              <div className="absolute z-10 mt-1 w-full rounded-md border border-[#120C20] bg-[#120C20] shadow-lg">
                                <div className="max-h-60 overflow-y-auto">
                                  {tokens.map((token) => (
                                    <div
                                      key={token}
                                      className={`flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-[#F8F8F8] hover:bg-[#8859EB]/10 ${
                                        selectedToken === token ? "bg-[#8859EB]/20" : ""
                                      }`}
                                      onClick={() => {
                                        setSelectedToken(token)
                                        setIsTokenDropdownOpen(false)
                                      }}
                                    >
                                      <span>{token === "all" ? "All Tokens" : token}</span>
                                      {selectedToken === token && <Check className="h-4 w-4 text-[#8859EB]" />}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Filter */}
                        <div className="mb-6">
                          <label className="mb-2 block text-sm font-medium text-[#F8F8F8]">Status</label>
                          <div className="relative">
                            <button
                              type="button"
                              className="flex w-full items-center justify-between rounded-md border border-[#120C20] bg-[#120C20] px-3 py-2 text-left text-sm text-[#F8F8F8]"
                              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            >
                              {selectedStatus === "all"
                                ? "All Statuses"
                                : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
                              />
                            </button>
                            {isStatusDropdownOpen && (
                              <div className="absolute z-10 mt-1 w-full rounded-md border border-[#120C20] bg-[#120C20] shadow-lg">
                                <div className="max-h-60 overflow-y-auto">
                                  {statuses.map((status) => (
                                    <div
                                      key={status}
                                      className={`flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-[#F8F8F8] hover:bg-[#8859EB]/10 ${
                                        selectedStatus === status ? "bg-[#8859EB]/20" : ""
                                      }`}
                                      onClick={() => {
                                        setSelectedStatus(status)
                                        setIsStatusDropdownOpen(false)
                                      }}
                                    >
                                      <span>
                                        {status === "all"
                                          ? "All Statuses"
                                          : status.charAt(0).toUpperCase() + status.slice(1)}
                                      </span>
                                      {selectedStatus === status && <Check className="h-4 w-4 text-[#8859EB]" />}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <ButtonModule
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="w-full"
                            onClick={resetFilters}
                          >
                            Reset
                          </ButtonModule>
                          <ButtonModule
                            type="button"
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={applyFilters}
                          >
                            Apply
                          </ButtonModule>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex w-full cursor-pointer flex-col justify-between rounded-xl bg-[#FFFFFF0D] p-4 hover:bg-[#FFFFFF1A]"
                      onClick={() => openTransactionModal(tx)}
                    >
                      <div className="flex w-full">
                        <div className="flex w-full items-center gap-3">
                          <div
                            className={`flex items-center gap-1 rounded-full ${getTypeColor(
                              tx.type
                            )} px-2 py-[2px] text-sm text-[#F8F8F8]`}
                          >
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </div>
                          <p className="text-xs font-medium text-[#8F8F8F]">{tx.date}</p>
                        </div>
                        <p className={`text-sm font-semibold ${getStatusColor(tx.status)}`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </p>
                      </div>
                      <div className="mt-1 flex w-full items-center justify-between">
                        <div className="flex w-full items-center gap-8">
                          <p className="font-semibold text-[#F8F8F8]">
                            {tx.amount} {tx.currency}
                          </p>
                          <ArrowRightIcon />
                          <p className="font-semibold text-[#F8F8F8]">
                            {tx.receivedAmount} {tx.receivedCurrency}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-[#8F8F8F]">{tx.txId}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(tx.txId)
                            }}
                          >
                            <CopyIcon />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-[#8F8F8F]">{tx.rate}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-40 items-center justify-center text-[#8F8F8F]">
                    No transactions found matching your filters
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeTransactionModal}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70"
        ariaHideApp={false}
      >
        <div ref={modalRef} className="relative w-full max-w-md rounded-xl bg-[#0F0A1E] p-6 text-[#F8F8F8] shadow-lg">
          <button
            onClick={closeTransactionModal}
            className="absolute right-4 top-4 text-[#8F8F8F] hover:text-[#F8F8F8]"
          >
            <X size={24} />
          </button>

          {selectedTransaction && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#120C20] pb-4">
                <h2 className="text-xl font-bold">
                  {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)} Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center gap-1 rounded-full ${getTypeColor(
                        selectedTransaction.type
                      )} px-2 py-[2px] text-sm text-[#F8F8F8]`}
                    >
                      {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                    </div>
                    <p className="text-sm font-medium text-[#8F8F8F]">{selectedTransaction.date}</p>
                  </div>
                  <p className={`text-sm font-semibold ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                  </p>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={getTokenImage(selectedTransaction.currency)}
                      alt={selectedTransaction.currency}
                      className="w-10"
                    />
                    <div>
                      <p className="font-bold text-[#f8f8f8]">
                        {selectedTransaction.amount} {selectedTransaction.currency}
                      </p>
                      <p className="text-sm text-[#8f8f8f]">{selectedTransaction.currency} token</p>
                    </div>
                  </div>
                  <ArrowRightIcon />
                  <div className="flex items-center gap-2">
                    <img
                      src={getTokenImage(selectedTransaction.receivedCurrency)}
                      alt={selectedTransaction.receivedCurrency}
                      className="w-10"
                    />
                    <div>
                      <p className="font-bold text-[#f8f8f8]">
                        {selectedTransaction.receivedAmount} {selectedTransaction.receivedCurrency}
                      </p>
                      <p className="text-sm text-[#8f8f8f]">{selectedTransaction.receivedCurrency} token</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-[#8F8F8F]">Exchange Rate</p>
                    <p className="text-[#F8F8F8]">{selectedTransaction.rate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8F8F8F]">Network</p>
                    <div className="flex items-center gap-2">
                      <span>{selectedTransaction.network || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-[#8F8F8F]">Transaction Fee</p>
                    <p className="text-[#F8F8F8]">
                      {selectedTransaction.fee !== undefined ? selectedTransaction.fee : "N/A"}{" "}
                      {selectedTransaction.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8F8F8F]">Payment Method</p>
                    <div className="flex items-center gap-2">
                      <span>{selectedTransaction.paymentMethod || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-[#8F8F8F]">Transaction ID</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[#F8F8F8]">
                        {selectedTransaction.txId.length > 10
                          ? `${selectedTransaction.txId.substring(0, 6)}...${selectedTransaction.txId.substring(
                              selectedTransaction.txId.length - 4
                            )}`
                          : selectedTransaction.txId}
                      </p>
                      <button onClick={() => copyToClipboard(selectedTransaction.txId)}>
                        <CopyIcon />
                      </button>
                      <button>
                        <ShareIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </section>
  )
}

export default TransactionHistory
