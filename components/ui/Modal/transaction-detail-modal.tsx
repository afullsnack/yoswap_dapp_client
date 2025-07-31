"use client"

import React, { useRef } from "react"
import Modal from "react-modal"
import { MdClose } from "react-icons/md"
import { ButtonModule } from "components/ui/Button/Button"
import PdfFile from "public/pdf-file"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

interface Transaction {
  id: string
  date: string
  type: "deposit" | "withdrawal" | "transfer" | "exchange"
  amount: number
  currency: string
  status: "completed" | "pending" | "failed"
  counterparty: string
}

interface TransactionDetailModalProps {
  isOpen: boolean
  transaction: Transaction | null
  onRequestClose: () => void
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ isOpen, transaction, onRequestClose }) => {
  const modalRef = useRef<HTMLDivElement>(null)

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
      const imgWidth = 210
      const pageHeight = 297
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

      pdf.save(`Transaction_${transaction?.id}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return {
          backgroundColor: "#EEF5F0",
          color: "#589E67",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          fontWeight: "500",
        }
      case "pending":
        return {
          backgroundColor: "#FBF4EC",
          color: "#D28E3D",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          fontWeight: "500",
        }
      case "failed":
        return {
          backgroundColor: "#F7EDED",
          color: "#AF4B4B",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          fontWeight: "500",
        }
      default:
        return {
          backgroundColor: "#EDF2FE",
          color: "#4976F4",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          fontWeight: "500",
        }
    }
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

  if (!isOpen || !transaction) return null

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex h-auto w-[481px] overflow-hidden rounded-md bg-white shadow-lg outline-none max-sm:w-full max-sm:max-w-[380px]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      ariaHideApp={false}
    >
      <div ref={modalRef} className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#E9F0FF] p-4">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#003F9F] font-semibold text-white">
              T
            </div>
            <p className="text-xl font-semibold text-[#2a2f4b]">Transaction Details</p>
          </div>
          <button onClick={onRequestClose} className="cursor-pointer text-gray-600 hover:text-gray-800">
            <MdClose size={24} />
          </button>
        </div>

        {/* Top summary */}
        <div className="flex w-full flex-col items-center justify-center bg-gray-50 p-4">
          <p className="text-sm text-gray-800">
            <span className="font-bold">
              {transaction.currency} {transaction.amount}
            </span>{" "}
            {transaction.type}
          </p>
          <p className="mt-1 text-sm text-gray-500">{formatDateTime(transaction.date)}</p>
          <div style={getStatusStyle(transaction.status)} className="mt-2 inline-block text-sm font-medium capitalize">
            {transaction.status}
          </div>
        </div>

        {/* Detailed fields */}
        <div className="space-y-4 p-6">
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Transaction ID:</p>
            <p className="text-gray-800">{transaction.id}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Type:</p>
            <p className="capitalize text-gray-800">{transaction.type}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Amount:</p>
            <p className="text-gray-800">
              {transaction.amount} {transaction.currency}
            </p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Counterparty:</p>
            <p className="text-gray-800">{transaction.counterparty}</p>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Status:</p>
            <div style={getStatusStyle(transaction.status)} className="inline-block text-sm font-medium capitalize">
              {transaction.status}
            </div>
          </div>
          <div className="flex w-full justify-between text-sm">
            <p className="font-medium text-gray-600">Date:</p>
            <p className="text-gray-800">{formatDateTime(transaction.date)}</p>
          </div>

          {/* Actions: Download PDF + Print */}
          <div className="mt-8 flex justify-between">
            <ButtonModule
              variant="outline"
              size="md"
              icon={<PdfFile />}
              iconPosition="start"
              onClick={handleDownloadPDF}
              className="border-gray-300 hover:bg-gray-50"
            >
              Download Pdf
            </ButtonModule>
            <ButtonModule
              variant="outline"
              size="md"
              icon={<PdfFile />}
              iconPosition="start"
              onClick={handlePrint}
              className="border-gray-300 hover:bg-gray-50"
            >
              Print
            </ButtonModule>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TransactionDetailModal
