import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { formatCOP } from '@/lib/constants';

interface QuickStatsProps {
  totalSpent: number;
  totalPlanned: number;
  completedTasks: number;
  totalTasks: number;
  pendingPayments: number;
  savings: number;
}

export function QuickStats({
  totalSpent,
  totalPlanned,
  completedTasks,
  totalTasks,
  pendingPayments,
  savings,
}: QuickStatsProps) {
  const stats = [
    {
      label: 'Gastado',
      value: formatCOP(totalSpent),
      subValue: `de ${formatCOP(totalPlanned)}`,
      icon: Wallet,
      color: 'bg-primary text-primary-foreground',
    },
    {
      label: 'Tareas',
      value: `${completedTasks}/${totalTasks}`,
      subValue: 'completadas',
      icon: CheckCircle2,
      color: 'bg-secondary text-secondary-foreground',
    },
    {
      label: 'Por pagar',
      value: formatCOP(pendingPayments),
      subValue: 'este mes',
      icon: Clock,
      color: 'bg-accent text-accent-foreground',
    },
    {
      label: 'Ahorro',
      value: formatCOP(savings),
      subValue: 'vs promedio',
      icon: TrendingUp,
      color: 'bg-gold text-gold-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden rounded-xl bg-card p-4 shadow-soft border border-border/30"
        >
          <div className={`absolute top-3 right-3 w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
            <stat.icon className="w-4 h-4" />
          </div>
          
          <p className="text-xs text-muted-foreground font-medium mb-1">
            {stat.label}
          </p>
          <p className="font-display text-lg font-bold text-foreground">
            {stat.value}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {stat.subValue}
          </p>
        </motion.div>
      ))}
    </div>
  );
}