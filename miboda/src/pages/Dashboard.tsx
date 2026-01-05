import { motion } from 'framer-motion';
import { Heart, Wallet, ListTodo, TrendingUp } from 'lucide-react';
import { CountdownTimer } from '@/components/dashboard/CountdownTimer';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { BudgetDonutChart } from '@/components/dashboard/BudgetDonutChart';
import { MotivationalQuote } from '@/components/dashboard/MotivationalQuote';
import { BudgetCard } from '@/components/dashboard/BudgetCard';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useBudgets } from '@/hooks/useBudgets';
import { useTasks } from '@/hooks/useTasks';
import { useTransactions } from '@/hooks/useTransactions';
import { useWeddingProfile } from '@/hooks/useWeddingProfile';
import { BUDGET_CATEGORIES, formatCOP } from '@/lib/constants';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'reina';

  const { data: budgets, isLoading: budgetsLoading } = useBudgets();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const { data: weddingProfile, isLoading: profileLoading } = useWeddingProfile();

  const isLoading = budgetsLoading || tasksLoading || transactionsLoading || profileLoading;

  // Calculate budget data from real data
  const budgetData = BUDGET_CATEGORIES.map(cat => {
    const budget = budgets?.find(b => b.category === cat.id);
    return {
      category: cat.id,
      spent: budget?.spent_amount || 0,
      planned: budget?.planned_amount || (weddingProfile?.total_budget ? (weddingProfile.total_budget * cat.percentage) / 100 : 0),
    };
  });

  const totalSpent = budgetData.reduce((acc, item) => acc + item.spent, 0);
  const totalPlanned = budgetData.reduce((acc, item) => acc + item.planned, 0);

  // Calculate task stats
  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const totalTasks = tasks?.length || 0;

  // Calculate pending payments (expenses from transactions this month not yet paid)
  const pendingPayments = transactions
    ?.filter(t => t.type === 'gasto')
    .reduce((acc, t) => acc + t.amount, 0) || 0;

  // Calculate savings (income - spent)
  const totalIncome = transactions
    ?.filter(t => t.type === 'ingreso')
    .reduce((acc, t) => acc + t.amount, 0) || 0;
  const savings = totalIncome - totalSpent;

  // Get wedding date
  const weddingDate = weddingProfile?.wedding_date 
    ? new Date(weddingProfile.wedding_date) 
    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default 1 year from now

  // Get top 3 budget categories by spent amount
  const topBudgets = [...budgetData]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  // Get upcoming tasks (next 3 pending tasks by due date)
  const upcomingTasks = tasks
    ?.filter(t => !t.completed && t.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 3) || [];

  const getCategoryLabel = (categoryId: string) => {
    return BUDGET_CATEGORIES.find(c => c.id === categoryId)?.label || categoryId;
  };

  const formatTaskDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const isTaskUrgent = (dateStr: string) => {
    const dueDate = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <PageHeader
          title="Mi Boda 💕"
          subtitle={`¡Hola ${userName}! Cargando...`}
          showNotifications
        />
        <div className="px-4 py-6 space-y-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-24 rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Mi Boda 💕"
        subtitle={`¡Hola ${userName}! Todo va perfecto`}
        showNotifications
      />

      <div className="px-4 py-6 space-y-6">
        {/* Countdown */}
        <CountdownTimer weddingDate={weddingDate} />

        {/* Motivational Quote */}
        <MotivationalQuote />

        {/* Quick Stats */}
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">
            Resumen Rápido
          </h2>
          <QuickStats
            totalSpent={totalSpent}
            totalPlanned={totalPlanned}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            pendingPayments={pendingPayments}
            savings={savings}
          />
        </section>

        {/* Budget Chart */}
        <section>
          <BudgetDonutChart data={budgetData} />
        </section>

        {/* Top Budget Categories */}
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">
            Principales Gastos
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {topBudgets.map((budget, index) => {
              const category = BUDGET_CATEGORIES.find(c => c.id === budget.category);
              return (
                <BudgetCard
                  key={budget.category}
                  title={getCategoryLabel(budget.category)}
                  spent={budget.spent}
                  planned={budget.planned}
                  icon={<Wallet className="w-5 h-5" />}
                  colorClass={category?.color || 'bg-primary'}
                  delay={0.1 * (index + 1)}
                />
              );
            })}
            {topBudgets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aún no hay gastos registrados</p>
                <Link to="/budget">
                  <Button variant="link" className="text-primary mt-2">
                    Agregar primer gasto
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Tasks Preview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Próximas Tareas
            </h2>
            <Link to="/tasks">
              <Button variant="link" className="text-primary p-0 h-auto">
                Ver todas
              </Button>
            </Link>
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {upcomingTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50"
              >
                <div className={`w-3 h-3 rounded-full ${isTaskUrgent(task.due_date!) ? 'bg-destructive animate-pulse' : 'bg-secondary'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Vence: {formatTaskDate(task.due_date!)}
                  </p>
                </div>
                <ListTodo className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            ))}
            {upcomingTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ListTodo className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay tareas pendientes</p>
                <Link to="/tasks">
                  <Button variant="link" className="text-primary mt-2">
                    Crear primera tarea
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
