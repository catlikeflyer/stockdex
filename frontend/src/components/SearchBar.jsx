import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/search?q=${query}`);
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (e) {
            // ignore
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.toUpperCase());
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (symbol) => {
    setQuery(symbol);
    onSearch(symbol);
    setShowSuggestions(false);
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full relative z-50"
      ref={wrapperRef}
    >
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Ticker (e.g. AAPL)..." 
          className="w-full bg-slate-800/50 border border-slate-700 text-fin-text-primary rounded-lg py-3 px-10 outline-none focus:border-fin-accent focus:ring-1 focus:ring-fin-accent transition-all backdrop-blur-sm"
        />
        <Search className="absolute left-3 w-5 h-5 text-gray-500" />
        {isLoading && (
          <div className="absolute right-3">
            <Loader2 className="animate-spin w-5 h-5 text-fin-accent" />
          </div>
        )}
      </form>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto"
          >
            {suggestions.map((s) => (
              <li 
                key={s.symbol}
                onClick={() => selectSuggestion(s.symbol)}
                className="px-4 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center transition-colors"
                role="button"
              >
                <span className="font-bold text-fin-text-primary">{s.symbol}</span>
                <span className="text-sm text-fin-text-secondary truncate ml-4">{s.shortname}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
