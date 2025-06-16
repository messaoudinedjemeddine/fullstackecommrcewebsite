// components/ScrollToTopButton.tsx
'use client'; // This is a Client Component

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react'; // Icon for the button

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) { // Show button after scrolling 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll the page to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scroll animation
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 100 }} // Starts invisible and below
          animate={{ opacity: 1, y: 0 }} // Animates to visible and in place
          exit={{ opacity: 0, y: 100 }} // Animates out when hidden
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg z-50 focus:outline-none focus:ring-4 focus:ring-purple-300 transform hover:scale-110 transition-transform duration-200"
          aria-label="Scroll to top"
        >
          <ChevronUp size={28} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;