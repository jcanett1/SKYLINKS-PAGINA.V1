import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  product_price: number;
  product_sku: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  sessionId: string;
}

const CartContext = createContext<CartContextType | null>(null);

function getSessionId(): string {
  let id = localStorage.getItem('skylinks_session');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('skylinks_session', id);
  }
  return id;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(getSessionId);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_session', sessionId);

    if (data) {
      setItems(
        data.map((row) => ({
          id: row.id,
          product_id: row.product_id,
          product_name: row.product_name,
          product_image: row.product_image || '',
          product_price: Number(row.product_price),
          product_sku: row.product_sku || '',
          quantity: row.quantity,
          category: row.category || '',
        }))
      );
    }
  };

  const addItem = useCallback(
    async (item: Omit<CartItem, 'id'>) => {
      const existing = items.find((i) => i.product_id === item.product_id);
      if (existing) {
        await updateQuantity(existing.id, existing.quantity + item.quantity);
        return;
      }

      if (!isSupabaseConfigured) {
        setItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }]);
        setIsOpen(true);
        return;
      }

      const { data } = await supabase
        .from('cart_items')
        .insert([
          {
            user_session: sessionId,
            product_id: item.product_id,
            product_name: item.product_name,
            product_image: item.product_image,
            product_price: item.product_price,
            product_sku: item.product_sku,
            quantity: item.quantity,
            category: item.category,
          },
        ])
        .select()
        .maybeSingle();

      if (data) {
        setItems((prev) => [
          ...prev,
          {
            id: data.id,
            product_id: data.product_id,
            product_name: data.product_name,
            product_image: data.product_image || '',
            product_price: Number(data.product_price),
            product_sku: data.product_sku || '',
            quantity: data.quantity,
            category: data.category || '',
          },
        ]);
      }
      setIsOpen(true);
    },
    [items, sessionId]
  );

  const removeItem = useCallback(async (id: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('cart_items').delete().eq('id', id);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback(
    async (id: string, qty: number) => {
      if (qty < 1) {
        await removeItem(id);
        return;
      }
      if (isSupabaseConfigured) {
        await supabase.from('cart_items').update({ quantity: qty }).eq('id', id);
      }
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.from('cart_items').delete().eq('user_session', sessionId);
    }
    setItems([]);
  }, [sessionId]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product_price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((p) => !p),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        sessionId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
