import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Globe, MapPin, User, Mail, Phone, Calendar, Landmark } from 'lucide-react';
import { auth, db } from '../firebaseConfig'; // Firebase setup
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const translations = {
  en: {
    title: "TN Flow",
    createAccount: "Join the Journey",
    loginLink: "Already have an account? Login",
    signup: "Sign Up",
    fields: {
      username: "Username",
      email: "Email ID",
      password: "Password",
      confirm: "Confirm Password",
      phone: "Phone Number (Optional)",
      state: "State",
      dob: "Date of Birth"
    },
    placeholders: {
      username: "Enter your name",
      email: "you@example.com",
      phone: "e.g. +91 98765 43210",
      state: "Select your state",
    },
    errorMatch: "Passwords do not match!"
  },
  ta: {
    title: "டிஎன் ஃபுளோ",
    createAccount: "பயணத்தில் சேருங்கள்",
    loginLink: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக",
    signup: "பதிவு செய்க",
    fields: {
      username: "பயனர் பெயர்",
      email: "மின்னஞ்சல் ஐடி",
      password: "கடவுச்சொல்",
      confirm: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
      phone: "தொலைபேசி எண்",
      state: "மாநிலம்",
      dob: "பிறந்த தேதி"
    },
    placeholders: {
      username: "உங்கள் பெயரை உள்ளிடவும்",
      email: "you@example.com",
      phone: "எ.கா. +91 98765 43210",
      state: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    },
    errorMatch: "கடவுச்சொற்கள் பொருந்தவில்லை!"
  }
};

const Signup = () => {
  const [lang, setLang] = useState('en');
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirm: '', phone: '', state: '', dob: ''
  });

  const t = translations[lang];

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      alert(t.errorMatch);
      return;
    }

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Store extra info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        phone: formData.phone,
        state: formData.state,
        dob: formData.dob,
        email: formData.email,
        createdAt: new Date()
      });

      window.location.href = "/home";
    } catch (error) {
      alert(error.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-600 via-yellow-400 to-orange-500 flex items-center justify-center p-4 py-12">
      {/* Language Toggle */}
      <button 
        onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
        className="absolute top-6 right-6 bg-white/20 backdrop-blur-lg border border-white/40 px-5 py-2 rounded-full text-white font-semibold flex items-center gap-2 hover:bg-white/30 transition-all z-10"
      >
        <Globe size={18} /> {lang === 'en' ? 'தமிழ்' : 'English'}
      </button>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/95 backdrop-blur-sm w-full max-w-2xl rounded-[2rem] shadow-2xl p-8 md:p-12 border border-white/20"
      >
        <div className="text-center mb-10">
          <motion.div variants={itemVariants} className="flex justify-center items-center gap-2 mb-2 text-orange-600 font-bold text-3xl italic">
            <MapPin className="text-green-600" fill="currentColor" /> {t.title}
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl font-extrabold text-gray-800">{t.createAccount}</motion.h2>
        </div>

        <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase"><User size={16}/> {t.fields.username}</label>
            <input 
              type="text" required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
              placeholder={t.placeholders.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase"><Mail size={16}/> {t.fields.email}</label>
            <input 
              type="email" required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
              placeholder={t.placeholders.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="space-y-2 relative">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase"> {t.fields.password}</label>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase"> {t.fields.confirm}</label>
            <input 
              type="password" required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
              onChange={(e) => setFormData({...formData, confirm: e.target.value})}
            />
          </motion.div>

          {/* Phone */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase"><Phone size={16}/> {t.fields.phone}</label>
            <input 
              type="tel"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
              placeholder={t.placeholders.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </motion.div>

          {/* State Select */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase"><Landmark size={16}/> {t.fields.state}</label>
            <select 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none appearance-none"
              onChange={(e) => setFormData({...formData, state: e.target.value})}
            >
              <option value="">{t.placeholders.state}</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Kerala">Kerala</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </motion.div>

          {/* DOB */}
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase"><Calendar size={16}/> {t.fields.dob}</label>
            <input 
              type="date" required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
            />
          </motion.div>

          {/* Submit */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="md:col-span-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-orange-200 hover:from-orange-600 hover:to-orange-700 transition-all text-lg mt-4"
          >
            {t.signup}
          </motion.button>
        </form>

        <motion.p variants={itemVariants} className="text-center mt-8 text-gray-600">
          <a href="/login" className="font-bold text-orange-500 hover:underline">{t.loginLink}</a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;