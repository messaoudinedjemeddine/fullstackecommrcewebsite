// components/Footer.tsx
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 mt-16 shadow-inner">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-purple-400">eShop</h3>
          <p className="text-gray-300 text-sm">
            Your one-stop shop for amazing products in Algeria. Quality and customer satisfaction guaranteed.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-purple-400">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="text-gray-300 hover:text-purple-300 transition-colors text-sm">Home</Link></li>
            <li><Link href="/store" className="text-gray-300 hover:text-purple-300 transition-colors text-sm">Store</Link></li>
            <li><Link href="/cart" className="text-gray-300 hover:text-purple-300 transition-colors text-sm">Cart</Link></li>
            <li><Link href="/about" className="text-gray-300 hover:text-purple-300 transition-colors text-sm">About Us</Link></li>
            <li><Link href="/contact" className="text-gray-300 hover:text-purple-300 transition-colors text-sm">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-purple-400">Contact Us</h3>
          <p className="text-gray-300 text-sm">
            Email: info@eshop.dz <br />
            Phone: +213 5XX XXX XXX <br />
            Address: 123 Commerce St, Algiers, Algeria
          </p>
          <div className="flex space-x-4 mt-4">
            {/* Placeholder for social media icons */}
            <a href="#" className="text-gray-300 hover:text-purple-300 transition-colors">Facebook</a>
            <a href="#" className="text-gray-300 hover:text-purple-300 transition-colors">Instagram</a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 text-center mt-8 pt-6 border-t border-gray-700">
        <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} eShop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;