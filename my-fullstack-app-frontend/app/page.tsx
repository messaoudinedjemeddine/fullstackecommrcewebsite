// app/page.tsx
'use client'; // This is a Client Component

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { ProductCard } from '@/components/ProductCard';
import { AnimatedSection, AnimatedHeading, AnimatedButton } from '@/components/AnimatedSection';

// --- Type Definitions ---
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

// --- Homepage Component ---
export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        // Fetch New Arrivals
        const newArrivalsResponse = await api.get('/products', {
          params: { sortBy: 'createdAt' }
        });
        setNewArrivals(newArrivalsResponse.data.slice(0, 8));

        // Fetch On Sale Products
        const onSaleResponse = await api.get('/products', {
          params: { isSale: true }
        });
        setOnSaleProducts(onSaleResponse.data.slice(0, 8));

        // Fetch Categories
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data.slice(0, 4)); // Take first 4 categories

      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
      }
    };

    fetchProductsAndCategories();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          poster="https://placehold.co/1920x1080/000000/FFFFFF?text=Video+Placeholder"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-beautiful-sunset-above-the-sea-1186-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-10"></div>

        <div className="relative z-20 text-center p-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">
              Discover Your Next Favorite Item
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto text-gray-200">
              Explore our curated collection of electronics, apparel, and more, tailored for the Algerian market.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <Link href="/store">
              <AnimatedButton className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-xl transition-all duration-300">
                Shop Now
              </AnimatedButton>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedHeading className="text-4xl font-bold text-center mb-12 text-primary-600">
            Shop by Category
          </AnimatedHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <AnimatedSection key={category.id} delay={index * 0.1}>
                <div className="bg-secondary-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-semibold text-primary-600 mb-2">{category.name}</h3>
                  <Link href={`/store?category=${category.id}`} className="text-primary-500 hover:text-primary-600 font-medium">
                    View Products →
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <AnimatedHeading className="text-4xl font-bold text-center mb-12 text-primary-600">
            New Arrivals
          </AnimatedHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.1}>
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* On Sale Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedHeading className="text-4xl font-bold text-center mb-12 text-primary-600">
            Special Offers
          </AnimatedHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {onSaleProducts.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.1}>
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}