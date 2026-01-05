import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Provider = Database['public']['Tables']['providers']['Row'];
type BudgetCategory = Database['public']['Enums']['budget_category'];

export function useProviders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['providers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      return data as Provider[];
    },
    enabled: !!user,
  });
}

export function useAddProvider() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (provider: {
      name: string;
      category: BudgetCategory;
      city?: string;
      price_approx?: number;
      whatsapp?: string;
      instagram?: string;
    }) => {
      if (!user) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('providers')
        .insert({
          user_id: user.id,
          name: provider.name,
          category: provider.category,
          city: provider.city || null,
          price_approx: provider.price_approx || null,
          whatsapp: provider.whatsapp || null,
          instagram: provider.instagram || null,
          is_custom: true,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast.success('Proveedor guardado');
    },
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message);
    },
  });
}

export function useUpdateProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Provider> }) => {
      const { error } = await supabase
        .from('providers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
    onError: (error) => {
      toast.error('Error al actualizar: ' + error.message);
    },
  });
}

export function useDeleteProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('providers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast.success('Proveedor eliminado');
    },
    onError: (error) => {
      toast.error('Error al eliminar: ' + error.message);
    },
  });
}
