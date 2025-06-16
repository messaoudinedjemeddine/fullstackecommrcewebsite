// app/success/page.tsx
'use client'; // This is a Client Component

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // To get query parameters (orderId)
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Store } from 'lucide-react'; // Icons

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId'); // Get orderId from URL query parameter

  const [displayOrderId, setDisplayOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Basic validation to ensure orderId is present and looks reasonable
    if (orderId && /^\d+$/.test(orderId)) { // Checks if it's a number string
      setDisplayOrderId(orderId);
    } else {
      setDisplayOrderId('N/A'); // Fallback if orderId is missing or invalid
    }
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 text-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="bg-white rounded-xl shadow-2xl p-8 md:p-12 text-center max-w-md w-full border-t-4 border-green-500"
      >
        <CheckCircle size={80} className="text-green-500 mx-auto mb-6 drop-shadow-md" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">Order Placed!</h1>
        <p className="text-lg text-gray-700 mb-8">Thank you for your purchase. Your order has been successfully placed.</p>

        {displayOrderId && (
          <p className="text-xl font-bold text-gray-800 mb-8 p-4 bg-gray-100 rounded-lg border border-gray-200">
            Order ID: <span className="text-purple-600">{displayOrderId}</span>
          </p>
        )}

        <div className="flex flex-col space-y-4">
          <Link href="/" passHref>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-md transition-colors duration-200 flex items-center justify-center"
            >
              <Home size={20} className="mr-2" /> Continue Shopping
            </motion.button>
          </Link>
          <Link href="/store" passHref>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold py-3 px-6 rounded-full text-lg shadow-sm transition-colors duration-200 flex items-center justify-center"
            >
              <Store size={20} className="mr-2" /> Explore More Products
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}