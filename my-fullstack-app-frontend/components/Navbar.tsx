// components/Navbar.tsx
'use client'; // This is a Client Component

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Home, Store, Info, ChevronDown } from 'lucide-react'; // Icons

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Store', href: '/store' },
  {
    name: 'Categories',
    href: '#', // Placeholder, will be a dropdown
    submenu: [
      { name: 'Electronics', href: '/store?category=Electronics' },
      { name: 'Apparel', href: '/store?category=Apparel' },
      { name: 'Home Goods', href: '/store?category=Home%20Goods' },
      { name: 'Books', href: '/store?category=Books' },
      // Fetch dynamic categories from API later
    ],
  },
  { name: 'About Us', href: '/about' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const [scrolled, setScrolled] = useState(false); // State for sticky effect
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); // State for category dropdown

  // Handle scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20); // Add shadow after scrolling 20px
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Toggle category dropdown
  const toggleCategoryDropdown = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  // Framer Motion variants for dropdown animation
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Left: Home & Store Links (Desktop) */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-800 hover:text-purple-600 transition-colors font-medium flex items-center gap-1">
            <Home size={18} /> Home
          </Link>
          <Link href="/store" className="text-gray-800 hover:text-purple-600 transition-colors font-medium flex items-center gap-1">
            <Store size={18} /> Store
          </Link>
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="text-3xl font-bold text-purple-700 hover:text-purple-900 transition-colors">
            eShop
          </Link>
        </div>

        {/* Right: Categories, About Us, Cart, Mobile Menu Toggle (Desktop & Mobile) */}
        <div className="flex items-center space-x-6">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={toggleCategoryDropdown}
                className="text-gray-800 hover:text-purple-600 transition-colors font-medium flex items-center gap-1 focus:outline-none"
              >
                Categories <ChevronDown size={16} className={`ml-1 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 origin-top-right"
                    onMouseLeave={() => setIsCategoryOpen(false)} // Close on mouse leave
                  >
                    {navLinks[2].submenu?.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                        onClick={() => {
                          handleLinkClick();
                          setIsCategoryOpen(false); // Close dropdown on click
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/about" className="text-gray-800 hover:text-purple-600 transition-colors font-medium flex items-center gap-1">
              <Info size={18} /> About Us
            </Link>
          </div>

          {/* Cart Icon (visible on both desktop and mobile) */}
          <Link href="/cart" className="relative text-gray-800 hover:text-purple-600 transition-colors">
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0 {/* Placeholder for cart item count from Zustand */}
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-800 hover:text-purple-600 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Animated) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="md:hidden bg-white shadow-xl py-4"
          >
            <div className="flex flex-col items-center space-y-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.submenu ? (
                    <>
                      <button
                        onClick={toggleCategoryDropdown}
                        className="text-gray-800 hover:text-purple-600 transition-colors font-medium flex items-center gap-1 focus:outline-none"
                      >
                        {link.name} <ChevronDown size={16} className={`ml-1 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isCategoryOpen && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={dropdownVariants}
                            className="flex flex-col items-center mt-2 space-y-2"
                          >
                            {link.submenu.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                                onClick={handleLinkClick}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-gray-800 hover:text-purple-600 transition-colors font-medium"
                      onClick={handleLinkClick}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;