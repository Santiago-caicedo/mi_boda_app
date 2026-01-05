import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCOP, BUDGET_CATEGORIES } from '@/lib/constants';

interface BudgetData {
  category: string;
  spent: number;
  planned: number;
}

interface BudgetDonutChartProps {
  data: BudgetData[];
}

const COLORS = [
  'hsl(340, 70%, 75%)',   // rosa
  'hsl(165, 50%, 70%)',   // menta
  'hsl(20, 100%, 82%)',   // melocotón
  'hsl(0, 55%, 76%)',     // rose gold
  'hsl(340, 70%, 85%)',   // rosa claro
  'hsl(165, 50%, 80%)',   // menta claro
  'hsl(20, 100%, 87%)',   // melocotón claro
  'hsl(0, 55%, 82%)',     // rose gold claro
  'hsl(40, 100%, 87%)',   // cream
  'hsl(340, 40%, 70%)',   // rosa medio
  'hsl(165, 40%, 65%)',   // menta medio
  'hsl(220, 20%, 80%)',   // gris
];

export function BudgetDonutChart({ data }: BudgetDonutChartProps) {
  const chartData = data.map((item, index) => {
    const category = BUDGET_CATEGORIES.find(c => c.id === item.category);
    return {
      name: category?.label || item.category,
      value: item.spent,
      planned: item.planned,
      color: COLORS[index % COLORS.length],
    };
  }).filter(item => item.value > 0);

  const totalSpent = data.reduce((acc, item) => acc + item.spent, 0);
  const totalPlanned = data.reduce((acc, item) => acc + item.planned, 0);
  const percentage = totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card rounded-lg shadow-lg p-3 border border-border">
          <p className="font-medium text-sm text-foreground">{data.name}</p>
          <p className="text-xs text-muted-foreground">
            Gastado: {formatCOP(data.value)}
          </p>
          <p className="text-xs text-muted-foreground">
            Planeado: {formatCOP(data.planned)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="relative rounded-2xl bg-card p-5 shadow-card border border-border/50"
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        Distribución del Presupuesto
      </h3>

      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="font-display text-2xl font-bold text-foreground"
            >
              {percentage.toFixed(0)}%
            </motion.p>
            <p className="text-xs text-muted-foreground">usado</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.slice(0, 4).map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground truncate">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}