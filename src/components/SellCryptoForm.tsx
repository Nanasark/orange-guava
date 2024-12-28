import { useState } from 'react'
import { FaExchangeAlt, FaCoins } from 'react-icons/fa'

interface SellCryptoFormProps {
  merchantId: number
  availableFiat: number
}

export default function SellCryptoForm({ merchantId, availableFiat }: SellCryptoFormProps) {
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for sell crypto logic
    console.log('Sell Crypto:', { merchantId, amount })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">Sell Crypto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sellAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount (USDT)
          </label>
          <div className="relative">
            <input
              type="number"
              id="sellAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 pr-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter USDT amount"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaCoins className="text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Available Fiat:</span> ${availableFiat}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Fees:</span> Placeholder for calculated fees
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Total Amount:</span> Placeholder for total amount
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
        >
          <FaExchangeAlt className="mr-2" />
          Sell Crypto
        </button>
      </form>
    </div>
  )
}

