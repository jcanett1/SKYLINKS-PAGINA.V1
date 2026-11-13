import { useState, useEffect } from 'react';
import { X, ShoppingBag, Loader2, MessageCircle, FileText } from 'lucide-react';
import { fetchProductDetail, SyscomProductDetail } from '../lib/productDetail';
import { SyscomProduct } from '../lib/syscomApi';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: SyscomProduct;
  categoryId: string;
  onClose: () => void;
}

export default function ProductDetailModal({ product, categoryId, onClose }: ProductDetailModalProps) {
  const [detalle, setDetalle] = useState<SyscomProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    let vivo = true;
    fetchProductDetail(product.producto_id)
      .then((d) => { if (vivo) setDetalle(d); })
      .catch((err) => console.error('Detalle error:', err))
      .finally(() => { if (vivo) setLoading(false); });
    return () => { vivo = false; };
  }, [product.producto_id]);

  const precios = detalle?.precios || product.precios;
  const getPrice = (): number => {
    if (precios.precio_lista) return parseFloat(precios.precio_lista);
    if (precios.precio_1) return parseFloat(precios.precio_1);
    return 0;
  };
  const price = getPrice();
  const listPrice = parseFloat(precios.precio_lista || precios.precio_1 || '0');
  const discount = precios.precio_descuento ? parseFloat(precios.precio_descuento) : 0;
  const hasDiscount = discount > 0 && listPrice > 0 && discount < listPrice;
  const stock = detalle?.total_existencia ?? product.total_existencia;
  const inStock = stock > 0;
  // Las fotos de Syscom a veces vienen en http (se bloquean en página https),
  // como objetos en vez de texto, o con URLs rotas: se normalizan, se fuerza
  // https, se quitan duplicadas y la portada (que sí carga en el catálogo)
  // queda siempre como respaldo.
  const normUrl = (u: unknown): string => {
    let s = '';
    if (typeof u === 'string') s = u;
    else if (u && typeof u === 'object') {
      const o = u as Record<string, unknown>;
      s = String(o.url || o.imagen || o.src || o.path || '');
    }
    s = s.trim();
    if (s.startsWith('http://')) s = 'https://' + s.slice(7);
    return s;
  };
  const imagenes = (() => {
    const lista: string[] = [];
    const push = (u: unknown) => { const v = normUrl(u); if (v && !lista.includes(v)) lista.push(v); };
    (detalle?.imagenes || []).forEach(push);
    push(product.img_portada);
    return lista;
  })();
  const idxPortada = Math.max(0, imagenes.indexOf(normUrl(product.img_portada)));
  const imgActual = imagenes[Math.min(imgIdx, imagenes.length - 1)] || '';
  const caracteristicas = detalle?.caracteristicas || [];
  const recursos = detalle?.recursos || [];

  const handleAddToCart = () => {
    addItem({
      product_id: product.producto_id,
      product_name: product.titulo || product.modelo,
      product_image: product.img_portada || '',
      product_price: price,
      product_sku: product.modelo,
      quantity: qty,
      category: categoryId,
    });
    onClose();
  };

  const waText = encodeURIComponent(
    `Hola Skylinks, me interesa ${product.titulo || product.modelo} (${product.modelo}) - $${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN. ¿Me lo cotizas con instalación?`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/10 bg-surface text-zinc-100"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Cerrar"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black">
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Galería */}
          <div className="p-5">
            <div className="relative h-72 sm:h-80 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden">
              {imgActual ? (
                <img src={imgActual} alt={product.titulo} className="w-full h-full object-contain p-4"
                  onError={(e) => { if (imgIdx !== idxPortada) setImgIdx(idxPortada); else (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }} />
              ) : (
                <ShoppingBag className="w-12 h-12 text-zinc-700" />
              )}
              {hasDiscount && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold text-black bg-lime uppercase tracking-wider">Oferta</span>
              )}
            </div>
            {imagenes.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {imagenes.map((src, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 shrink-0 rounded-xl border-2 overflow-hidden bg-white/5 ${i === imgIdx ? 'border-cyan' : 'border-white/10 hover:border-white/30'}`}>
                    <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-contain p-1"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <p className="flex items-center gap-2 text-xs text-zinc-500 mt-3">
                <Loader2 className="w-4 h-4 animate-spin" /> Cargando descripción y fotos…
              </p>
            )}
          </div>

          {/* Info */}
          <div className="p-5 md:pl-0 flex flex-col">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-1">{product.marca}</p>
            <h3 className="text-xl font-bold leading-snug mb-1">{product.titulo}</h3>
            <p className="text-xs text-zinc-500 mb-4">Modelo: {product.modelo}{product.garantia ? ` · Garantía: ${product.garantia}` : ''}</p>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-3xl font-bold text-white">
                ${price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-zinc-500 font-mono">MXN</span>
              {hasDiscount && (
                <span className="text-sm text-zinc-500 line-through">
                  ${listPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </span>
              )}
            </div>
            <p className={`text-sm font-semibold mb-5 ${inStock ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {inStock ? `Stock: ${stock} unidades` : 'Agotado'}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-zinc-400">Cantidad:</span>
              <div className="flex items-center border border-white/15 rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 text-lg text-zinc-300 hover:bg-white/10">−</button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(inStock ? stock : 99, q + 1))}
                  className="w-9 h-9 text-lg text-zinc-300 hover:bg-white/10">+</button>
              </div>
            </div>

            <button onClick={handleAddToCart} disabled={!inStock}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-lime text-black hover:bg-cyan transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed mb-2">
              <ShoppingBag className="w-4 h-4" />
              {inStock ? 'Agregar al carrito' : 'No disponible'}
            </button>
            <a href={`https://wa.me/526221225103?text=${waText}`} target="_blank" rel="noopener noreferrer"
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-white/15 text-zinc-100 hover:border-cyan hover:text-cyan transition-colors">
              <MessageCircle className="w-4 h-4" />
              Cotizar por WhatsApp
            </a>
          </div>
        </div>

        {/* Descripción y características */}
        {(caracteristicas.length > 0 || detalle?.descripcion || recursos.length > 0) && (
          <div className="px-5 pb-6">
            {caracteristicas.length > 0 && (
              <>
                <h4 className="font-display font-bold text-lg mb-2">Características</h4>
                <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-1 mb-5">
                  {caracteristicas.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </>
            )}
            {detalle?.descripcion && (
              <>
                <h4 className="font-display font-bold text-lg mb-2">Descripción</h4>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: detalle.descripcion }} />
              </>
            )}
            {recursos.length > 0 && (
              <div className="mt-5">
                <h4 className="font-display font-bold text-lg mb-2">Documentos</h4>
                <div className="flex flex-col gap-2">
                  {recursos.map((r, i) => (
                    <a key={i} href={r.path} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-cyan hover:underline">
                      <FileText className="w-4 h-4 shrink-0" /> {r.recurso || 'Descargar documento'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { ProductDetailModal };
