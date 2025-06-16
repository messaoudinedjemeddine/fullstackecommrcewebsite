// app/product/[id]/page.tsx
'use client'; // This is a Client Component

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import Image from 'next/image';
import api from '@/utils/api';
import useCartStore from '@/store/cartStore';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import React from 'react'; // Keep React imported for other hooks


// --- Type Definitions (re-using product types) ---
interface Category {
  id: number;
  name: string;
}

interface ProductImage {
  id: number;
  productId: number;
  color?: string;
  imagePath: string;
}

interface Product {
  id: number;
  name: string;
  reference: string;
  description?: string;
  price: number;
  oldPrice?: number;
  isSale: boolean;
  sizes: string[];
  stock: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: ProductImage[];
}

// Product Detail Page Component
export default function ProductDetailPage() { // Removed params from props
  const router = useRouter();
  const params = useParams(); // Get params using the useParams hook
  const productId = parseInt(params.id as string); // Cast params.id to string

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>('');
  const [addToCartStatus, setAddToCartStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (isNaN(productId)) {
      setError('Invalid Product ID.');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setMainImage(response.data.images[0].imagePath);
        }
        if (response.data.sizes && response.data.sizes.length > 0 && response.data.sizes[0] !== 'N/A') {
          setSelectedSize(response.data.sizes[0]);
        }
      } catch (err: unknown) {
        console.error(`Failed to fetch product ${productId}:`, err);
        if (err instanceof Error) {
          setError(`Failed to load product: ${err.message}`);
        } else {
          setError('Failed to load product: An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // Dependency on productId ensures refetch if route changes

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize || selectedSize === 'Select Size') {
      setAddToCartStatus('error');
      setError('Please select a size.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (quantity <= 0) {
      setAddToCartStatus('error');
      setError('Quantity must be at least 1.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (product.stock < quantity) {
      setAddToCartStatus('error');
      setError(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0]?.imagePath || 'https://placehold.co/400x300/E0E0E0/808080?text=No+Image',
      size: selectedSize,
    };
    addItemToCart(itemToAdd, quantity);
    setAddToCartStatus('success');
    setTimeout(() => setAddToCartStatus('idle'), 2000);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <Loader2 className="animate-spin h-12 w-12 text-purple-500 mb-4" />
        <span className="text-xl text-purple-600">Loading product details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-xl text-red-600 mb-4">Product not found.</p>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        {/* Product Image Gallery */}
        <div className="flex flex-col items-center">
          <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={mainImage || 'https://placehold.co/600x450/E0E0E0/808080?text=No+Image'}
              alt={product.name}
              fill={true}
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
            />
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4">
            {product.images.map((image) => (
              <motion.div
                key={image.id}
                className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer border-2 ${
                  mainImage === image.imagePath ? 'border-purple-600' : 'border-gray-200'
                } hover:border-purple-400 transition-colors duration-200`}
                onClick={() => setMainImage(image.imagePath)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={image.imagePath}
                  alt={`Thumbnail of ${product.name} - ${image.color || ''}`}
                  fill={true}
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-gray-700 text-lg mb-6">{product.description}</p>

          <div className="flex items-baseline gap-4 mb-6">
            {product.oldPrice && product.isSale ? (
              <>
                <span className="text-2xl text-gray-400 line-through">
                  {product.oldPrice.toFixed(2)}DA
                </span>
                <span className="text-4xl font-extrabold text-green-600">
                  {product.price.toFixed(2)}DA
                </span>
              </>
            ) : (
              <span className="text-4xl font-extrabold text-indigo-600">
                {product.price.toFixed(2)}DA
              </span>
            )}
          </div>

          {/* Size Selection */}
          {product.sizes.length > 0 && product.sizes[0] !== 'N/A' && (
            <div className="mb-6">
              <label htmlFor="size" className="block text-gray-700 text-lg font-medium mb-2">
                Select Size:
              </label>
              <select
                id="size"
                name="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
                disabled={isOutOfStock}
              >
                <option value="">Select Size</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {isOutOfStock && (
                <p className="text-red-500 text-sm mt-2 font-semibold">Currently out of stock.</p>
              )}
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-gray-700 text-lg font-medium mb-2">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all text-center"
              disabled={isOutOfStock}
            />
            {product.stock > 0 && <p className="text-gray-500 text-sm mt-2">Only {product.stock} left in stock!</p>}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            className={`w-full py-4 px-6 rounded-full text-lg font-bold shadow-md transition-all duration-300 transform ${
              isOutOfStock || !selectedSize ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 active:scale-95'
            }`}
            disabled={isOutOfStock || !selectedSize}
            whileTap={{ scale: 0.98 }}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </motion.button>

          {addToCartStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mt-4 text-green-600 font-semibold bg-green-50 p-3 rounded-lg border border-green-200"
            >
              <CheckCircle size={20} className="mr-2" /> Item added to cart!
            </motion.div>
          )}
          {addToCartStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mt-4 text-red-600 font-semibold bg-red-50 p-3 rounded-lg border border-red-200"
            >
              <XCircle size={20} className="mr-2" /> {error}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}