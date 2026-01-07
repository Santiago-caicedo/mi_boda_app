import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Wallet, Users, MapPin, ChevronRight, ChevronLeft, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCreateOrUpdateWeddingProfile } from '@/hooks/useWeddingProfile';
import { COLOMBIAN_CITIES, formatCOP } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';

const STEPS = [
  {
    id: 1,
    title: '¿Cuándo es tu boda?',
    subtitle: 'Selecciona la fecha del día más especial de tu vida',
    icon: Calendar,
  },
  {
    id: 2,
    title: '¿Cuál es tu presupuesto?',
    subtitle: 'No te preocupes, te ayudaremos a manejarlo',
    icon: Wallet,
  },
  {
    id: 3,
    title: '¿Cuántos invitados tendrás?',
    subtitle: 'Un estimado para planificar mejor',
    icon: Users,
  },
  {
    id: 4,
    title: '¿En qué ciudad será?',
    subtitle: 'Para conectarte con los mejores proveedores',
    icon: MapPin,
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [weddingDate, setWeddingDate] = useState<Date | undefined>();
  const [budget, setBudget] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [city, setCity] = useState('');
  
  const createProfile = useCreateOrUpdateWeddingProfile();

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Reina';

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!weddingDate;
      case 2: return !!budget && parseFloat(budget) > 0;
      case 3: return !!guestCount && parseInt(guestCount) > 0;
      case 4: return !!city;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await createProfile.mutateAsync({
        wedding_date: weddingDate?.toISOString().split('T')[0],
        total_budget: parseFloat(budget),
        guest_count: parseInt(guestCount),
        city,
        partner1_name: userName,
      });
      // Pequeño delay para asegurar que la cache se actualice
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/', { replace: true });
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const currentStepData = STEPS[currentStep - 1];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-blush via-background to-wedding-cream flex flex-col">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-10 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-20 left-10 w-60 h-60 bg-wedding-peach/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-1/3 left-1/4 w-32 h-32 bg-wedding-mint/40 rounded-full blur-2xl"
        />
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-6 pt-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground font-medium">
            Paso {currentStep} de 4
          </span>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Heart className="w-5 h-5 text-primary" />
          </motion.div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-romantic rounded-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 py-8">
        <AnimatePresence mode="wait" custom={currentStep}>
          <motion.div
            key={currentStep}
            custom={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-romantic flex items-center justify-center shadow-romantic"
              >
                <Icon className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-2xl font-bold text-foreground mb-2"
              >
                {currentStepData.title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-sm"
              >
                {currentStepData.subtitle}
              </motion.p>
            </div>

            {/* Form content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex-1 flex flex-col justify-center"
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-16 justify-start text-left font-normal rounded-2xl border-2 bg-card/80 backdrop-blur-sm",
                          !weddingDate && "text-muted-foreground",
                          weddingDate && "border-primary"
                        )}
                      >
                        <Calendar className="mr-3 h-5 w-5 text-primary" />
                        {weddingDate ? (
                          <span className="font-medium text-foreground">
                            {format(weddingDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                          </span>
                        ) : (
                          <span>Selecciona la fecha de tu boda</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <CalendarComponent
                        mode="single"
                        selected={weddingDate}
                        onSelect={setWeddingDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  {weddingDate && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20"
                    >
                      <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-sm text-primary font-medium">
                        ¡Faltan{' '}
                        {Math.ceil((weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}{' '}
                        días para tu boda!
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="relative">
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Presupuesto total en COP
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="50,000,000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="h-16 pl-8 text-xl font-display rounded-2xl border-2 bg-card/80 backdrop-blur-sm focus:border-primary"
                      />
                    </div>
                  </div>

                  {budget && parseFloat(budget) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      {[
                        { label: 'Lugar', percent: 15 },
                        { label: 'Banquete', percent: 25 },
                        { label: 'Foto/Video', percent: 10 },
                        { label: 'Otros', percent: 50 },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="p-3 rounded-xl bg-card/60 border border-border/50"
                        >
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="font-display font-bold text-foreground">
                            {formatCOP((parseFloat(budget) * item.percent) / 100)}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Número estimado de invitados
                    </Label>
                    <Input
                      type="number"
                      placeholder="150"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="h-16 text-xl font-display text-center rounded-2xl border-2 bg-card/80 backdrop-blur-sm focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-center gap-3">
                    {[50, 100, 150, 200].map((count) => (
                      <motion.button
                        key={count}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGuestCount(count.toString())}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-all",
                          guestCount === count.toString()
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {count}
                      </motion.button>
                    ))}
                  </div>

                  {guestCount && parseInt(guestCount) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-4 rounded-xl bg-secondary/20 border border-secondary/30"
                    >
                      <Users className="w-5 h-5 text-secondary-foreground mx-auto mb-2" />
                      <p className="text-sm text-secondary-foreground font-medium">
                        Necesitarás aproximadamente {Math.ceil(parseInt(guestCount) / 10)} mesas
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Ciudad de la boda
                    </Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="h-16 text-lg rounded-2xl border-2 bg-card/80 backdrop-blur-sm focus:border-primary">
                        <SelectValue placeholder="Selecciona tu ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOMBIAN_CITIES.map((c) => (
                          <SelectItem key={c} value={c} className="text-base py-3">
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {city && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-4 rounded-xl bg-wedding-mint/20 border border-wedding-mint/30"
                    >
                      <MapPin className="w-5 h-5 text-wedding-mint mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        ¡Tenemos los mejores proveedores en {city}!
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="relative z-10 px-6 pb-8">
        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="rounded-xl h-14 px-6"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Atrás
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            {currentStep < 4 ? (
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full rounded-xl h-14 bg-gradient-romantic hover:opacity-90 text-primary-foreground font-semibold shadow-romantic"
              >
                Continuar
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleComplete}
                disabled={!canProceed() || createProfile.isPending}
                className="w-full rounded-xl h-14 bg-gradient-romantic hover:opacity-90 text-primary-foreground font-semibold shadow-romantic"
              >
                {createProfile.isPending ? (
                  'Guardando...'
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    ¡Empezar a planificar!
                  </>
                )}
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
