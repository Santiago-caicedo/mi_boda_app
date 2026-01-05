import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Budget = Database['public']['Tables']['budgets']['Row'];
type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
type BudgetCategory = Database['public']['Enums']['budget_category'];

export function useBudgets() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['budgets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('category');

      if (error) throw error;
      return data as Budget[];
    },
    enabled: !!user,
  });
}

export function useUpdateBudgetSpent() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ category, amount }: { category: BudgetCategory; amount: number }) => {
      if (!user) throw new Error('Usuario no autenticado');

      // First check if budget exists for this category
      const { data: existing } = await supabase
        .from('budgets')
        .select('id, spent_amount')
        .eq('user_id', user.id)
        .eq('category', category)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('budgets')
          .update({ spent_amount: existing.spent_amount + amount })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('budgets')
          .insert({ user_id: user.id, category, spent_amount: amount, planned_amount: 0 });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
    onError: (error) => {
      toast.error('Error al actualizar presupuesto: ' + error.message);
    },
  });
}

export function useUpdateBudgetPlanned() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ category, plannedAmount }: { category: BudgetCategory; plannedAmount: number }) => {
      if (!user) throw new Error('Usuario no autenticado');

      const { data: existing } = await supabase
        .from('budgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', category)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('budgets')
          .update({ planned_amount: plannedAmount })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('budgets')
          .insert({ user_id: user.id, category, planned_amount: plannedAmount, spent_amount: 0 });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Presupuesto actualizado');
    },
    onError: (error) => {
      toast.error('Error al actualizar presupuesto: ' + error.message);
    },
  });
}

export function useSetBudgetSpent() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ category, spentAmount }: { category: BudgetCategory; spentAmount: number }) => {
      if (!user) throw new Error('Usuario no autenticado');

      const { data: existing } = await supabase
        .from('budgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', category)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('budgets')
          .update({ spent_amount: spentAmount })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('budgets')
          .insert({ user_id: user.id, category, spent_amount: spentAmount, planned_amount: 0 });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
    onError: (error) => {
      toast.error('Error al actualizar gasto: ' + error.message);
    },
  });
}
