import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { getRandomPhrase } from '@/lib/constants';
import { useState, useEffect } from 'react';

export function MotivationalQuote() {
  const [phrase, setPhrase] = useState(getRandomPhrase());

  useEffect(() => {
    // Change phrase every 30 seconds
    const interval = setInterval(() => {
      setPhrase(getRandomPhrase());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-4"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5" />
      
      <div className="relative z-10 flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <Sparkles className="w-5 h-5 text-primary" />
        </motion.div>
        
        <motion.p
          key={phrase}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-body text-sm text-foreground/80 italic"
        >
          {phrase}
        </motion.p>
      </div>
    </motion.div>
  );
}