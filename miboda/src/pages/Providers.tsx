import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Plus, Instagram, MapPin, Check, MessageCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BUDGET_CATEGORIES, COLOMBIAN_CITIES, formatCOP } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useProviders, useAddProvider, useUpdateProvider } from '@/hooks/useProviders';
import type { Database } from '@/integrations/supabase/types';

type BudgetCategory = Database['public']['Enums']['budget_category'];

export default function Providers() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<BudgetCategory | ''>('');
  const [newCity, setNewCity] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newInstagram, setNewInstagram] = useState('');

  const { data: providers, isLoading } = useProviders();
  const addProvider = useAddProvider();
  const updateProvider = useUpdateProvider();

  const hiredCount = providers?.filter(p => p.hired).length || 0;

  const filteredProviders = providers?.filter(provider => {
    const matchesCategory = filterCategory === 'all' || provider.category === filterCategory;
    const matchesCity = filterCity === 'all' || provider.city === filterCity;
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCity && matchesSearch;
  }) || [];

  const handleToggleContacted = (id: string, current: boolean) => {
    updateProvider.mutate({ id, updates: { contacted: !current } });
  };

  const handleToggleHired = (id: string, current: boolean) => {
    updateProvider.mutate({ id, updates: { hired: !current, contacted: true } });
  };

  const handleAddProvider = async () => {
    if (!newName.trim() || !newCategory) return;

    await addProvider.mutateAsync({
      name: newName,
      category: newCategory,
      city: newCity || undefined,
      price_approx: newPrice ? parseFloat(newPrice) : undefined,
      whatsapp: newWhatsapp || undefined,
      instagram: newInstagram || undefined,
    });

    setNewName('');
    setNewCategory('');
    setNewCity('');
    setNewPrice('');
    setNewWhatsapp('');
    setNewInstagram('');
    setIsAddOpen(false);
  };

  const getCategoryLabel = (categoryId: string) => {
    return BUDGET_CATEGORIES.find(c => c.id === categoryId)?.label || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    return BUDGET_CATEGORIES.find(c => c.id === categoryId)?.color || 'bg-muted';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24">
        <PageHeader
          title="Proveedores"
          subtitle="Cargando..."
          icon={<Store className="w-5 h-5 text-primary" />}
        />
        <div className="px-4 py-6 space-y-6">
          <Skeleton className="h-10 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        title="Proveedores"
        subtitle={`${hiredCount} contratados`}
        icon={<Store className="w-5 h-5 text-primary" />}
        action={
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full bg-primary">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Nuevo Proveedor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Nombre</Label>
                  <Input 
                    placeholder="Nombre del proveedor"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Categoría</Label>
                  <Select value={newCategory} onValueChange={(v) => setNewCategory(v as BudgetCategory)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ciudad</Label>
                  <Select value={newCity} onValueChange={setNewCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOMBIAN_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Precio aproximado (COP)</Label>
                  <Input 
                    type="number" 
                    placeholder="$0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input 
                    placeholder="+57 300 123 4567"
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input 
                    placeholder="@usuario"
                    value={newInstagram}
                    onChange={(e) => setNewInstagram(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleAddProvider}
                  disabled={addProvider.isPending || !newName.trim() || !newCategory}
                >
                  {addProvider.isPending ? 'Guardando...' : 'Guardar Proveedor'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <div className="space-y-3">
          <Input
            placeholder="Buscar proveedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card"
          />
          
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="flex-1 bg-card">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {BUDGET_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger className="flex-1 bg-card">
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {COLOMBIAN_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Providers List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                layout
                className={cn(
                  "rounded-xl bg-card border p-4 shadow-soft",
                  provider.hired 
                    ? "border-secondary bg-secondary/5" 
                    : provider.contacted 
                      ? "border-primary/30" 
                      : "border-border/50"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {provider.name}
                      </h3>
                      {provider.hired && (
                        <Badge className="bg-secondary text-secondary-foreground text-xs">
                          Contratado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full text-card",
                        getCategoryColor(provider.category)
                      )}>
                        {getCategoryLabel(provider.category)}
                      </span>
                      {provider.city && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {provider.city}
                        </span>
                      )}
                    </div>
                  </div>
                  {provider.price_approx && (
                    <p className="font-display text-lg font-bold text-foreground whitespace-nowrap ml-2">
                      {formatCOP(provider.price_approx)}
                    </p>
                  )}
                </div>

                {/* Contact buttons */}
                <div className="flex items-center gap-2 mb-3">
                  {provider.whatsapp && (
                    <a
                      href={`https://wa.me/${provider.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  )}
                  {provider.instagram && (
                    <a
                      href={`https://instagram.com/${provider.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-600 text-xs font-medium hover:bg-pink-500/20 transition-colors"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      Instagram
                    </a>
                  )}
                </div>

                {/* Status buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleContacted(provider.id, provider.contacted)}
                    disabled={updateProvider.isPending}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                      provider.contacted
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {provider.contacted && <Check className="w-4 h-4" />}
                    Contactado
                  </button>
                  <button
                    onClick={() => handleToggleHired(provider.id, provider.hired)}
                    disabled={updateProvider.isPending}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                      provider.hired
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {provider.hired && <Check className="w-4 h-4" />}
                    Contratado
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProviders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Store className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {searchQuery || filterCategory !== 'all' || filterCity !== 'all'
                  ? 'No se encontraron proveedores'
                  : 'No hay proveedores. ¡Agrega tu primer proveedor!'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
