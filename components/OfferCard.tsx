import React from 'react';
import { OfferPackage } from '../types';
import { Check, Star, ArrowRight, Info, Sparkles } from 'lucide-react';

interface OfferCardProps {
  offer: OfferPackage;
  onVisualize: (offer: OfferPackage) => void;
  isVisualizing: boolean;
  generatedImage?: string;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onVisualize, isVisualizing, generatedImage }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full transition-all hover:shadow-2xl hover:shadow-indigo-100/50">
      
      {/* Visual Header */}
      <div className="relative h-48 bg-slate-100 group">
        {generatedImage ? (
          <img src={generatedImage} alt={offer.title} className="w-full h-full object-cover animate-fade-in" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
             {isVisualizing ? (
               <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-xs font-medium text-indigo-600">Dreaming up view...</span>
               </div>
             ) : (
               <button 
                 onClick={() => onVisualize(offer)}
                 className="px-4 py-2 bg-white/80 hover:bg-white text-indigo-600 text-sm font-medium rounded-full shadow-sm backdrop-blur-sm transition-all flex items-center gap-2"
               >
                 <Sparkles className="w-4 h-4" /> Visualize Room
               </button>
             )}
          </div>
        )}
        
        {/* Match Score Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-white/50">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-800">{offer.matchScore}% Match</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {offer.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">{offer.title}</h3>
        <p className="text-sm font-medium text-indigo-600 mb-4">{offer.tagline}</p>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
          {offer.description}
        </p>

        {/* Room & Perks */}
        <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
           <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" />
              <span className="text-sm font-semibold text-slate-800">{offer.roomType}</span>
           </div>
           <div className="h-px bg-slate-200 w-full my-2"></div>
           <ul className="space-y-2">
            {offer.perks.map((perk, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{perk}</span>
              </li>
            ))}
           </ul>
        </div>

        {/* Footer: Price & CTA */}
        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Estimate</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{offer.currency}{offer.price}</span>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-slate-400">{offer.cancellationPolicy}</p>
            </div>
          </div>
          
          <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 group">
            Book This Package
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};