// Detalle de producto Syscom — ficha completa (GET /productos/{id}).
// Pasa por la misma Edge Function syscom-api que ya usa el catálogo.
// moneda=mxn hace que Syscom devuelva los precios ya en MXN, sin conversión.
// imagenes=1 trae todas las fotos, descripcion=1 la descripción HTML,
// recursos=1 los documentos (ficha técnica, manuales).

const SYSCOM_API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/syscom-api`;

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export interface SyscomProductDetail {
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
  existencia: { nuevo: number };
  categorias: { id: string; nombre: string; nivel: number }[];
  link: string;
  imagenes?: string[];
  imagen_360?: string[];
  descripcion?: string;
  caracteristicas?: string[];
  recursos?: { recurso: string; path: string }[];
  peso?: string;
  alto?: string;
  largo?: string;
  ancho?: string;
}

export async function fetchProductDetail(id: string): Promise<SyscomProductDetail> {
  const res = await fetch(
    `${SYSCOM_API_URL}/productos/${encodeURIComponent(id)}?imagenes=1&descripcion=1&recursos=1&moneda=mxn`,
    { headers }
  );
  if (!res.ok) throw new Error('Error cargando el detalle del producto');
  const data = await res.json();
  const detalle = Array.isArray(data) ? data[0] : data;
  if (!detalle) throw new Error('Producto no encontrado');
  return detalle as SyscomProductDetail;
}
