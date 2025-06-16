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
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-beige">
        <div className="absolute inset-0 bg-deep-brown-800/80 z-0" />
        <div className="relative z-20 w-full flex flex-col items-center justify-center text-center px-4 py-24">
          <AnimatedSection>
            <h1 className="text-6xl md:text-7xl font-extrabold text-light-beige-50 drop-shadow-xl mb-6 animate-fade-in-up">Discover Your Next Favorite Item</h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl font-light text-light-beige-200 mb-8 animate-fade-in-up">Explore our curated collection of electronics, apparel, and more, tailored for the Algerian market.</p>
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <Link href="/store">
              <AnimatedButton className="relative bg-gradient-gold text-deep-brown-800 font-bold text-lg py-4 px-12 rounded-xl shadow-xl border-0 transition-all duration-300 overflow-hidden group hover:bg-gradient-gold-reverse hover:scale-105">
                <span className="relative z-10">Shop Now</span>
                <span className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-shimmer rounded-xl" />
              </AnimatedButton>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-gradient-beige w-full">
        <div className="max-w-screen-xl mx-auto px-4">
          <AnimatedHeading className="text-4xl font-bold text-center mb-12 text-deep-brown-800">Shop by Category</AnimatedHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <AnimatedSection key={category.id} delay={index * 0.1}>
                <div className="bg-light-beige-200 rounded-xl shadow-card p-8 flex flex-col items-center hover:shadow-xl border border-light-beige-300 hover:border-gold-400 transition-all duration-200 group">
                  <span className="text-4xl mb-4 text-gold-500"><i className="lucide lucide-box" /></span>
                  <h3 className="text-xl font-bold text-deep-brown-800 mb-2">{category.name}</h3>
                  <Link href={`/store?category=${category.id}`} className="text-gold-500 font-semibold group-hover:underline">View Products →</Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-light-beige-50 w-full">
        <div className="max-w-screen-xl mx-auto px-4">
          <AnimatedHeading className="text-4xl font-bold text-center mb-12 text-deep-brown-800">New Arrivals</AnimatedHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.1}>
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* On Sale */}
      <section className="py-16 bg-gradient-beige w-full">
        <div className="max-w-screen-xl mx-auto px-4">
          <AnimatedHeading className="text-4xl font-bold text-center mb-12 text-deep-brown-800">Special Offers</AnimatedHeading>
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