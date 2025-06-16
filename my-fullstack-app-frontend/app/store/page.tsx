// app/store/page.tsx
'use client'; // This is a Client Component

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/utils/api'; // Your Axios API instance
import { Filter, X } from 'lucide-react'; // Removed ChevronDown, ChevronUp as they are not directly used here

// --- Type Definitions (re-using from HomePage) ---
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

// --- Product Card Component (Reusable) ---
// This is the same ProductCard used on the Homepage
const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col transform hover:-translate-y-2 cursor-pointer border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/product/${product.id}`}> {/* Link to product detail page */}
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
          <Image
            src={product.images[0]?.imagePath || 'https://placehold.co/400x300/E0E0E0/808080?text=No+Image'}
            alt={product.name}
            fill={true}
            style={{ objectFit: 'cover' }}
            className="rounded-t-xl"
          />
          {product.isSale && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
              SALE!
            </span>
          )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
          <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
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
                    {product.oldPrice.toFixed(2)}DA
                  </span>
                  <span className="text-3xl font-extrabold text-green-600">
                    {product.price.toFixed(2)}DA
                  </span>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-indigo-600">
                  {product.price.toFixed(2)}DA
                </span>
              )}
            </div>
            {/* Add to Cart button will be enabled on product detail page */}
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition-colors duration-200 transform hover:scale-105">
              View Details
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


// --- Store Page Component ---
export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    sortBy: 'createdAt', // Default sort
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/products', {
          params: {
            category: filters.category,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            size: filters.size, // Size filtering would need backend implementation
            sortBy: filters.sortBy,
          },
        });
        setProducts(response.data);
      } catch (err: unknown) {
        console.error("Failed to fetch products:", err);
        if (err instanceof Error) {
          setError(`Failed to load products: ${err.message}`);
        } else {
          setError('Failed to load products: An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]); // Re-fetch whenever filters change

  // Fetch categories for the filter sidebar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 mb-12 drop-shadow-md text-center">
        Our Store
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-md mb-8 w-full max-w-2xl mx-auto animate-fade-in text-center">
          <p className="font-bold text-lg mb-2">Oops! Something went wrong.</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <button
          className="md:hidden bg-indigo-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 mb-4 hover:bg-indigo-700 transition-colors"
          onClick={toggleSidebar}
        >
          <Filter size={20} />
          {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filter Sidebar */}
        <motion.aside
          className={`fixed top-0 left-0 w-full md:static md:w-1/4 bg-white p-6 rounded-lg shadow-xl md:shadow-none z-40 h-full md:h-auto overflow-y-auto transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
          initial={false}
          animate={{ x: isSidebarOpen ? 0 : (window.innerWidth < 768 ? '-100%' : '0%'), opacity: isSidebarOpen ? 1 : (window.innerWidth < 768 ? 0 : 1) }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
            <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800">
              <X size={28} />
            </button>
          </div>
          <h2 className="hidden md:block text-2xl font-bold text-gray-800 mb-6">Filters</h2>

          {/* Category Filter */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-gray-700 text-lg font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-medium mb-2">Price Range</label>
            <div className="flex gap-4">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Size Filter (Assuming common sizes for simplicity, or fetch dynamic ones) */}
          <div className="mb-6">
            <label htmlFor="size" className="block text-gray-700 text-lg font-medium mb-2">
              Size
            </label>
            <select
              id="size"
              name="size"
              value={filters.size}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
            >
              <option value="">All Sizes</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="N/A">N/A (for non-apparel)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <label htmlFor="sortBy" className="block text-gray-700 text-lg font-medium mb-2">
              Sort By
            </label>
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
            >
              <option value="createdAt">Newest Arrivals</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </motion.aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg animate-pulse">
              <svg className="animate-spin h-10 w-10 text-purple-500 mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xl text-purple-600">Loading products...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-8 bg-yellow-50 rounded-xl shadow-lg border border-yellow-200 text-yellow-800 text-center">
              <p className="text-xl font-semibold">No products found matching your criteria.</p>
              <p className="mt-2 text-sm">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}