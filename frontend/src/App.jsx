import React, { useState, useEffect } from 'react';
import { Sparkles, History, Film, Star, ArrowRight, Loader2, PlayCircle, Info, Search, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetchHistory();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const getRecommendations = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/recommend`, { preference: input });
      setRecommendations(response.data.recommendations);
      fetchHistory();
      setTimeout(() => {
        const el = document.getElementById('results-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (error) {
      console.error(error);
      alert("Error fetching recommendations. Check your API key and backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-indigo-500/30 font-sans">
      <div className="bg-cinematic" />
      <div className="bg-overlay" />
      <div className="noise" />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 py-5 flex justify-between items-center ${scrolled ? 'glass py-4 shadow-2xl' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Film className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter gradient-text uppercase">MOVIEMIND</span>
        </div>

        <button
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/10 hover:bg-white/5 transition-all active:scale-95 group"
        >
          <History className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">History</span>
        </button>
      </nav>

      {/* Simplified Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative px-6">
        <div className="text-center max-w-4xl z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-8 uppercase"
          >
            Find the perfect <br />
            <span className="gradient-text italic">Movie Tonight.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12"
          >
            Just tell us what you're in the mood for. Our AI will handle the rest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-2xl mx-auto"
          >
            <form onSubmit={getRecommendations} className="relative glass rounded-2xl p-2 flex items-center shadow-2xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your mood (e.g. 'Chill space adventure')"
                className="flex-1 bg-transparent border-none py-4 px-6 text-lg font-medium focus:ring-0 text-white placeholder:text-slate-600 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-premium px-8 py-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "FIND"}
              </button>
            </form>
          </motion.div>
        </div>

        {recommendations.length > 0 && (
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 text-slate-500 cursor-pointer opacity-50 hover:opacity-100 transition-opacity flex flex-col items-center gap-1"
            onClick={() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-[10px] font-black uppercase tracking-widest">View Results</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        )}
      </section>

      {/* Results Section - Cleaner Cards */}
      <section id="results-section" className="py-20 px-6 max-w-6xl mx-auto min-h-screen">
        <AnimatePresence>
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-16"
            >
              <div className="text-center">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">RECOMMENDATIONS</h2>
                <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recommendations.map((movie, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card flex flex-col rounded-3xl overflow-hidden group border border-white/5"
                  >
                    <div className="p-8 flex flex-col h-full bg-slate-900/40">
                      <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-lg">
                        <PlayCircle className="w-7 h-7" />
                      </div>

                      <h3 className="text-2xl font-black mb-4 leading-tight group-hover:text-indigo-400 transition-colors uppercase italic">{movie.title}</h3>
                      <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                        {movie.description}
                      </p>

                      <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-indigo-400">Why this movie</span>
                        </div>
                        <p className="text-sm text-slate-300 italic font-medium leading-normal">
                          "{movie.reason}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* History Side Panel */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-950/95 border-l border-white/10 z-[70] p-8 backdrop-blur-3xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black tracking-tighter">THE ARCHIVE</h2>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-2">
                {history.length > 0 ? history.map((item) => (
                  <div
                    key={item.id}
                    className="glass p-5 rounded-2xl group cursor-pointer border border-white/5 hover:border-indigo-500/30 transition-all"
                    onClick={() => { setInput(item.user_input); getRecommendations(); setShowHistory(false); }}
                  >
                    <p className="font-bold text-slate-100 mb-1 leading-tight">"{item.user_input}"</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                )) : <p className="text-slate-600 text-center py-20 font-medium">History is empty.</p>}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950/30 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
          <Film className="w-5 h-5" />
          <span className="text-sm font-black tracking-tighter uppercase">MOVIEMIND</span>
        </div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">AI Studio Core © 2026</p>
      </footer>
    </div>
  );
}

export default App;
