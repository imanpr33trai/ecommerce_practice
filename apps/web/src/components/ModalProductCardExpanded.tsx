import React from 'react';
import { Eye, ArrowLeftRight, Check, ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import { Product } from '../types';

interface ModalProductCardExpandedProps {
  product: Product;
  isInCompare: boolean;
  isAdding: boolean;
  selectedColor: string;
  displayColors: string[];
  onQuickView: (e: React.MouseEvent) => void;
  onCompare: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  onSelectColor: (e: React.MouseEvent, color: string) => void;
  isExpanded: boolean;
}

const ModalProductCardExpanded: React.FC<ModalProductCardExpandedProps> = ({
  product,
  isInCompare,
  isAdding,
  selectedColor,
  displayColors,
  onQuickView,
  onCompare,
  onAddToCart,
  onSelectColor,
  isExpanded
}) => {
  return (
    <div className={`space-y-4 transition-all duration-1000 ease-premium flex-1 flex flex-col justify-center ${isExpanded ? 'opacity-100 translate-y-0 delay-75' : 'opacity-0 translate-y-8 pointer-events-none absolute bottom-0 left-0 w-full p-6'}`}>
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
        {product.description} Crafted with precision to elevate your living space. 
      </p>
      
      <div className="flex gap-2">
        <Button 
          onClick={onQuickView} 
          variant="secondary" 
          size="sm" 
          className="flex-1 bg-gray-50 border-none hover:bg-gray-100 text-xs font-bold uppercase tracking-wider h-10"
        >
          <Eye size={14} className="mr-2" /> Quick View
        </Button>
        <Button 
          onClick={onCompare} 
          variant="secondary" 
          size="sm" 
          className={`flex-1 border-none text-xs font-bold uppercase tracking-wider h-10 ${isInCompare ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'}`}
        >
          <ArrowLeftRight size={14} className="mr-2" /> Compare
        </Button>
      </div>

      <div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Available Finishes</span>
        <div className="flex gap-3">
          {displayColors.map((color) => (
            <button 
              key={color}
              onClick={(e) => onSelectColor(e, color)}
              className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md ${selectedColor === color ? 'ring-2 ring-offset-2 ring-black scale-105' : ''}`}
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && <Check size={14} className="text-white mix-blend-difference" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2 mt-auto">
        <Button onClick={onAddToCart} className={`flex-1 h-12 text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isAdding ? 'bg-green-600' : 'bg-black text-white hover:bg-gray-800'}`}>
            {isAdding ? 'Added' : 'Add to Cart'}
        </Button>
        <Button variant="secondary" className="h-12 px-5 border border-gray-100 hover:bg-gray-50 hover:border-gray-300">
            Details <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ModalProductCardExpanded;