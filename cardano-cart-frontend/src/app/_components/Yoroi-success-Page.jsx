"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const YoroiSuccessPage = ({ amount, transactionId }) => {
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-4">Payment Successful!</h1>
        <p className="text-xl text-center mb-4">Amount Paid: ₳{amount}</p>
        <p className="text-center mb-6">Thank you for your purchase. Your transaction was successful.</p>
        <div className="flex items-center justify-center mb-6">
          <span className="mr-2">Transaction ID:</span>
          <span className="font-mono bg-gray-100 p-2 rounded">
            {`${transactionId.slice(0, 8)}...${transactionId.slice(-8)}`}
          </span>
          <button
            onClick={handleCopyTransactionId}
            className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
        <button
          onClick={() => router.push("/orders")}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          View Orders
        </button>
      </div>
    </div>
  )
}

export default YoroiSuccessPage

