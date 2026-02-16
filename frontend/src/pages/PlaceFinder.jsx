import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, Info, AlertCircle, ChevronRight } from 'lucide-react';
import axios from 'axios';

// --- State-District Data ---
const stateDistrictData = {
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli", "Vellore", "Kanyakumari"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Wayanad", "Munnar", "Alappuzha"],
  // Add other states as needed...
};

const translations = {
  en: {
    title: "Place Finder",
    subtitle: "Discover destinations and calculate real-time distances from your location.",
    btn: "Find Places",
    placeholderStart: "Your Starting Location (e.g., Chennai)",
    selectState: "Select State",
    selectDist: "Select District",
    distanceText: "Approx. {d} km from {loc}",
    warning: "Coordinates for {loc} not found. Showing places without distance.",
    empty: "Your adventure starts here. Pick a spot!"
  },
  ta: {
    title: "இடங்களைக் கண்டறியவும்",
    subtitle: "உங்கள் இருப்பிடத்திலிருந்து இடங்களையும் அவற்றின் தூரத்தையும் கண்டறியுங்கள்.",
    btn: "தேடுக",
    placeholderStart: "உங்கள் தொடக்க இடம் (எ.கா., சென்னை)",
    selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    selectDist: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
    distanceText: "{loc} இலிருந்து சுமார் {d} கி.மீ",
    warning: "{loc}-க்கான வரைபடக் குறியீடுகள் கிடைக்கவில்லை. தூரம் இல்லாமல் இடங்களைக் காட்டுகிறது.",
    empty: "உங்கள் பயணம் இங்கே தொடங்குகிறது. ஒரு இடத்தைத் தேர்ந்தெடுக்கவும்!"
  }
};

const PlaceFinder = ({ lang }) => {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [startLoc, setStartLoc] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startCoords, setStartCoords] = useState(null);

  const t = translations[lang] || translations.en;

  // Haversine Formula for distance calculation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/find-places', {
        state, district, startLocation: startLoc, language: lang
      });
      setResults(response.data.places); // Assuming backend returns an array of place objects
      setStartCoords(response.data.startCoords);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-green-50 via-white to-orange-50 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </motion.div>

        {/* Search Bar Section */}
        <motion.form 
          onSubmit={handleSearch}
          className="bg-white/70 backdrop-blur-xl p-4 md:p-6 rounded-3xl shadow-xl border border-white/50 flex flex-col md:flex-row gap-4 items-center mb-12"
        >
          <select 
            className="w-full md:w-1/4 bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setState(e.target.value)} required
          >
            <option value="">{t.selectState}</option>
            {Object.keys(stateDistrictData).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            disabled={!state}
            className="w-full md:w-1/4 bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
            onChange={(e) => setDistrict(e.target.value)} required
          >
            <option value="">{t.selectDist}</option>
            {state && stateDistrictData[state].map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <div className="relative w-full md:w-1/3">
            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t.placeholderStart}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) => setStartLoc(e.target.value)} required
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-green-700 transition-colors"
          >
            <Search size={20} /> {t.btn}
          </motion.button>
        </motion.form>

        {/* Warning Message */}
        {startLoc && results.length > 0 && !startCoords && (
          <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-4 rounded-xl mb-6 border border-orange-100">
            <AlertCircle size={20} />
            <span>{t.warning.replace('{loc}', startLoc)}</span>
          </div>
        )}

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : results.length > 0 ? (
              results.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-[2rem] shadow-md hover:shadow-xl transition-all border border-gray-100 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">{place.name}</h4>
                    <span className="p-2 bg-orange-50 text-orange-500 rounded-full"><MapPin size={20} /></span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{place.description}</p>
                  
                  {startCoords && place.lat && (
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                        <Navigation size={14} className="text-green-500" />
                        {t.distanceText.replace('{d}', calculateDistance(startCoords.lat, startCoords.lon, place.lat, place.lon)).replace('{loc}', startLoc)}
                      </span>
                      <button className="text-green-600 font-bold flex items-center gap-1 hover:underline text-sm">
                        View Details <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <Info size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-400 italic">{t.empty}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PlaceFinder;