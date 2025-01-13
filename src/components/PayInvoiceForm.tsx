'use client'

import { useState, useEffect } from 'react'
import { FaExchangeAlt, FaDollarSign, FaPhoneAlt, FaNetworkWired, FaStamp } from 'react-icons/fa'
import { useActiveAccount } from 'thirdweb/react'
import ConnectWallet from '@/components/connectWallet'
import StatusModal from '@/components/statusModal'
import { calculateTotalAmount } from '@/utils/calculateFee'
import getChannel from '@/utils/getChannel'

interface PaymentFormProps {
  invoiceId: string
  receiverAddress: string
  merchantAddress: string
}

export default function PaymentForm({ invoiceId, receiverAddress, merchantAddress }: PaymentFormProps) {
  const address = useActiveAccount()?.address
  const [phoneNumber, setPhoneNumber] = useState('')
  const [reference, setReference] = useState('')
  const [amount, setAmount] = useState('')
  const [network, setNetwork] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'in_progress' | 'success' | 'error'>('pending')
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)

  const feeConfig = {
    fiatFee: 0.5,
    exchangeRate: 5,
  }
  
  const calculatedAmount = calculateTotalAmount(parseFloat(amount), feeConfig)
  const channelNumber = getChannel(network)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const fetchTransactionStatus = async () => {
      if (!transactionId) return

      try {
        setIsPolling(true)
        const response = await fetch(`/api/status/collection/${transactionId}`)
        const data = await response.json()

        if (data.success && data.data?.status) {
          setTransactionStatus(data.data.status)
          
          if (['success', 'error'].includes(data.data.status)) {
            clearInterval(intervalId)
          }
        } else {
          setTransactionStatus('error')
          clearInterval(intervalId)
        }
      } catch (error) {
        console.error('Polling Error:', error)
        setTransactionStatus('error')
        clearInterval(intervalId)
      } finally {
        setIsPolling(false)
      }
    }

    if (transactionId) {
      fetchTransactionStatus()
      intervalId = setInterval(fetchTransactionStatus, 5000)
    }

    return () => clearInterval(intervalId)
  }, [transactionId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTransactionStatus('pending')

    try {
      const response = await fetch('/api/momo-transaction/send-crypto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TRANSACT_KEY}`,
        },
        body: JSON.stringify({
          phoneNumber,
          amount: calculatedAmount.amountToSendInGHS,
          channel: channelNumber,
          otpcode: '',
          reference,
          address: receiverAddress,
          merchantAddress,
        }),
      })

      const responseData = await response.json()
      
      if (responseData.success) {
        setTransactionId(responseData.data.data)
        setTransactionStatus('in_progress')
        setModalOpen(true)
      } else {
        setTransactionStatus('error')
      }
    } catch (error) {
      console.error('Error initiating transaction:', error)
      setTransactionStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-blue-200">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">Transakt Pay</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="0241182711"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaPhoneAlt className="text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
            Reference
          </label>
          <div className="relative">
            <input
              type="text"
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter Reference"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaStamp className="text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount of USDC you are paying
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter amount"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaDollarSign className="text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="network" className="block text-sm font-medium text-gray-700 mb-2">
            Network
          </label>
          <div className="relative">
            <select
              id="network"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 appearance-none"
              required
            >
              <option className="text-gray-800" value="">Select a network</option>
              <option className="text-gray-800" value="MTN">MTN</option>
              <option className="text-gray-800" value="Vodafone">Vodafone</option>
              <option className="text-gray-800" value="AirtelTigo">AirtelTigo</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaNetworkWired className="text-gray-400" />
            </div>
          </div>
        </div>

        <p className="text-sm text-blue-600">
          You are paying {calculatedAmount.totalAmountInGHS} GHS at rate of 5GHS per token
        </p>

        <div>
          {address ? (
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
            >
              <FaExchangeAlt className="mr-2" />
              {loading ? "Processing..." : "Initiate Transaction"}
            </button>
          ) : (
            <ConnectWallet />
          )}
        </div>
        
        {isPolling && <p className="text-sm text-center text-gray-600">Polling for transaction status...</p>}
      </form>

      <StatusModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setTransactionId(null)
          setTransactionStatus('pending')
        }}
        status={transactionStatus}
      />
    </div>
  )
}

