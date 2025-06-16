// app/layout.tsx
import './globals.css'; // Your global Tailwind CSS file
import { Inter } from 'next/font/google'; // Import Google Font
import Navbar from '@/components/Navbar'; // Import Navbar component
import Footer from '@/components/Footer'; // Import Footer component
import ScrollToTopButton from '@/components/ScrollToTopButton';

// Configure Inter font with desired subsets
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadata for your application (SEO, etc.)
export const metadata = {
  title: 'eShop - Your Online Store for Algeria',
  description: 'A modern e-commerce platform for the Algerian market built with Next.js, Tailwind CSS, and Node.js.',
};

// RootLayout component definition
export default function RootLayout({
  children, // This prop represents the content of your pages
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      {/* Apply the Inter font to the body */}
      <body className={`${inter.className} bg-secondary-50 text-gray-dark antialiased`}>
        {/* Navbar is sticky at the top */}
        <Navbar />
        {/* Main content area. Adds padding to prevent content from being hidden under fixed navbar */}
        <main className="min-h-screen pt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {children} {/* This is where your individual page content will be rendered */}
          </div>
        </main>
        {/* Footer at the bottom */}
        <Footer />
        <ScrollToTopButton />
      </body>
    </html>
  );
}