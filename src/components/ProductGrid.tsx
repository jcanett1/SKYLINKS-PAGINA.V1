import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { fetchProductsByCategory, searchProducts, SyscomProduct } from '../lib/syscomApi';
import { useCart } from '../context/CartContext';
import ProductSearch from './ProductSearch';

interface ProductGridProps { categoryId: string; title?: string; searchQuery?: string; }

export default function ProductGrid({ categoryId, searchQuery }: ProductGridProps) {
  const [products, setProducts] = useState<SyscomProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const { addItem } = useCart();

  useEffect(() => { setPage(1); }, [categoryId, searchQuery]);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, page, searchTerm, selectedBrand]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = searchTerm ? await searchProducts(searchTerm, page) : await fetchProductsByCategory(categoryId, page);
      setProducts(result.products);
      setTotal(result.total);
      setTotalPages(result.pages);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error cargando productos';
      console.error('Load products error:', err);
      setError(errorMsg);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => { setSearchTerm(query); setPage(1); };
  const handleBrandFilter = (brandId: string) => setSelectedBrand(brandId);

  const getPrice = (product: SyscomProduct): number => {
    const p = product.precios;
    if (p.precio_lista) return parseFloat(p.precio_lista);
    if (p.precio_1) return parseFloat(p.precio_1);
    return 0;
  };
  const getListPrice = (product: SyscomProduct): number => parseFloat(product.precios.precio_lista || product.precios.precio_1 || '0');
  const hasDiscount = (product: SyscomProduct): boolean => {
    const d = product.precios.precio_descuento ? parseFloat(product.precios.precio_descuento) : 0;
    const l = getListPrice(product);
    return d > 0 && l > 0 && d < l;
  };

  const handleAddToCart = (product: SyscomProduct) => {
    addItem({
      product_id: product.producto_id,
      product_name: product.titulo || product.modelo,
      product_image: product.img_portada || '',
      product_price: getPrice(product),
      product_sku: product.modelo,
      quantity: 1,
      category: categoryId,
    });
  };

  return (
    <div>
      <ProductSearch onSearch={handleSearch} onBrandFilter={handleBrandFilter} isLoading={loading} />

      {!loading && !error && total > 0 && (
        <p className="font-mono text-xs text-zinc-500 mb-6 uppercase tracking-wider">{total.toLocaleString()} productos encontrados</p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cyan" />
          <span className="ml-3 text-zinc-400">Cargando productos...</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="w-8 h-8 mb-3 text-amber" />
          <span className="text-zinc-300 font-medium">No se pudieron cargar los productos</span>
          <span className="text-zinc-500 text-sm mt-1 max-w-md">Verifica que las credenciales de Syscom estén configuradas en Supabase. ({error})</span>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => {
              const img = product.img_portada;
              const discount = hasDiscount(product);
              const price = getPrice(product);
              const inStock = product.total_existencia > 0;
              return (
                <div key={product.producto_id} className="group flex flex-col rounded-2xl border border-white/10 bg-surface overflow-hidden hover:border-cyan/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-48 bg-white/5 flex items-center justify-center overflow-hidden">
                    {img ? (
                      <img src={img} alt={product.titulo} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <ShoppingBag className="w-12 h-12 text-zinc-700" />
                    )}
                    {discount && <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold text-black bg-lime uppercase tracking-wider">Oferta</span>}
                    {!inStock && <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-zinc-700 uppercase tracking-wider">Agotado</span>}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {product.marca_logo && <img src={product.marca_logo} alt={product.marca} className="h-4 w-auto opacity-70" style={{ filter: 'brightness(0) invert(1)' }} />}
                      <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">{product.marca}</p>
                    </div>
                    <h4 className="text-sm font-semibold text-zinc-100 line-clamp-2 mb-1 flex-1">{product.titulo}</h4>
                    <p className="text-xs text-zinc-500 mb-3">Modelo: {product.modelo}</p>
                    <p className={`text-xs font-semibold mb-3 ${inStock ? 'text-emerald-400' : 'text-zinc-500'}`}>{inStock ? `Stock: ${product.total_existencia} unidades` : 'Agotado'}</p>
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-display text-lg font-bold text-white">${price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">MXN</span>
                      </div>
                      <button onClick={() => handleAddToCart(product)} disabled={!inStock}
                        className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-lime text-black hover:bg-cyan transition-colors duration-200 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed">
                        <ShoppingBag className="w-4 h-4" />
                        {inStock ? 'Agregar al carrito' : 'No disponible'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-white/15 text-zinc-300 hover:border-cyan hover:text-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-mono text-sm text-zinc-400">Página {page} de {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-white/15 text-zinc-300 hover:border-cyan hover:text-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-zinc-300">No se encontraron productos</p>
          <p className="text-sm mt-1">Intenta con otra búsqueda o categoría</p>
        </div>
      )}
    </div>
  );
}
