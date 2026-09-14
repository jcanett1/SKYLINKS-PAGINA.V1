import { useEffect, useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { fetchBrands, SyscomBrand } from '../lib/syscomApi';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onBrandFilter: (brandId: string) => void;
  isLoading?: boolean;
}

export default function ProductSearch({ onSearch, onBrandFilter, isLoading = false }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState<SyscomBrand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [brandsLoading, setBrandsLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      try { setBrands(await fetchBrands()); }
      catch (err) { console.error('Error loading brands:', err); }
      finally { setBrandsLoading(false); }
    };
    loadBrands();
  }, []);

  const handleSearch = () => { if (searchQuery.trim()) onSearch(searchQuery); };
  const handleBrandSelect = (brandId: string) => { setSelectedBrand(brandId); onBrandFilter(brandId); setShowBrandDropdown(false); };
  const handleClearBrand = () => { setSelectedBrand(''); onBrandFilter(''); };
  const selectedBrandName = brands.find((b) => b.id === selectedBrand)?.nombre;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar por nombre del producto..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-black border border-white/15 text-white placeholder:text-zinc-600 text-sm outline-none focus:border-cyan transition-colors" disabled={isLoading} />
        </div>
        <button onClick={handleSearch} disabled={isLoading} className="px-6 py-3 rounded-xl font-semibold text-black text-sm bg-cyan hover:bg-lime transition-colors disabled:opacity-60">Buscar</button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <button onClick={() => setShowBrandDropdown(!showBrandDropdown)} disabled={brandsLoading || isLoading}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-black border border-white/15 text-sm text-zinc-300 outline-none focus:border-cyan disabled:opacity-60 transition-colors">
            <span>{selectedBrandName ? `Marca: ${selectedBrandName}` : 'Filtrar por marca...'}</span>
            <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showBrandDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
              <button onClick={() => handleBrandSelect('')} className={`w-full text-left px-4 py-2.5 border-b border-white/5 text-sm hover:bg-white/5 ${selectedBrand === '' ? 'text-cyan font-semibold' : 'text-zinc-300'}`}>Todas las marcas</button>
              {brands.map((brand) => (
                <button key={brand.id} onClick={() => handleBrandSelect(brand.id)} className={`w-full text-left px-4 py-2.5 border-b border-white/5 last:border-b-0 text-sm hover:bg-white/5 ${selectedBrand === brand.id ? 'text-cyan font-semibold' : 'text-zinc-300'}`}>{brand.nombre}</button>
              ))}
            </div>
          )}
        </div>
        {selectedBrand && (
          <button onClick={handleClearBrand} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/15 text-zinc-300 hover:border-cyan hover:text-cyan transition-colors text-sm font-semibold">
            <X className="w-4 h-4" />Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
