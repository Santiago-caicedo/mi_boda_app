import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserWithRole extends UserProfile {
  role: string;
}

interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalWeddings: number;
  usersThisMonth: number;
}

// Hook para obtener lista de usuarios
export function useUsers() {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Obtener roles para cada usuario
      const usersWithRoles: UserWithRole[] = await Promise.all(
        (data || []).map(async (user) => {
          const { data: roleData } = await supabase.rpc('get_user_role', {
            user_uuid: user.user_id,
          });
          return {
            ...user,
            role: roleData || 'user',
          };
        })
      );

      return usersWithRoles;
    },
    enabled: isAdmin,
  });
}

// Hook para obtener estadísticas del admin
export function useAdminStats() {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<AdminStats> => {
      // Total usuarios
      const { count: totalUsers, error: usersError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Usuarios activos
      const { count: activeUsers, error: activeError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (activeError) throw activeError;

      // Total bodas (wedding_profiles)
      const { count: totalWeddings, error: weddingsError } = await supabase
        .from('wedding_profiles')
        .select('*', { count: 'exact', head: true });

      if (weddingsError) throw weddingsError;

      // Usuarios este mes
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: usersThisMonth, error: monthError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      if (monthError) throw monthError;

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        inactiveUsers: (totalUsers || 0) - (activeUsers || 0),
        totalWeddings: totalWeddings || 0,
        usersThisMonth: usersThisMonth || 0,
      };
    },
    enabled: isAdmin,
  });
}

// Hook para crear usuario
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  return useMutation({
    mutationFn: async ({ email, password, fullName }: CreateUserData) => {
      if (!isAdmin) throw new Error('No tienes permisos de administrador');

      // Obtener el token de la sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }

      // Llamar a la Edge Function usando fetch directamente
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ email, password, fullName }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear usuario');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast.success('Usuario creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error('Error al crear usuario: ' + error.message);
    },
  });
}

// Hook para activar/desactivar usuario
export function useToggleUserActive() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  return useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      if (!isAdmin) throw new Error('No tienes permisos de administrador');

      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: isActive })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast.success(isActive ? 'Usuario activado' : 'Usuario desactivado');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar usuario: ' + error.message);
    },
  });
}

// Hook para obtener un usuario específico
export function useUser(userId: string) {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      // Obtener rol
      const { data: roleData } = await supabase.rpc('get_user_role', {
        user_uuid: userId,
      });

      return {
        ...data,
        role: roleData || 'user',
      } as UserWithRole;
    },
    enabled: isAdmin && !!userId,
  });
}
