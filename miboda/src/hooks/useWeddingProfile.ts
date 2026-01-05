import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type WeddingProfile = Database['public']['Tables']['wedding_profiles']['Row'];

export function useWeddingProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['wedding_profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('wedding_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as WeddingProfile | null;
    },
    enabled: !!user,
  });
}

export function useCreateOrUpdateWeddingProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (profile: Partial<Omit<WeddingProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
      if (!user) throw new Error('Usuario no autenticado');

      const { data: existing } = await supabase
        .from('wedding_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('wedding_profiles')
          .update(profile)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('wedding_profiles')
          .insert({ user_id: user.id, ...profile });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wedding_profile'] });
      toast.success('Perfil actualizado');
    },
    onError: (error) => {
      toast.error('Error al actualizar: ' + error.message);
    },
  });
}
