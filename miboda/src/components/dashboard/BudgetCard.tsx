import { motion } from 'framer-motion';
import { formatCOP } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BudgetCardProps {
  title: string;
  spent: number;
  planned: number;
  icon: React.ReactNode;
  colorClass?: string;
  delay?: number;
}

export function BudgetCard({ 
  title, 
  spent, 
  planned, 
  icon, 
  colorClass = 'bg-primary',
  delay = 0 
}: BudgetCardProps) {
  const percentage = planned > 0 ? Math.min((spent / planned) * 100, 100) : 0;
  const isOverBudget = spent > planned;
  const remaining = planned - spent;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl bg-card p-5 shadow-card border border-border/50"
    >
      {/* Background decoration */}
      <div className={cn(
        "absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 blur-2xl",
        colorClass
      )} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl",
            colorClass,
            "text-card"
          )}>
            {icon}
          </div>
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            isOverBudget 
              ? "bg-destructive/10 text-destructive" 
              : percentage > 80 
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-secondary-foreground"
          )}>
            {percentage.toFixed(0)}%
          </span>
        </div>

        {/* Title */}
        <h3 className="font-body text-sm font-medium text-muted-foreground mb-1">
          {title}
        </h3>

        {/* Amount */}
        <p className="font-display text-xl font-bold text-foreground mb-3">
          {formatCOP(spent)}
        </p>

        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
            className={cn(
              "h-full rounded-full",
              isOverBudget 
                ? "bg-destructive" 
                : percentage > 80 
                  ? "bg-accent" 
                  : "bg-primary"
            )}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            de {formatCOP(planned)}
          </span>
          <span className={cn(
            "font-medium",
            isOverBudget ? "text-destructive" : "text-secondary-foreground"
          )}>
            {isOverBudget ? 'Excedido' : `Quedan ${formatCOP(remaining)}`}
          </span>
        </div>
      </div>
    </motion.div>
  );
}