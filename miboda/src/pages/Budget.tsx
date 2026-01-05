import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, TrendingUp, TrendingDown, FileDown, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BUDGET_CATEGORIES, formatCOP } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useBudgets, useUpdateBudgetSpent, useUpdateBudgetPlanned, useSetBudgetSpent } from '@/hooks/useBudgets';
import { useTransactions, useAddTransaction } from '@/hooks/useTransactions';
import { useWeddingProfile } from '@/hooks/useWeddingProfile';
import * as LucideIcons from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type BudgetCategory = Database['public']['Enums']['budget_category'];

function getIconComponent(iconName: string) {
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent ? <IconComponent className="w-5 h-5" /> : <Heart className="w-5 h-5" />;
}

export default function Budget() {
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [editPlanned, setEditPlanned] = useState('');
  const [editSpent, setEditSpent] = useState('');
  
  // Form state
  const [expenseCategory, setExpenseCategory] = useState<BudgetCategory | ''>('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDescription, setIncomeDescription] = useState('');

  const { data: budgets, isLoading: budgetsLoading } = useBudgets();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const { data: weddingProfile } = useWeddingProfile();
  
  const addTransaction = useAddTransaction();
  const updateBudgetSpent = useUpdateBudgetSpent();
  const updateBudgetPlanned = useUpdateBudgetPlanned();
  const setBudgetSpent = useSetBudgetSpent();

  const isLoading = budgetsLoading || transactionsLoading;

  // Calculate budget data
  const budgetData = BUDGET_CATEGORIES.map(cat => {
    const budget = budgets?.find(b => b.category === cat.id);
    return {
      category: cat.id as BudgetCategory,
      spent: budget?.spent_amount || 0,
      planned: budget?.planned_amount || (weddingProfile?.total_budget ? (weddingProfile.total_budget * cat.percentage) / 100 : 0),
    };
  });

  const totalSpent = budgetData.reduce((acc, item) => acc + item.spent, 0);
  const totalPlanned = budgetData.reduce((acc, item) => acc + item.planned, 0);
  const totalIncome = transactions?.filter(t => t.type === 'ingreso').reduce((acc, t) => acc + t.amount, 0) || 0;

  const percentage = totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0;
  const remaining = totalPlanned - totalSpent;

  const handleAddExpense = async () => {
    if (!expenseCategory || !expenseAmount) return;
    
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) return;

    await addTransaction.mutateAsync({
      amount,
      type: 'gasto',
      category: expenseCategory,
      description: expenseDescription || undefined,
    });

    await updateBudgetSpent.mutateAsync({
      category: expenseCategory,
      amount,
    });

    setExpenseCategory('');
    setExpenseAmount('');
    setExpenseDescription('');
    setIsExpenseOpen(false);
  };

  const handleAddIncome = async () => {
    if (!incomeAmount) return;
    
    const amount = parseFloat(incomeAmount);
    if (isNaN(amount) || amount <= 0) return;

    await addTransaction.mutateAsync({
      amount,
      type: 'ingreso',
      description: incomeSource ? `${incomeSource}: ${incomeDescription}` : incomeDescription || undefined,
    });

    setIncomeSource('');
    setIncomeAmount('');
    setIncomeDescription('');
    setIsIncomeOpen(false);
  };

  const handleEditCategory = (category: BudgetCategory, planned: number, spent: number) => {
    setEditingCategory(category);
    setEditPlanned(planned.toString());
    setEditSpent(spent.toString());
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;
    
    const plannedAmount = parseFloat(editPlanned) || 0;
    const spentAmount = parseFloat(editSpent) || 0;
    
    await updateBudgetPlanned.mutateAsync({
      category: editingCategory,
      plannedAmount,
    });
    
    await setBudgetSpent.mutateAsync({
      category: editingCategory,
      spentAmount,
    });
    
    setEditingCategory(null);
    setEditPlanned('');
    setEditSpent('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24">
        <PageHeader
          title="Presupuesto"
          subtitle="Controla cada peso de tu boda"
          icon={<Heart className="w-5 h-5 text-primary" />}
        />
        <div className="px-4 py-6 space-y-6">
          <Skeleton className="h-40 rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
          <Skeleton className="h-20 rounded-xl" />
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        title="Presupuesto"
        subtitle="Controla cada peso de tu boda"
        icon={<Heart className="w-5 h-5 text-primary" />}
      />

      <div className="px-4 py-6 space-y-6">
        {/* Summary Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-romantic p-6 shadow-romantic"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-primary-foreground/70 font-medium">Total Gastado</p>
                <p className="font-display text-3xl font-bold text-primary-foreground">
                  {formatCOP(totalSpent)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-foreground/70 font-medium">Presupuesto</p>
                <p className="font-display text-xl font-semibold text-primary-foreground">
                  {formatCOP(totalPlanned)}
                </p>
              </div>
            </div>

            <div className="h-3 bg-white/30 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={cn(
                  "h-full rounded-full",
                  percentage > 100 ? "bg-destructive" : percentage > 80 ? "bg-accent" : "bg-white"
                )}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-primary-foreground/80">{percentage.toFixed(0)}% usado</span>
              <span className="text-primary-foreground font-medium">
                {remaining >= 0 ? `Quedan ${formatCOP(remaining)}` : `Excedido ${formatCOP(Math.abs(remaining))}`}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-romantic">
                <TrendingDown className="w-5 h-5 mr-2" />
                Agregar Gasto
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Nuevo Gasto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Categoría</Label>
                  <Select value={expenseCategory} onValueChange={(v) => setExpenseCategory(v as BudgetCategory)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Monto (COP)</Label>
                  <Input 
                    type="number" 
                    placeholder="$0" 
                    className="text-lg"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Input 
                    placeholder="Ej: Anticipo al fotógrafo"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleAddExpense}
                  disabled={addTransaction.isPending || !expenseCategory || !expenseAmount}
                >
                  {addTransaction.isPending ? 'Guardando...' : 'Guardar Gasto'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isIncomeOpen} onOpenChange={setIsIncomeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-14 rounded-xl border-secondary bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground">
                <TrendingUp className="w-5 h-5 mr-2" />
                Agregar Ingreso
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Nuevo Ingreso</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Fuente</Label>
                  <Select value={incomeSource} onValueChange={setIncomeSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona fuente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="familia_novia">Familia de la novia</SelectItem>
                      <SelectItem value="familia_novio">Familia del novio</SelectItem>
                      <SelectItem value="ahorros">Ahorros propios</SelectItem>
                      <SelectItem value="vaki">Vaki / Lista de bodas</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Monto (COP)</Label>
                  <Input 
                    type="number" 
                    placeholder="$0" 
                    className="text-lg"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Descripción (opcional)</Label>
                  <Input 
                    placeholder="Ej: Aporte de los papás"
                    value={incomeDescription}
                    onChange={(e) => setIncomeDescription(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90" 
                  onClick={handleAddIncome}
                  disabled={addTransaction.isPending || !incomeAmount}
                >
                  {addTransaction.isPending ? 'Guardando...' : 'Guardar Ingreso'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Income Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-secondary/20 border border-secondary/30 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="font-display text-xl font-bold text-foreground">{formatCOP(totalIncome)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Disponible</p>
              <p className={cn(
                "font-semibold",
                totalIncome - totalSpent >= 0 ? "text-secondary-foreground" : "text-destructive"
              )}>
                {formatCOP(totalIncome - totalSpent)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Categories List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Categorías
            </h2>
            <Button variant="ghost" size="sm" className="text-primary">
              <FileDown className="w-4 h-4 mr-1" />
              Exportar PDF
            </Button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {BUDGET_CATEGORIES.map((category, index) => {
                const budgetItem = budgetData.find(b => b.category === category.id);
                const spent = budgetItem?.spent || 0;
                const planned = budgetItem?.planned || 0;
                const catPercentage = planned > 0 ? (spent / planned) * 100 : 0;
                const isOverBudget = spent > planned;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl bg-card border border-border/50 p-4 shadow-soft"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-card",
                        category.color
                      )}>
                        {getIconComponent(category.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {category.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCOP(spent)} de {formatCOP(planned)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleEditCategory(category.id as BudgetCategory, planned, spent)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <span className={cn(
                        "text-sm font-semibold",
                        isOverBudget ? "text-destructive" : "text-foreground"
                      )}>
                        {catPercentage.toFixed(0)}%
                      </span>
                    </div>

                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(catPercentage, 100)}%` }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.6 }}
                        className={cn(
                          "h-full rounded-full transition-colors",
                          isOverBudget 
                            ? "bg-destructive" 
                            : catPercentage > 80 
                              ? "bg-accent" 
                              : "bg-primary"
                        )}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>

        {/* Edit Category Dialog */}
        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Editar {BUDGET_CATEGORIES.find(c => c.id === editingCategory)?.label}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Presupuesto Planificado (COP)</Label>
                <Input 
                  type="number" 
                  placeholder="$0" 
                  className="text-lg"
                  value={editPlanned}
                  onChange={(e) => setEditPlanned(e.target.value)}
                />
              </div>
              <div>
                <Label>Gastado (COP)</Label>
                <Input 
                  type="number" 
                  placeholder="$0" 
                  className="text-lg"
                  value={editSpent}
                  onChange={(e) => setEditSpent(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleSaveEdit}
                disabled={updateBudgetPlanned.isPending || setBudgetSpent.isPending}
              >
                {updateBudgetPlanned.isPending || setBudgetSpent.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
