import { Link } from 'react-router-dom';
import { BeakerIcon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 glass bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
          <div className="p-1.5 bg-primary/20 rounded-lg">
            <BeakerIcon className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            Automata QA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
          <Link to="/#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link to="/#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">App Dashboard</Link>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            Get Started Free
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <nav className="flex flex-col items-center space-y-4 py-6 px-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="w-full text-center text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
              <Link to="/#features" onClick={() => setIsOpen(false)} className="w-full text-center text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link to="/#faq" onClick={() => setIsOpen(false)} className="w-full text-center text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="w-full text-center text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">App Dashboard</Link>
              <Link 
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full max-w-[200px] mt-4 inline-flex items-center justify-center rounded-md text-lg font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4"
              >
                Get Started Free
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
