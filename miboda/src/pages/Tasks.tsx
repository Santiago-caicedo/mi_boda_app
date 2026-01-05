import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus, Calendar, Check } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useTasks, useAddTask, useToggleTask } from '@/hooks/useTasks';

export default function Tasks() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const { data: tasks, isLoading } = useTasks();
  const addTask = useAddTask();
  const toggleTask = useToggleTask();

  const completedCount = tasks?.filter(t => t.completed).length || 0;
  const pendingCount = tasks?.filter(t => !t.completed).length || 0;
  const totalCount = tasks?.length || 0;

  const filteredTasks = tasks?.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  }) || [];

  const handleToggleTask = (id: string, currentCompleted: boolean) => {
    toggleTask.mutate({ id, completed: !currentCompleted });
  };

  const handleAddTask = async () => {
    if (!newTitle.trim()) return;

    await addTask.mutateAsync({
      title: newTitle,
      description: newDescription || undefined,
      due_date: newDueDate || undefined,
    });

    setNewTitle('');
    setNewDescription('');
    setNewDueDate('');
    setIsAddOpen(false);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  const isOverdue = (dateStr: string | null, completed: boolean) => {
    if (!dateStr || completed) return false;
    return new Date(dateStr) < new Date();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24">
        <PageHeader
          title="Tareas"
          subtitle="Cargando..."
          icon={<CheckSquare className="w-5 h-5 text-primary" />}
        />
        <div className="px-4 py-6 space-y-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-10 rounded-lg" />
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        title="Tareas"
        subtitle={`${completedCount} de ${totalCount} completadas`}
        icon={<CheckSquare className="w-5 h-5 text-primary" />}
        action={
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full bg-primary">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Nueva Tarea</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Título</Label>
                  <Input 
                    placeholder="Ej: Llamar a la florista"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Descripción (opcional)</Label>
                  <Textarea 
                    placeholder="Agrega más detalles..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Fecha de vencimiento</Label>
                  <Input 
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleAddTask}
                  disabled={addTask.isPending || !newTitle.trim()}
                >
                  {addTask.isPending ? 'Creando...' : 'Crear Tarea'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="px-4 py-6 space-y-6">
        {/* Progress Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl bg-gradient-romantic p-5 shadow-romantic"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-primary-foreground/70">Progreso total</p>
              <p className="font-display text-2xl font-bold text-primary-foreground">
                {totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="relative w-16 h-16"
            >
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="white"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 176' }}
                  animate={{ 
                    strokeDasharray: totalCount > 0 
                      ? `${(completedCount / totalCount) * 176} 176`
                      : '0 176'
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white" />
              <span className="text-primary-foreground/80">{completedCount} completadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/40" />
              <span className="text-primary-foreground/80">{pendingCount} pendientes</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="all" className="rounded-lg">Todas</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg">Pendientes</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg">Completadas</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    className={cn(
                      "rounded-xl bg-card border p-4 shadow-soft transition-all",
                      task.completed 
                        ? "border-secondary/30 bg-secondary/5" 
                        : isOverdue(task.due_date, task.completed)
                          ? "border-destructive/30"
                          : "border-border/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTask(task.id, task.completed)}
                        disabled={toggleTask.isPending}
                        className={cn(
                          "mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          task.completed
                            ? "bg-secondary border-secondary"
                            : "border-muted-foreground/30 hover:border-primary"
                        )}
                      >
                        {task.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                          >
                            <Check className="w-4 h-4 text-secondary-foreground" />
                          </motion.div>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-sm transition-all",
                          task.completed 
                            ? "text-muted-foreground line-through" 
                            : "text-foreground"
                        )}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                        {task.due_date && (
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className={cn(
                              "text-xs",
                              isOverdue(task.due_date, task.completed)
                                ? "text-destructive font-medium"
                                : "text-muted-foreground"
                            )}>
                              {formatDate(task.due_date)}
                              {isOverdue(task.due_date, task.completed) && " (vencida)"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredTasks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <CheckSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {filter === 'completed' 
                      ? 'No hay tareas completadas aún' 
                      : filter === 'pending'
                        ? '¡Felicidades! No tienes tareas pendientes'
                        : 'No hay tareas. ¡Crea tu primera tarea!'}
                  </p>
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
