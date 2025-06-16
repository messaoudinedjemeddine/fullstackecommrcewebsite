// app/cart/page.tsx
'use client'; // This is a Client Component

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MinusCircle, PlusCircle, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react'; // Icons

import useCartStore, { CartItem } from '@/store/cartStore'; // Import your cart store and CartItem type

// --- Cart Item Component (Reusable within Cart Page) ---
interface CartItemProps {
  item: CartItem;
}

const CartItemDisplay: React.FC<CartItemProps> = ({ item }) => {
  const { removeItem, updateQuantity } = useCartStore();

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment') {
      updateQuantity(item.id, item.size, item.quantity + 1);
    } else if (type === 'decrement') {
      updateQuantity(item.id, item.size, item.quantity - 1);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm mb-4"
    >
      {/* Product Image and Details */}
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill={true}
            style={{ objectFit: 'cover' }}
            className="rounded-md"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/E0E0E0/808080?text=No+Img'; }}
          />
        </div>
        <div className="flex flex-col">
          <Link href={`/product/${item.id}`} className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors">
            {item.name}
          </Link>
          <p className="text-sm text-gray-600">Size: {item.size}</p>
          <p className="text-md font-bold text-indigo-600">{item.price.toFixed(2)}DA</p>
        </div>
      </div>

      {/* Quantity Controls and Price */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => handleQuantityChange('decrement')}
            disabled={item.quantity <= 1}
            className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MinusCircle size={20} />
          </button>
          <span className="px-3 py-1 text-lg font-medium text-gray-800">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange('increment')}
            className="p-2 text-gray-600 hover:bg-gray-100"
          >
            <PlusCircle size={20} />
          </button>
        </div>
        <p className="text-xl font-extrabold text-purple-700 w-24 text-right">
          {(item.price * item.quantity).toFixed(2)}DA
        </p>
        <button
          onClick={() => removeItem(item.id, item.size)}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Remove item"
        >
          <Trash2 size={24} />
        </button>
      </div>
    </motion.div>
  );
};

// --- Cart Page Component ---
export default function CartPage() {
  const { items, totalPrice, clearCart } = useCartStore(); // Get cart state and actions

  const hasItems = items.length > 0;

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 mb-12 drop-shadow-md text-center">
        Your Shopping Cart
      </h1>

      <AnimatePresence mode="wait">
        {hasItems ? (
          <motion.div
            key="cart-with-items"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <div className="grid grid-cols-1 gap-4">
              {items.map((item) => (
                <CartItemDisplay key={`${item.id}-${item.size}`} item={item} />
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6 flex flex-col md:flex-row items-center md:justify-between">
              <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                <p className="text-2xl md:text-3xl font-extrabold text-gray-800">
                  Total: <span className="text-green-600">{totalPrice.toFixed(2)}DA</span>
                </p>
                <button
                  onClick={clearCart}
                  className="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors flex items-center"
                >
                  <Trash2 size={16} className="mr-1" /> Clear Cart
                </button>
              </div>

              <Link href="/checkout" className="w-full md:w-auto">
                <button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transition-colors duration-200 transform hover:scale-105 active:scale-95">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty-cart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <ShoppingCart size={64} className="text-gray-400 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty!</p>
            <p className="text-gray-600 mb-8">Looks like you haven&apos;t added anything yet. Start shopping!</p> {/* FIX: Changed 'haven't' to 'haven&apos;t' */}
            <Link href="/store">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transition-colors duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center mx-auto">
                <ArrowLeft size={20} className="mr-2" /> Go to Store
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}