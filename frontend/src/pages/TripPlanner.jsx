import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Calendar, Wallet, Send, CheckCircle, Coffee, Camera } from 'lucide-react';
import axios from 'axios';

const translations = {
  en: {
    title: "AI Trip Architect",
    subtitle: "Tell us your dreams, and Gemini will build your Tamil Nadu adventure.",
    placeholders: {
      interests: "e.g., temples, beaches, filter coffee...",
      location: "Specific city (e.g., Madurai)",
      days: "Days",
      budget: "Budget (₹)"
    },
    button: "Generate Magic",
    waiting: "Your personalized itinerary will appear here...",
    loading: "Gemini is crafting your journey...",
  },
  ta: {
    title: "AI பயண வடிவமைப்பாளர்",
    subtitle: "உங்கள் கனவுகளைச் சொல்லுங்கள், ஜெமினி உங்கள் தமிழக சாகசத்தை உருவாக்கும்.",
    placeholders: {
      interests: "எ.கா., கோயில்கள், கடற்கரைகள், காபி...",
      location: "குறிப்பிட்ட நகரம் (எ.கா., மதுரை)",
      days: "நாட்கள்",
      budget: "பட்ஜெட் (₹)"
    },
    button: "பயணத்தை உருவாக்கு",
    waiting: "உங்கள் தனிப்பயனாக்கப்பட்ட பயணத்திட்டம் இங்கே தோன்றும்...",
    loading: "ஜெமினி உங்கள் பயணத்தை வடிவமைக்கிறது...",
  }
};

const TripPlanner = ({ lang }) => {
  const [formData, setFormData] = useState({ interests: '', location: '', days: '', budget: '' });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  
  const t = translations[lang] || translations.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItinerary(null);

    try {
      const response = await axios.post('http://localhost:5000/api/plan-trip', {
        ...formData,
        language: lang
      });
      setItinerary(response.data.itinerary);
    } catch (error) {
      console.error("AI Generation Error:", error);
      setItinerary(`<h3 class="text-red-500">Sorry, the AI is taking a rest. Please try again!</h3>`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left: Input Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/3 space-y-8"
        >
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Sparkles className="text-orange-500" /> {t.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-[2rem] shadow-xl border border-orange-100">
            <div className="space-y-4">
              <InputWithIcon icon={<Coffee size={18}/>} placeholder={t.placeholders.interests} 
                onChange={(e) => setFormData({...formData, interests: e.target.value})} />
              
              <InputWithIcon icon={<MapPin size={18}/>} placeholder={t.placeholders.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} />

              <div className="flex gap-4">
                <InputWithIcon type="number" icon={<Calendar size={18}/>} placeholder={t.placeholders.days} 
                  onChange={(e) => setFormData({...formData, days: e.target.value})} />
                
                <InputWithIcon type="number" icon={<Wallet size={18}/>} placeholder={t.placeholders.budget} 
                  onChange={(e) => setFormData({...formData, budget: e.target.value})} />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            >
              <Send size={20} /> {t.button}
            </motion.button>
          </form>
        </motion.div>

        {/* Right: Result Section */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-2/3 min-h-[500px] bg-white/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-orange-200 p-8 md:p-12 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!loading && !itinerary && (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="p-6 bg-orange-100 rounded-full text-orange-500 animate-pulse">
                  <Camera size={48} />
                </div>
                <h3 className="text-xl font-medium text-gray-400 max-w-sm">{t.waiting}</h3>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-orange-600 font-bold animate-bounce">{t.loading}</p>
              </motion.div>
            )}

            {itinerary && (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="prose prose-orange max-w-none"
              >
                {/* We use dangerouslySetInnerHTML because AI output usually contains HTML/Markdown */}
                <div 
                  className="ai-output-container space-y-6" 
                  dangerouslySetInnerHTML={{ __html: itinerary }} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable Sub-component for form inputs
const InputWithIcon = ({ icon, type = "text", placeholder, onChange }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
      {icon}
    </div>
    <input 
      type={type}
      required
      placeholder={placeholder}
      onChange={onChange}
      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all font-medium"
    />
  </div>
);

export default TripPlanner;