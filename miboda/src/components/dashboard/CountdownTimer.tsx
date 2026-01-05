import { motion } from 'framer-motion';
import { Heart, Calendar } from 'lucide-react';
import { getDaysUntilWedding, formatDateLong } from '@/lib/constants';

interface CountdownTimerProps {
  weddingDate: Date | string;
}

export function CountdownTimer({ weddingDate }: CountdownTimerProps) {
  const days = getDaysUntilWedding(weddingDate);
  const isPast = days < 0;
  const isToday = days === 0;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="relative overflow-hidden rounded-3xl bg-gradient-romantic p-6 shadow-romantic"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm mb-4"
        >
          <Heart className="w-8 h-8 text-primary-foreground fill-current" />
        </motion.div>

        {isToday ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-3xl font-bold text-primary-foreground mb-2">
              ¡Hoy es el gran día!
            </h2>
            <p className="text-primary-foreground/80 font-body">
              ¡Feliz boda! 💕
            </p>
          </motion.div>
        ) : isPast ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-3xl font-bold text-primary-foreground mb-2">
              ¡Ya están casados!
            </h2>
            <p className="text-primary-foreground/80 font-body">
              {Math.abs(days)} días de felicidad juntos 💍
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-primary-foreground/70 font-body text-sm uppercase tracking-wider mb-2">
              Faltan
            </p>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <motion.span
                key={days}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-display text-6xl font-bold text-primary-foreground"
              >
                {days}
              </motion.span>
              <span className="font-display text-2xl text-primary-foreground/80">
                días
              </span>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="inline-flex items-center gap-2 text-primary-foreground/70"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-body">
                {formatDateLong(weddingDate)}
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}