// app/about/page.tsx
'use client'; // This is a Client Component

import { motion, easeOut } from 'framer-motion';
import { Lightbulb, Rocket, Handshake } from 'lucide-react'; // Icons for sections

export default function AboutUsPage() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  return (
    <div className="container mx-auto px-4 py-16 text-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold text-purple-700 mb-12 drop-shadow-md text-center"
      >
        About Our Store
      </motion.h1>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg p-8 mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Lightbulb size={32} className="text-purple-600 mr-3" /> Our Mission
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          At <strong>eShop</strong>, our mission is to redefine the online shopping experience for the Algerian market. We are committed to providing a seamless, secure, and enjoyable platform where customers can discover a diverse range of high-quality products, delivered with efficiency and care across all 58 wilayas.
        </p>
        <p className="text-lg leading-relaxed">
          We believe in empowering local businesses by offering them a robust channel to reach customers nationwide, while ensuring our customers receive the best value and convenience at every step.
        </p>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.6, ease: easeOut }}
        className="bg-white rounded-xl shadow-lg p-8 mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Rocket size={32} className="text-purple-600 mr-3" /> Our Vision
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          To become the leading e-commerce destination in Algeria, recognized for our extensive product catalog, innovative delivery solutions, and unwavering commitment to customer satisfaction. We envision a future where every Algerian has access to their desired products with just a few clicks, fostering economic growth and digital convenience.
        </p>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4, duration: 0.6, ease: easeOut }}
        className="bg-white rounded-xl shadow-lg p-8 mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Handshake size={32} className="text-purple-600 mr-3" /> Our Values
        </h2>
        <ul className="list-disc list-inside text-lg leading-relaxed space-y-2">
          <li><strong>Customer Centricity:</strong> Our customers are at the heart of everything we do.</li>
          <li><strong>Integrity:</strong> Conducting our business with honesty and transparency.</li>
          <li><strong>Innovation:</strong> Continuously seeking new ways to improve and grow.</li>
          <li><strong>Efficiency:</strong> Delivering products swiftly and reliably.</li>
          <li><strong>Community:</strong> Contributing positively to the Algerian digital economy.</li>
        </ul>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center mt-12"
      >
        <p className="text-xl font-semibold text-gray-700">
          Thank you for choosing eShop. We look forward to serving you!
        </p>
      </motion.div>
    </div>
  );
}