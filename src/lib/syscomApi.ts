const SYSCOM_API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/syscom-api`;

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export interface SyscomCategory {
  id: string;
  nombre: string;
  nivel: number;
}

export interface SyscomProduct {
  producto_id: string;
  modelo: string;
  titulo: string;
  marca: string;
  garantia: string;
  img_portada: string;
  marca_logo: string;
  total_existencia: number;
  precios: {
    precio_1: string;
    precio_especial: string;
    precio_descuento: string;
    precio_lista: string;
    volumen?: Record<string, string>;
  };
  existencia: {
    nuevo: number;
  };
  categorias: SyscomCategory[];
  link: string;
}

export interface SyscomProductResponse {
  cantidad: number;
  pagina: string;
  paginas: number;
  productos: SyscomProduct[];
}

export async function fetchCategories(): Promise<SyscomCategory[]> {
  const res = await fetch(`${SYSCOM_API_URL}/categorias`, { headers });
  if (!res.ok) throw new Error('Error fetching categories');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function fetchProductsByCategory(
  categoryId: string,
  page: number = 1
): Promise<{ products: SyscomProduct[]; total: number; pages: number }> {
  const res = await fetch(
    `${SYSCOM_API_URL}/productos?categoria=${categoryId}&pagina=${page}`,
    { headers }
  );
  if (!res.ok) throw new Error('Error fetching products');
  const data: SyscomProductResponse = await res.json();
  return {
    products: data.productos || [],
    total: data.cantidad || 0,
    pages: data.paginas || 1,
  };
}

export async function searchProducts(
  query: string,
  page: number = 1
): Promise<{ products: SyscomProduct[]; total: number; pages: number }> {
  try {
    const url = `${SYSCOM_API_URL}/productos?busqueda=${encodeURIComponent(query)}&pagina=${page}`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Search API error:', res.status, errorText);
      throw new Error(`API error: ${res.status}`);
    }

    const data: SyscomProductResponse = await res.json();
    return {
      products: data.productos || [],
      total: data.cantidad || 0,
      pages: data.paginas || 1,
    };
  } catch (err) {
    console.error('searchProducts error:', err);
    throw err;
  }
}

export interface SyscomBrand {
  id: string;
  nombre: string;
}

export async function fetchBrands(): Promise<SyscomBrand[]> {
  const res = await fetch(`${SYSCOM_API_URL}/marcas`, { headers });
  if (!res.ok) throw new Error('Error fetching brands');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export interface CartItem {
  id: string;
  tipo: string;
  cantidad: number;
}

export interface CartAddress {
  atencion_a: string;
  calle: string;
  colonia: string;
  num_ext: string;
  num_int?: string;
  codigo_postal: string;
  ciudad: string;
  estado: string;
  pais: string;
  telefono: string;
}

export interface CartOrder {
  tipo_entrega: 'domicilio' | 'sucursal';
  direccion: CartAddress;
  metodo_pago: string;
  productos: CartItem[];
  moneda: 'mxn' | 'usd';
  uso_cfdi: string;
  tipo_pago?: 'pue' | 'ppd';
  ordenar?: boolean;
  testmode?: boolean;
}

export async function getPaymentMethods(): Promise<unknown[]> {
  const res = await fetch(`${SYSCOM_API_URL}/carrito/pago`, { headers });
  if (!res.ok) throw new Error('Error fetching payment methods');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function getCountries(): Promise<unknown[]> {
  const res = await fetch(`${SYSCOM_API_URL}/carrito/paises`, { headers });
  if (!res.ok) throw new Error('Error fetching countries');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function getStates(postalCode: string): Promise<unknown[]> {
  const res = await fetch(`${SYSCOM_API_URL}/carrito/estados/${postalCode}`, { headers });
  if (!res.ok) throw new Error('Error fetching states');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function getColonies(postalCode: string): Promise<string[]> {
  const res = await fetch(`${SYSCOM_API_URL}/carrito/colonias/${postalCode}`, { headers });
  if (!res.ok) throw new Error('Error fetching colonies');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getShippingCompanies(): Promise<unknown[]> {
  const res = await fetch(`${SYSCOM_API_URL}/carrito/fleteras`, { headers });
  if (!res.ok) throw new Error('Error fetching shipping companies');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function getWarehouses(): Promise<unknown[]> {
  const res = await fetch(`${SYSCOM_API_URL}/carrito/sucursales`, { headers });
  if (!res.ok) throw new Error('Error fetching warehouses');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function getCFDIUsage(): Promise<unknown[]> {
  const res = await fetch(`${SYSCOM_API_URL}/carrito/cfdi`, { headers });
  if (!res.ok) throw new Error('Error fetching CFDI usage');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function getAddresses(): Promise<CartAddress[]> {
  const res = await fetch(`${SYSCOM_API_URL}/carrito/direcciones`, { headers });
  if (!res.ok) throw new Error('Error fetching addresses');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function createAddress(address: CartAddress): Promise<CartAddress> {
  const params = new URLSearchParams();
  Object.entries(address).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const res = await fetch(`${SYSCOM_API_URL}/carrito/direcciones?${params.toString()}`, {
    method: 'POST',
    headers,
  });
  if (!res.ok) throw new Error('Error creating address');
  const data = await res.json();
  return data;
}

export async function updateAddress(id: string, address: CartAddress): Promise<CartAddress> {
  const params = new URLSearchParams();
  Object.entries(address).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const res = await fetch(`${SYSCOM_API_URL}/carrito/direcciones/${id}?${params.toString()}`, {
    method: 'POST',
    headers,
  });
  if (!res.ok) throw new Error('Error updating address');
  const data = await res.json();
  return data;
}

export async function deleteAddress(id: string): Promise<void> {
  const res = await fetch(`${SYSCOM_API_URL}/carrito/direcciones/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Error deleting address');
}

export async function generateOrder(order: CartOrder): Promise<unknown> {
  const params = new URLSearchParams();
  params.append('tipo_entrega', order.tipo_entrega);
  params.append('direccion', JSON.stringify(order.direccion));
  params.append('metodo_pago', order.metodo_pago);
  params.append('productos', JSON.stringify(order.productos));
  params.append('moneda', order.moneda);
  params.append('uso_cfdi', order.uso_cfdi);
  if (order.tipo_pago) params.append('tipo_pago', order.tipo_pago);
  if (order.ordenar !== undefined) params.append('ordenar', order.ordenar.toString());
  if (order.testmode !== undefined) params.append('testmode', order.testmode.toString());

  const res = await fetch(`${SYSCOM_API_URL}/carrito/generar?${params.toString()}`, {
    method: 'POST',
    headers,
  });
  if (!res.ok) throw new Error('Error generating order');
  const data = await res.json();
  return data;
}

export async function getExchangeRate(): Promise<{ normal: string; un_dia?: string }> {
  const res = await fetch(`${SYSCOM_API_URL}/tipocambio`, { headers });
  if (!res.ok) throw new Error('Error fetching exchange rate');
  const data = await res.json();
  return data;
}
