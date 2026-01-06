import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 shadow-lg flex items-center justify-center">
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm">Verificando permisos...</p>
        </motion.div>
      </div>
    );
  }

  // Si no hay usuario, redirigir a auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Si no es admin, redirigir a home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
