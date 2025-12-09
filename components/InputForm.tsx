import React, { useState } from 'react';
import { TravelPreferences } from '../types';
import { MapPin, Users, Calendar, Heart, DollarSign, Sparkles } from 'lucide-react';

interface InputFormProps {
  onSubmit: (prefs: TravelPreferences) => void;
  isLoading: boolean;
}

const INTERESTS_OPTIONS = [
  "Culinary & Dining", "Spa & Wellness", "Adventure", "History & Culture", 
  "Nightlife", "Beach", "Shopping", "Family Activities"
];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TravelPreferences>({
    destination: 'Kyoto, Japan',
    travelers: '2 Adults',
    duration: '3 Nights',
    occasion: 'Anniversary',
    budget: 'Luxury',
    interests: ['History & Culture', 'Culinary & Dining']
  });

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      }
      if (prev.interests.length < 3) {
        return { ...prev, interests: [...prev.interests, interest] };
      }
      return prev;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destination */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" /> Destination
          </label>
          <input
            type="text"
            required
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            value={formData.destination}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            placeholder="e.g. Paris, Maldives, NYC"
          />
        </div>

        {/* Travelers */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" /> Travelers
          </label>
          <input
            type="text"
            required
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            value={formData.travelers}
            onChange={(e) => setFormData({...formData, travelers: e.target.value})}
            placeholder="e.g. 2 Adults, 1 Child"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" /> Duration
          </label>
          <input
            type="text"
            required
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            placeholder="e.g. 5 nights"
          />
        </div>

        {/* Occasion */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Heart className="w-4 h-4 text-indigo-600" /> Occasion
          </label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            value={formData.occasion}
            onChange={(e) => setFormData({...formData, occasion: e.target.value})}
            placeholder="e.g. Honeymoon, Business, Relax"
          />
        </div>
        
        {/* Budget */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-600" /> Budget Level
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Economy', 'Standard', 'Luxury', 'Ultra-Luxury'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData({...formData, budget: level as any})}
                className={`p-2 rounded-lg text-sm border transition-all ${
                  formData.budget === level 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Interests (Select up to 3)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  formData.interests.includes(interest)
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 ${
          isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Crafting Offers...
          </>
        ) : (
          <>
            Generate Offers <Sparkles className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};
