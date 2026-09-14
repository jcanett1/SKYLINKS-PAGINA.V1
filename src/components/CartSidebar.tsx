import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard, MapPin, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  exterior: string;
  interior: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
}

const emptyShipping: ShippingInfo = {
  fullName: '',
  email: '',
  phone: '',
  street: '',
  exterior: '',
  interior: '',
  neighborhood: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'México',
  notes: '',
};

const mexicanStates = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
  'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
  'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
];

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    sessionId,
  } = useCart();

  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shipping, setShipping] = useState<ShippingInfo>(emptyShipping);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const validateShipping = (): boolean => {
    const required: (keyof ShippingInfo)[] = ['fullName', 'email', 'phone', 'street', 'exterior', 'neighborhood', 'city', 'state', 'postalCode'];
    for (const field of required) {
      if (!shipping[field].trim()) {
        toast.error('Por favor completa todos los campos de envío');
        return false;
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shipping.email)) {
      toast.error('Por favor ingresa un email válido');
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!validateShipping()) return;
    if (items.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            product_image: item.product_image,
            product_price: item.product_price,
            product_sku: item.product_sku,
            quantity: item.quantity,
            category: item.category,
          })),
          shipping,
          user_session: sessionId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió la URL de pago');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setShowQuoteForm(false);
    setShowCheckout(false);
    setShipping(emptyShipping);
    closeCart();
  };

  if (!isOpen) return null;

  const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan transition-colors';

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white text-gray-900 shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" style={{ color: '#0A2540' }} />
            <h2 className="text-xl font-bold" style={{ color: '#0A2540' }}>
              {showCheckout ? 'Información de Envío' : 'Mi Carrito'}
            </h2>
            {totalItems > 0 && !showCheckout && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: '#00C853' }}
              >
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {showCheckout ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <MapPin className="w-4 h-4" />
                <span>Indica dónde enviar tu pedido</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre completo *</label>
                <input
                  type="text"
                  value={shipping.fullName}
                  onChange={(e) => handleShippingChange('fullName', e.target.value)}
                  className={inputCls}
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                  <input
                    type="email"
                    value={shipping.email}
                    onChange={(e) => handleShippingChange('email', e.target.value)}
                    className={inputCls}
                    placeholder="juan@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) => handleShippingChange('phone', e.target.value)}
                    className={inputCls}
                    placeholder="622 123 4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Calle *</label>
                  <input
                    type="text"
                    value={shipping.street}
                    onChange={(e) => handleShippingChange('street', e.target.value)}
                    className={inputCls}
                    placeholder="Av. Principal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">No. Ext. *</label>
                  <input
                    type="text"
                    value={shipping.exterior}
                    onChange={(e) => handleShippingChange('exterior', e.target.value)}
                    className={inputCls}
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">No. Interior</label>
                  <input
                    type="text"
                    value={shipping.interior}
                    onChange={(e) => handleShippingChange('interior', e.target.value)}
                    className={inputCls}
                    placeholder="Apto 4B"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Colonia *</label>
                  <input
                    type="text"
                    value={shipping.neighborhood}
                    onChange={(e) => handleShippingChange('neighborhood', e.target.value)}
                    className={inputCls}
                    placeholder="Centro"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">C.P. *</label>
                  <input
                    type="text"
                    value={shipping.postalCode}
                    onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                    className={inputCls}
                    placeholder="85400"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ciudad *</label>
                  <input
                    type="text"
                    value={shipping.city}
                    onChange={(e) => handleShippingChange('city', e.target.value)}
                    className={inputCls}
                    placeholder="Guaymas"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Estado *</label>
                <select
                  value={shipping.state}
                  onChange={(e) => handleShippingChange('state', e.target.value)}
                  className={`${inputCls} cursor-pointer`}
                >
                  <option value="" disabled>Selecciona un estado</option>
                  {mexicanStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Notas de entrega (opcional)</label>
                <textarea
                  value={shipping.notes}
                  onChange={(e) => handleShippingChange('notes', e.target.value)}
                  className={`${inputCls} resize-none`}
                  rows={2}
                  placeholder="Referencias, horario de entrega, etc."
                />
              </div>

              {/* Order summary */}
              <div className="rounded-xl bg-gray-50 p-4 space-y-2 mt-4">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Resumen del pedido</p>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-gray-600">
                    <span className="truncate flex-1 mr-2">{item.product_name} × {item.quantity}</span>
                    <span className="font-semibold">${(item.product_price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="text-sm font-bold text-gray-800">Total</span>
                  <span className="text-sm font-bold" style={{ color: '#0A2540' }}>
                    ${totalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                  </span>
                </div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">Tu carrito está vacío</p>
              <p className="text-sm mt-1">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">
                      {item.product_name}
                    </h4>
                    {item.product_sku && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        SKU: {item.product_sku}
                      </p>
                    )}
                    <p
                      className="text-sm font-bold mt-1"
                      style={{ color: '#0A2540' }}
                    >
                      ${item.product_price.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} MXN
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            {showCheckout ? (
              <>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: '#635BFF' }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pagar ${totalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowCheckout(false)}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                >
                  Volver al carrito
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Subtotal</span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: '#0A2540' }}
                  >
                    ${totalPrice.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} MXN
                  </span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: '#635BFF' }}
                >
                  <CreditCard className="w-4 h-4" />
                  Comprar ahora
                </button>
                <button
                  onClick={() => setShowQuoteForm(true)}
                  className="w-full py-2.5 rounded-xl font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                >
                  Solicitar cotización
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2.5 rounded-xl font-semibold text-gray-400 hover:text-gray-600 transition-colors text-xs"
                >
                  Vaciar carrito
                </button>
              </>
            )}
          </div>
        )}

        {/* Quote form modal */}
        {showQuoteForm && items.length > 0 && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">Datos para la cotización</h3>
              <button
                onClick={() => setShowQuoteForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <QuoteForm
              items={items}
              totalPrice={totalPrice}
              onSent={() => { setShowQuoteForm(false); clearCart(); handleClose(); }}
            />
          </div>
        )}
      </div>
    </>
  );
}

function QuoteForm({ items, totalPrice, onSent }: { items: ReturnType<typeof useCart>['items']; totalPrice: number; onSent: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !phone) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    setSubmitting(true);
    try {
      const cartItems = items
        .map((item) => `${item.product_name} (SKU: ${item.product_sku}) - Cantidad: ${item.quantity} - $${item.product_price.toFixed(2)} MXN`)
        .join('\n');
      const whatsappMessage = encodeURIComponent(
        `Hola, me gustaría solicitar una cotización para:\n\n${cartItems}\n\nTotal: $${totalPrice.toFixed(2)} MXN\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}`
      );
      window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
      toast.success('¡Solicitud de cotización enviada! Nos pondremos en contacto pronto.');
      onSent();
    } catch (error) {
      console.error('Error sending quote:', error);
      toast.error('Error al enviar la cotización');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 mb-3';

  return (
    <div className="flex-1 flex flex-col">
      <input type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      <input type="tel" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-auto"
        style={{ background: '#00C853' }}
      >
        <ArrowRight className="w-4 h-4" />
        {submitting ? 'Enviando...' : 'Enviar Cotización'}
      </button>
    </div>
  );
}
