// store/cartStore.ts
import { create } from 'zustand';

// Define the type for a product in the cart (a simplified version)
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size: string; // Size chosen for this specific item in cart
}

// Define the shape of your cart store's state
interface CartState {
  items: CartItem[];
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void; // Omit quantity from initial item add
  removeItem: (itemId: number, size: string) => void;
  updateQuantity: (itemId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  // Selector for getting cart item count
  getCartItemCount: () => number;
}

// Create the Zustand store
const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalPrice: 0,

  addItem: (item, quantity) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => i.id === item.id && i.size === item.size
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = state.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
        return {
          items: updatedItems,
          totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };
      } else {
        // New item, add to cart
        const newItems = [...state.items, { ...item, quantity }];
        return {
          items: newItems,
          totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };
      }
    });
  },

  removeItem: (itemId, size) => {
    set((state) => {
      const filteredItems = state.items.filter(
        (item) => !(item.id === itemId && item.size === size)
      );
      return {
        items: filteredItems,
        totalPrice: filteredItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      };
    });
  },

  updateQuantity: (itemId, size, quantity) => {
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === itemId && item.size === size ? { ...item, quantity: Math.max(1, quantity) } : item // Ensure quantity is at least 1
      );
      return {
        items: updatedItems,
        totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      };
    });
  },

  clearCart: () => {
    set({ items: [], totalPrice: 0 });
  },

  getCartItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));

export default useCartStore;