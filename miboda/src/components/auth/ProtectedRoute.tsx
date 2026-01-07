import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      // Los admins siempre están activos
      if (isAdmin) {
        setIsActive(true);
        setChecking(false);
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_active')
        .eq('user_id', user.id)
        .single();

      if (profile?.is_active === false) {
        toast.error('Tu cuenta ha sido suspendida. Comunícate con el administrador para realizar el pago.');
        await signOut();
        setIsActive(false);
      } else {
        setIsActive(true);
      }
      setChecking(false);
    };

    checkUserStatus();

    // Verificar cada 30 segundos si el usuario sigue activo
    const interval = setInterval(checkUserStatus, 30000);

    return () => clearInterval(interval);
  }, [user, isAdmin, signOut]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-romantic shadow-romantic flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary-foreground fill-current animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm">Cargando tu boda...</p>
        </motion.div>
      </div>
    );
  }

  if (!user || isActive === false) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}