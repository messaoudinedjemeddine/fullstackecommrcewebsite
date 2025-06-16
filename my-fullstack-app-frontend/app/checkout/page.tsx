// app/checkout/page.tsx
'use client'; // This is a Client Component

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import * as z from 'zod'; // Import Zod
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CheckCircle, XCircle, Loader2, Home, MapPin, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import useCartStore from '@/store/cartStore';
import axios from 'axios'; // Import axios here to use axios.isAxiosError

// --- Zod Schema for Form Validation ---
const checkoutSchema = z.object({
  name: z.string().min(3, 'Full name is required (min 3 characters)').max(100),
  phone: z.string().regex(/^(\+213|0)([5-7]\d{8})$/, 'Invalid Algerian phone number (e.g., 07XXXXXXXX, +2137XXXXXXXX)'),
  wilayaId: z.string().min(1, 'Please select your Wilaya (City)'),
  deliveryType: z.enum(['HOME', 'DESK'], { message: 'Please select a delivery type' }),
  deliveryDeskId: z.string().optional(),
  address: z.string().optional(),
  clientNote: z.string().max(500, 'Note must be 500 characters or less').optional(),
}).superRefine((data, ctx) => {
  if (data.deliveryType === 'HOME' && !data.address) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Full Address is required for Home Delivery.',
      path: ['address'],
    });
  }
  if (data.deliveryType === 'DESK' && !data.deliveryDeskId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Delivery Desk is required for Pick-up from Desk.',
      path: ['deliveryDeskId'],
    });
  }
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// --- Type Definitions for API Data ---
interface City {
  id: number;
  name: string;
  homeFee: number;
  deliveryDesks: DeliveryDesk[];
}

interface DeliveryDesk {
  id: number;
  cityId: number;
  name: string;
  deskFee: number;
}

interface OrderItemPayload {
  productId: number;
  quantity: number;
  size: string;
  price: number;
}

interface OrderPayload {
  userId?: number;
  total: number;
  deliveryType: 'HOME' | 'DESK';
  deliveryCityId: number;
  deliveryDeskId?: number;
  address?: string;
  clientNote?: string;
  orderItems: OrderItemPayload[];
}

// --- Checkout Page Component ---
export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, totalPrice, clearCart } = useCartStore();
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [citiesError, setCitiesError] = useState('');
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, watch, formState: { errors }, setValue, trigger } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryType: 'HOME',
      name: '',
      phone: '',
      wilayaId: '',
      address: '',
      clientNote: '',
      deliveryDeskId: '',
    },
  });

  const deliveryType = watch('deliveryType');
  const selectedWilayaId = watch('wilayaId');
  const selectedDeliveryDeskId = watch('deliveryDeskId');

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      setCitiesError('');
      try {
        const response = await api.get('/cities');
        setCities(response.data);
        if (response.data.length > 0) {
          setValue('wilayaId', response.data[0].id.toString());
        }
      } catch (err: unknown) {
        console.error("Failed to fetch cities:", err);
        if (err instanceof Error) {
          setCitiesError(`Failed to load delivery options: ${err.message}`);
        } else {
          setCitiesError('Failed to load delivery options: An unknown error occurred.');
        }
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [setValue]);

  useEffect(() => {
    const calculateFee = () => {
      if (!selectedWilayaId) {
        setDeliveryFee(0);
        return;
      }
      const wilaya = cities.find(c => c.id.toString() === selectedWilayaId);
      if (!wilaya) {
        setDeliveryFee(0);
        return;
      }

      if (deliveryType === 'HOME') {
        setDeliveryFee(wilaya.homeFee);
        setValue('deliveryDeskId', '');
        trigger('deliveryDeskId');
        trigger('address');
      } else {
        const selectedDesk = wilaya.deliveryDesks.find(d => d.id.toString() === selectedDeliveryDeskId);
        if (selectedDesk) {
          setDeliveryFee(selectedDesk.deskFee);
          setValue('address', '');
          trigger('address');
          trigger('deliveryDeskId');
        } else {
          setDeliveryFee(0);
        }
      }
    };
    calculateFee();
  }, [selectedWilayaId, deliveryType, selectedDeliveryDeskId, cities, setValue, trigger]);


  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setSubmitError('');

    if (cartItems.length === 0) {
      setSubmitError('Your cart is empty. Please add items before checking out.');
      setIsSubmitting(false);
      return;
    }

    try {
      const orderItemsPayload: OrderItemPayload[] = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      }));

      const orderPayload: OrderPayload = {
        total: totalPrice + deliveryFee,
        deliveryType: data.deliveryType,
        deliveryCityId: parseInt(data.wilayaId),
        deliveryDeskId: data.deliveryDeskId ? parseInt(data.deliveryDeskId) : undefined,
        address: data.deliveryType === 'HOME' ? data.address : undefined,
        clientNote: data.clientNote,
        orderItems: orderItemsPayload,
      };

      const response = await api.post('/orders', orderPayload);

      if (response.status === 201) {
        clearCart();
        router.push(`/success?orderId=${response.data.orderId}`);
      } else {
        setSubmitError('Failed to place order. Please try again.');
      }
    } catch (err: unknown) { // Use unknown for caught errors
      console.error("Order submission error:", err);
      // Check if it's an Axios error and access response data
      if (axios.isAxiosError(err) && err.response) {
        setSubmitError(`Order failed: ${err.response.data.message || err.response.statusText}`);
      } else if (err instanceof Error) {
        setSubmitError(`Order failed: ${err.message}`);
      } else {
        setSubmitError('Order failed: An unknown error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Loading, Error, Empty Cart States ---
  if (loadingCities) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <Loader2 className="animate-spin h-12 w-12 text-purple-500 mb-4" />
        <span className="text-xl text-purple-600">Loading delivery options...</span>
      </div>
    );
  }

  if (citiesError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-xl text-red-600 mb-4">{citiesError}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8 text-center rounded-xl shadow-lg">
        <ShoppingCart size={64} className="text-gray-400 mx-auto mb-6" />
        <p className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty!</p>
        <p className="text-gray-600 mb-8">You need to add items to your cart before checking out.</p>
        <Link href="/store">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transition-colors duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center mx-auto">
            <ArrowLeft size={20} className="mr-2" /> Go to Store
          </button>
        </Link>
      </div>
    );
  }

  const selectedWilaya = cities.find(c => c.id.toString() === selectedWilayaId);
  const availableDesks = selectedWilaya ? selectedWilaya.deliveryDesks : [];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 mb-12 drop-shadow-md text-center">
        Checkout
      </h1>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Information</h2>

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
            <p className="font-bold">Submission Error:</p>
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Full Name:
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-purple-500 focus:border-purple-500 transition-all"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>}
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number:
          </label>
          <input
            type="tel" // Use tel for phone numbers
            id="phone"
            {...register('phone')}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-purple-500 focus:border-purple-500 transition-all"
            placeholder="07XXXXXXXX or +2137XXXXXXXX"
          />
          {errors.phone && <p className="text-red-500 text-xs italic mt-1">{errors.phone.message}</p>}
        </div>

        {/* Wilaya (City) Selection */}
        <div className="mb-4">
          <label htmlFor="wilayaId" className="block text-gray-700 text-sm font-bold mb-2">
            Select Wilaya (City):
          </label>
          <select
            id="wilayaId"
            {...register('wilayaId')}
            className="shadow border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-purple-500 focus:border-purple-500 transition-all"
          >
            <option value="">-- Select Wilaya --</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id.toString()}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.wilayaId && <p className="text-red-500 text-xs italic mt-1">{errors.wilayaId.message}</p>}
        </div>

        {/* Delivery Type Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Delivery Type:
          </label>
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('deliveryType')}
                value="HOME"
                className="form-radio text-purple-600 h-5 w-5"
              />
              <span className="ml-2 text-gray-700 flex items-center">
                <Home size={18} className="mr-1" /> Home Delivery
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('deliveryType')}
                value="DESK"
                className="form-radio text-purple-600 h-5 w-5"
              />
              <span className="ml-2 text-gray-700 flex items-center">
                <MapPin size={18} className="mr-1" /> Pick-up from Desk
              </span>
            </label>
          </div>
          {errors.deliveryType && <p className="text-red-500 text-xs italic mt-1">{errors.deliveryType.message}</p>}
        </div>

        {/* Conditional Fields based on Delivery Type */}
        <AnimatePresence mode="wait">
          {deliveryType === 'HOME' && (
            <motion.div
              key="home-address"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                  Full Address:
                </label>
                <textarea
                  id="address"
                  {...register('address')}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-purple-500 focus:border-purple-500 transition-all h-24 resize-none"
                  placeholder="Street name, building number, apartment, etc."
                ></textarea>
                {errors.address && <p className="text-red-500 text-xs italic mt-1">{errors.address.message}</p>}
              </div>
            </motion.div>
          )}

          {deliveryType === 'DESK' && selectedWilaya && (
            <motion.div
              key="desk-selection"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mb-4">
                <label htmlFor="deliveryDeskId" className="block text-gray-700 text-sm font-bold mb-2">
                  Select Pick-up Desk:
                </label>
                <select
                  id="deliveryDeskId"
                  {...register('deliveryDeskId')}
                  className="shadow border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-purple-500 focus:border-purple-500 transition-all"
                >
                  <option value="">-- Select Desk --</option>
                  {availableDesks.map((desk) => (
                    <option key={desk.id} value={desk.id.toString()}>
                      {desk.name} ({desk.deskFee.toFixed(2)}DA)
                    </option>
                  ))}
                </select>
                {errors.deliveryDeskId && <p className="text-red-500 text-xs italic mt-1">{errors.deliveryDeskId.message}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Client Note */}
        <div className="mb-6">
          <label htmlFor="clientNote" className="block text-gray-700 text-sm font-bold mb-2">
            Order Note (Optional):
          </label>
          <textarea
            id="clientNote"
            {...register('clientNote')}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-purple-500 focus:border-purple-500 transition-all h-20 resize-none"
            placeholder="e.g., Deliver after 5 PM, call before arrival..."
          ></textarea>
          {errors.clientNote && <p className="text-red-500 text-xs italic mt-1">{errors.clientNote.message}</p>}
        </div>

        {/* Order Summary & Total */}
        <div className="bg-gray-100 p-6 rounded-lg mb-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h3>
          <div className="flex justify-between items-center text-gray-700 text-lg mb-2">
            <span>Subtotal:</span>
            <span className="font-semibold">{totalPrice.toFixed(2)}DA</span>
          </div>
          <div className="flex justify-between items-center text-gray-700 text-lg mb-4">
            <span>Delivery Fee:</span>
            <span className="font-semibold">{deliveryFee.toFixed(2)}DA</span>
          </div>
          <div className="border-t border-gray-300 pt-4 flex justify-between items-center text-3xl font-extrabold text-purple-700">
            <span>Grand Total:</span>
            <span>{(totalPrice + deliveryFee).toFixed(2)}DA</span>
          </div>
        </div>

        {/* Place Order Button */}
        <motion.button
          type="submit"
          className={`w-full py-4 px-6 rounded-full text-lg font-bold shadow-md transition-all duration-300 transform ${
            isSubmitting || cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 active:scale-95'
          }`}
          disabled={isSubmitting || cartItems.length === 0}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? <Loader2 className="animate-spin inline-block mr-2" size={20} /> : <CheckCircle className="inline-block mr-2" size={20} />}
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </motion.button>
      </motion.form>
    </div>
  );
}