import React, { useState, useRef } from 'react';
import { InputForm } from './components/InputForm';
import { OfferCard } from './components/OfferCard';
import { TravelPreferences, OfferPackage, AppStatus } from './types';
import { generateOffers, generateVisualization } from './services/geminiService';
import { Briefcase, Plane, Map as MapIcon, RotateCcw } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [offers, setOffers] = useState<OfferPackage[]>([]);
  const [prefs, setPrefs] = useState<TravelPreferences | null>(null);
  const [visualizations, setVisualizations] = useState<Record<string, string>>({});
  const [activeVisualizingId, setActiveVisualizingId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerateOffers = async (preferences: TravelPreferences) => {
    setStatus(AppStatus.GENERATING_OFFERS);
    setPrefs(preferences);
    setOffers([]);
    setVisualizations({});

    try {
      const generatedOffers = await generateOffers(preferences);
      setOffers(generatedOffers);
      setStatus(AppStatus.COMPLETE);
      
      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleVisualize = async (offer: OfferPackage) => {
    if (!prefs) return;
    setActiveVisualizingId(offer.id);
    
    try {
      const context = `A ${offer.roomType} reflecting the vibe of '${offer.title}'. Theme: ${prefs.interests.join(", ")}.`;
      const imageUrl = await generateVisualization(prefs.destination, context);
      setVisualizations(prev => ({ ...prev, [offer.id]: imageUrl }));
    } catch (error) {
      console.error(error);
    } finally {
      setActiveVisualizingId(null);
    }
  };

  const resetApp = () => {
    setStatus(AppStatus.IDLE);
    setOffers([]);
    setPrefs(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900 to-indigo-800 z-0"></div>
      <div className="absolute top-20 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 left-10 w-48 h-48 bg-teal-400 rounded-full blur-3xl opacity-10"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center">
               <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">WanderLuxe</h1>
              <p className="text-xs text-indigo-200 font-medium tracking-wider uppercase">AI Concierge Engine</p>
            </div>
          </div>
          {status !== AppStatus.IDLE && (
            <button 
              onClick={resetApp}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> New Search
            </button>
          )}
        </header>

        {/* Main Layout */}
        <main>
          {status === AppStatus.IDLE || status === AppStatus.GENERATING_OFFERS ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Copy */}
              <div className="lg:col-span-5 text-white space-y-6 pt-8">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Curate the perfect <br />
                  <span className="text-indigo-300">stay experience.</span>
                </h2>
                <p className="text-lg text-indigo-100 leading-relaxed max-w-md">
                  Our AI engine analyzes your travel DNA to craft personalized hotel packages, exclusive perks, and visualize your potential room view in seconds.
                </p>
                <div className="flex items-center gap-6 pt-4 text-indigo-200 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>Business Ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4" />
                    <span>Local Gems</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-indigo-900/20 backdrop-blur-xl border border-white/50">
                  <InputForm onSubmit={handleGenerateOffers} isLoading={status === AppStatus.GENERATING_OFFERS} />
                </div>
              </div>

            </div>
          ) : null}

          {/* Results Section */}
          {(status === AppStatus.COMPLETE || offers.length > 0) && (
             <div ref={resultsRef} className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-8 mt-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Your Curated Collection</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Showing 3 exclusive offers for <span className="font-semibold text-indigo-600">{prefs?.destination}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {offers.map((offer) => (
                    <OfferCard 
                      key={offer.id} 
                      offer={offer} 
                      onVisualize={handleVisualize}
                      isVisualizing={activeVisualizingId === offer.id}
                      generatedImage={visualizations[offer.id]}
                    />
                  ))}
                </div>
             </div>
          )}

          {status === AppStatus.ERROR && (
             <div className="mt-12 p-6 bg-red-50 border border-red-100 rounded-xl text-center max-w-md mx-auto">
                <p className="text-red-600 font-medium">Oops, our concierge is busy.</p>
                <p className="text-red-500 text-sm mt-2">We couldn't generate offers right now. Please try again.</p>
                <button onClick={resetApp} className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-semibold underline">
                  Try Again
                </button>
             </div>
          )}

        </main>
      </div>
      
      {/* Global CSS for Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
}
