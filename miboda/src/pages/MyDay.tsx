import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gem, Clock, Users, PartyPopper, Cloud, Check, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock schedule data
const mockSchedule = [
  { id: 1, time: '08:00', activity: 'Desayuno de la novia con damas', completed: false },
  { id: 2, time: '09:00', activity: 'Maquillaje y peinado', completed: false },
  { id: 3, time: '10:00', activity: 'Llegada del fotógrafo', completed: false },
  { id: 4, time: '11:00', activity: 'Sesión de fotos de preparación', completed: false },
  { id: 5, time: '13:00', activity: 'Almuerzo ligero', completed: false },
  { id: 6, time: '14:00', activity: 'Vestirse', completed: false },
  { id: 7, time: '15:00', activity: 'First look (opcional)', completed: false },
  { id: 8, time: '16:00', activity: 'Ceremonia religiosa', completed: false },
  { id: 9, time: '17:00', activity: 'Cocktail y fotos con invitados', completed: false },
  { id: 10, time: '18:00', activity: 'Entrada al salón', completed: false },
  { id: 11, time: '18:30', activity: 'Primer baile', completed: false },
  { id: 12, time: '19:00', activity: 'Cena', completed: false },
  { id: 13, time: '20:00', activity: 'Corte de torta', completed: false },
  { id: 14, time: '20:30', activity: 'Baile del padre/madre', completed: false },
  { id: 15, time: '21:00', activity: 'Fiesta y baile', completed: false },
  { id: 16, time: '00:00', activity: 'Despedida de los novios', completed: false },
];

// Mock checklist
const mockChecklist = [
  { id: 1, item: 'Vestido de novia empacado', checked: true },
  { id: 2, item: 'Argollas con el padrino', checked: true },
  { id: 3, item: 'Documentos de identidad', checked: true },
  { id: 4, item: 'Ramo de novia listo', checked: false },
  { id: 5, item: 'Zapatos de repuesto', checked: false },
  { id: 6, item: 'Kit de emergencia', checked: false },
  { id: 7, item: 'Propinas en sobres', checked: false },
  { id: 8, item: 'Maleta de luna de miel', checked: false },
  { id: 9, item: 'Discursos preparados', checked: false },
  { id: 10, item: 'Playlist confirmada con DJ', checked: false },
];

// Mock tables
const mockTables = [
  { id: 1, number: 1, name: 'Mesa Principal', guests: ['Novios', 'Papás Novia', 'Papás Novio', 'Testigos'] },
  { id: 2, number: 2, name: 'Familia Novia', guests: ['Tía María', 'Tío Juan', 'Prima Ana', 'Primo Carlos'] },
  { id: 3, number: 3, name: 'Familia Novio', guests: ['Abuela Rosa', 'Tía Carmen', 'Primo Pedro', 'Prima Lucía'] },
  { id: 4, number: 4, name: 'Amigos Universidad', guests: ['Andrea', 'Camilo', 'Diana', 'Felipe', 'Gabriela'] },
  { id: 5, number: 5, name: 'Amigos Trabajo', guests: ['Laura', 'Martín', 'Natalia', 'Oscar'] },
];

export default function MyDay() {
  const [schedule, setSchedule] = useState(mockSchedule);
  const [checklist, setChecklist] = useState(mockChecklist);
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleScheduleItem = (id: number) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const toggleChecklistItem = (id: number) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const allComplete = checklist.every(item => item.checked);

  const handleCelebrate = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        title="Mi Día"
        subtitle="Todo listo para el gran momento"
        icon={<Gem className="w-5 h-5 text-primary animate-pulse" />}
      />

      <div className="px-4 py-6 space-y-6">
        {/* Celebration Button */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <Button
            onClick={handleCelebrate}
            className="w-full h-16 rounded-2xl bg-gradient-romantic shadow-romantic text-lg font-display font-semibold text-primary-foreground hover:shadow-glow-pink transition-all"
          >
            <PartyPopper className="w-6 h-6 mr-2" />
            ¡Todo listo para mi boda soñada!
          </Button>
          
          {/* Confetti animation */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: -100, 
                    x: Math.random() * window.innerWidth,
                    rotate: 0,
                    opacity: 1
                  }}
                  animate={{ 
                    y: window.innerHeight + 100,
                    rotate: 720,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5
                  }}
                  className={cn(
                    "absolute w-3 h-3 rounded-sm",
                    ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-gold'][Math.floor(Math.random() * 4)]
                  )}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="schedule" className="text-xs">
              <Clock className="w-3.5 h-3.5 mr-1" />
              Cronograma
            </TabsTrigger>
            <TabsTrigger value="seating" className="text-xs">
              <Users className="w-3.5 h-3.5 mr-1" />
              Mesas
            </TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs">
              <Check className="w-3.5 h-3.5 mr-1" />
              Checklist
            </TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Cronograma del Día</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-0">
                {schedule.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative flex items-start gap-4 py-3"
                  >
                    <button
                      onClick={() => toggleScheduleItem(item.id)}
                      className={cn(
                        "relative z-10 w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                        item.completed
                          ? "bg-secondary border-secondary"
                          : "bg-card border-border hover:border-primary"
                      )}
                    >
                      {item.completed ? (
                        <Check className="w-5 h-5 text-secondary-foreground" />
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.time.split(':')[0]}
                        </span>
                      )}
                    </button>
                    
                    <div className="flex-1 pt-2">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {item.time}
                      </p>
                      <p className={cn(
                        "font-medium text-sm",
                        item.completed ? "text-muted-foreground line-through" : "text-foreground"
                      )}>
                        {item.activity}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Seating Tab */}
          <TabsContent value="seating" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Distribución de Mesas</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                <Plus className="w-4 h-4 mr-1" />
                Nueva Mesa
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {mockTables.map((table, index) => (
                <motion.div
                  key={table.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl bg-card border border-border/50 p-4 shadow-soft"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{table.number}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground truncate">
                      {table.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {table.guests.map((guest, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {guest}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {table.guests.length} invitados
                  </p>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Checklist Día D</h3>
              <span className="text-sm text-muted-foreground">
                {checklist.filter(i => i.checked).length}/{checklist.length}
              </span>
            </div>

            {/* Plan B Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="rounded-xl bg-accent/30 border border-accent p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-5 h-5 text-accent-foreground" />
                <h4 className="font-medium text-accent-foreground">Plan B - Lluvia</h4>
              </div>
              <p className="text-sm text-accent-foreground/80">
                Carpa en el jardín confirmada. Contacto: Carlos (317 456 7890)
              </p>
            </motion.div>

            <div className="space-y-2">
              {checklist.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                    item.checked
                      ? "bg-secondary/10 border-secondary/30"
                      : "bg-card border-border/50 hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    item.checked
                      ? "bg-secondary border-secondary"
                      : "border-muted-foreground/30"
                  )}>
                    {item.checked && <Check className="w-3 h-3 text-secondary-foreground" />}
                  </div>
                  <span className={cn(
                    "text-sm",
                    item.checked ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {item.item}
                  </span>
                </motion.button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}