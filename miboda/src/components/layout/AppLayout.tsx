import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="pb-24 safe-top"
      >
        {children}
      </motion.main>
      <BottomNavigation />
    </div>
  );
}