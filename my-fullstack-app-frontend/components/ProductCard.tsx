'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-2 cursor-pointer border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <Image
            src={product.images[0]?.imagePath || 'https://placehold.co/400x300/E0E0E0/808080?text=No+Image'}
            alt={product.name}
            fill={true}
            style={{ objectFit: 'cover' }}
            className="rounded-t-xl transition-transform duration-500 group-hover:scale-110"
          />
          {product.isSale && (
            <motion.span 
              className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              SALE!
            </motion.span>
          )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
          <h3 className="text-2xl font-bold text-primary-600 mb-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">
            {product.description || 'No description available.'}
          </p>
          {product.sizes.length > 0 && product.sizes[0] !== 'N/A' && (
            <p className="text-gray-500 text-xs mb-2">Sizes: {product.sizes.join(', ')}</p>
          )}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="flex flex-col">
              {product.oldPrice && product.isSale ? (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {product.oldPrice.toFixed(2)} DA
                  </span>
                  <span className="text-3xl font-extrabold text-primary-600">
                    {product.price.toFixed(2)} DA
                  </span>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-primary-600">
                  {product.price.toFixed(2)} DA
                </span>
              )}
            </div>
            <motion.button 
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 