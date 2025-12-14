import React from 'react';
import { Check, Star, RefreshCw } from 'lucide-react';
import Button from './ui/Button';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../constants';

interface FilterPanelProps {
  className?: string;
  hideCategories?: boolean; // Option to hide category filter if we are on a specific category page
}

const FilterPanel: React.FC<FilterPanelProps> = ({ className = '', hideCategories = false }) => {
  const { filters, setFilters, resetFilters } = useShop();

  const handleSortChange = (sort: string) => setFilters(prev => ({ ...prev, sort }));
  const handleStockChange = () => setFilters(prev => ({ ...prev, inStock: !prev.inStock }));
  const handleSaleChange = () => setFilters(prev => ({ ...prev, onSale: !prev.onSale }));

  const handleArrayToggle = (key: 'materials' | 'categories' | 'colors', value: string) => {
    setFilters(prev => {
      const active = prev[key].includes(value);
      return {
        ...prev,
        [key]: active ? prev[key].filter(i => i !== value) : [...prev[key], value]
      };
    });
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({ ...prev, rating: prev.rating === rating ? null : rating }));
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const num = parseInt(value) || 0;
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: num
    }));
  };

  const colors = ['#D9D9D9', '#3A3A3A', '#8C7A6B', '#111111', '#FFFFFF', '#E2E8F0'];
  const materials = ['Wood', 'Metal', 'Glass', 'Fabric', 'Leather', 'Marble'];

  return (
    <div className={`flex flex-col gap-8 ${className}`}>

      {/* Sort */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Sort By</h3>
        <div className="space-y-3">
          {['newest', 'price_asc', 'price_desc', 'rating'].map((opt) => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleSortChange(opt)}>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filters.sort === opt ? 'border-black bg-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                  {filters.sort === opt && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
              </div>
              <span className="font-medium capitalize text-sm text-gray-600 group-hover:text-black">{opt.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Price Range</h3>
        <div className="flex flex-col gap-3">
            <div className="bg-gray-50 rounded-xl px-3 py-2 border border-transparent focus-within:border-black/10 transition-colors">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Min Price</span>
              <div className="flex items-center">
                <span className="text-sm font-bold mr-1">$</span>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full bg-transparent text-sm font-bold outline-none text-black placeholder-gray-400"
                />
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2 border border-transparent focus-within:border-black/10 transition-colors">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Max Price</span>
              <div className="flex items-center">
                <span className="text-sm font-bold mr-1">$</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full bg-transparent text-sm font-bold outline-none text-black placeholder-gray-400"
                />
              </div>
            </div>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Availability</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group" onClick={handleStockChange}>
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.inStock ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-gray-400'}`}>
                {filters.inStock && <Check size={10} strokeWidth={4} />}
              </div>
              <span className="font-medium text-sm text-gray-600 group-hover:text-black">In Stock Only</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group" onClick={handleSaleChange}>
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.onSale ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-gray-400'}`}>
                {filters.onSale && <Check size={10} strokeWidth={4} />}
              </div>
              <span className="font-medium text-sm text-gray-600 group-hover:text-black">On Sale</span>
          </label>
        </div>
      </div>

      {/* Categories */}
      {!hideCategories && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Categories</h3>
          <div className="space-y-3">
            {CATEGORIES.filter(c => c !== 'All').map(cat => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleArrayToggle('categories', cat)}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.categories.includes(cat) ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {filters.categories.includes(cat) && <Check size={10} strokeWidth={4} />}
                </div>
                <span className="font-medium text-sm text-gray-600 group-hover:text-black">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Materials */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Materials</h3>
        <div className="flex flex-wrap gap-2">
          {materials.map(mat => (
              <button
                key={mat}
                onClick={() => handleArrayToggle('materials', mat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filters.materials.includes(mat) ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-600 hover:border-black'}`}
              >
                {mat}
              </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Colors</h3>
        <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleArrayToggle('colors', color)}
                className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform hover:scale-110 relative ${filters.colors.includes(color) ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                style={{ backgroundColor: color }}
                title={color}
              >
                {filters.colors.includes(color) && <Check size={14} className="text-white mix-blend-difference" />}
              </button>
            ))}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Rating</h3>
          <div className="space-y-3">
            {[4, 3, 2, 1].map(r => (
              <label key={r} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleRatingChange(r)}>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filters.rating === r ? 'border-black bg-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                  {filters.rating === r && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < r ? "black" : "#E5E7EB"} className={i < r ? "text-black" : "text-gray-200"} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 font-medium group-hover:text-black transition-colors">& Up</span>
                </div>
              </label>
            ))}
          </div>
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-gray-100">
         <Button variant="secondary" className="w-full bg-white border border-gray-200 hover:bg-gray-50 h-10" onClick={resetFilters}>
           <RefreshCw size={14} className="mr-2" /> Reset Filters
         </Button>
      </div>
    </div>
  );
};

export default FilterPanel;