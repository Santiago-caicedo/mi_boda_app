import { NavLink } from '@/components/NavLink';
import { Home, Heart, CheckSquare, Store, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/presupuesto', icon: Heart, label: 'Presupuesto' },
  { to: '/tareas', icon: CheckSquare, label: 'Tareas' },
  { to: '/proveedores', icon: Store, label: 'Proveedores' },
  { to: '/mi-dia', icon: Gem, label: 'Mi Día' },
];

export function BottomNavigation() {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 text-muted-foreground hover:text-primary"
            activeClassName="text-primary bg-primary/10"
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <item.icon 
                    className={`w-6 h-6 transition-all duration-300 ${
                      isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
                    }`} 
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}