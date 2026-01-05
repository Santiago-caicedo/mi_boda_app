// Budget Categories with Spanish labels and icons
export const BUDGET_CATEGORIES = [
  { id: 'lugar_ceremonia', label: 'Lugar y Ceremonia', icon: 'Church', color: 'bg-wedding-pink', percentage: 15 },
  { id: 'banquete_bebida', label: 'Banquete y Bebida', icon: 'UtensilsCrossed', color: 'bg-wedding-peach', percentage: 25 },
  { id: 'vestido_traje', label: 'Vestido y Traje', icon: 'Shirt', color: 'bg-wedding-mint', percentage: 8 },
  { id: 'fotografia_video', label: 'Fotografía y Video', icon: 'Camera', color: 'bg-wedding-rose-gold', percentage: 10 },
  { id: 'decoracion_flores', label: 'Decoración y Flores', icon: 'Flower2', color: 'bg-wedding-pink', percentage: 8 },
  { id: 'musica_sonido', label: 'Música y Sonido', icon: 'Music', color: 'bg-wedding-mint', percentage: 6 },
  { id: 'invitaciones_detalles', label: 'Invitaciones y Detalles', icon: 'Mail', color: 'bg-wedding-peach', percentage: 3 },
  { id: 'belleza', label: 'Belleza', icon: 'Sparkles', color: 'bg-wedding-rose-gold', percentage: 3 },
  { id: 'argollas', label: 'Argollas', icon: 'Circle', color: 'bg-gold', percentage: 5 },
  { id: 'transporte', label: 'Transporte', icon: 'Car', color: 'bg-wedding-mint', percentage: 3 },
  { id: 'luna_miel', label: 'Luna de Miel', icon: 'Plane', color: 'bg-wedding-peach', percentage: 4 },
  { id: 'imprevistos', label: 'Imprevistos', icon: 'AlertCircle', color: 'bg-muted', percentage: 10 },
] as const;

export type BudgetCategoryId = typeof BUDGET_CATEGORIES[number]['id'];

// Colombian cities
export const COLOMBIAN_CITIES = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Santa Marta',
  'Pereira',
  'Manizales',
  'Ibagué',
  'Cúcuta',
  'Villavicencio',
  'Armenia',
  'Neiva',
  'Pasto',
] as const;

// Motivational phrases in Colombian Spanish
export const MOTIVATIONAL_PHRASES = [
  "¡Reina, tu boda va a ser espectacular! 💕",
  "Cada detalle cuenta, ¡y tú lo estás haciendo increíble!",
  "¡Qué chimba! Vas por buen camino con tu presupuesto 🌸",
  "El amor no tiene precio, pero la organización sí ayuda 💖",
  "¡Parcera, esto va quedando divino!",
  "Tu boda soñada está más cerca de lo que crees ✨",
  "¡Dale, que sí se puede! Una tarea menos, un paso más cerca 🎀",
  "El día más bonito de tu vida se está armando perfecto 💒",
  "¡Eres una verraca organizando todo esto!",
  "Amor + organización = boda perfecta 💕",
];

// Default tasks by months before wedding
export const DEFAULT_TASKS = [
  // 12 months before
  { title: 'Definir presupuesto total', description: 'Establece cuánto pueden invertir en la boda', monthsBefore: 12 },
  { title: 'Elegir fecha de la boda', description: 'Considera clima, disponibilidad de lugares y fechas especiales', monthsBefore: 12 },
  { title: 'Crear lista de invitados preliminar', description: 'Haz un primer borrador con todos los posibles invitados', monthsBefore: 12 },
  { title: 'Buscar y reservar lugar de ceremonia', description: 'Visita iglesias, jardines o lugares para la ceremonia', monthsBefore: 12 },
  { title: 'Buscar y reservar lugar de recepción', description: 'Investiga salones, fincas o restaurantes', monthsBefore: 12 },
  { title: 'Contratar wedding planner (opcional)', description: 'Si necesitas ayuda profesional, este es el momento', monthsBefore: 12 },
  
  // 10 months before
  { title: 'Buscar vestido de novia', description: 'Empieza a visitar tiendas y diseñadores', monthsBefore: 10 },
  { title: 'Contratar fotógrafo y videógrafo', description: 'Los buenos se reservan con anticipación', monthsBefore: 10 },
  { title: 'Reservar banda o DJ', description: 'Define el estilo musical de tu boda', monthsBefore: 10 },
  { title: 'Contratar servicio de catering', description: 'Programa degustaciones', monthsBefore: 10 },
  
  // 8 months before
  { title: 'Elegir tema y colores de la boda', description: 'Define la paleta de colores y decoración', monthsBefore: 8 },
  { title: 'Reservar florista', description: 'Discute arreglos, bouquet y decoración floral', monthsBefore: 8 },
  { title: 'Buscar traje del novio', description: 'Visita sastrerías o tiendas de trajes', monthsBefore: 8 },
  { title: 'Registrarse para lista de bodas', description: 'Elige tiendas o crea tu Vaki', monthsBefore: 8 },
  { title: 'Contratar transporte', description: 'Reserva carros para novios e invitados', monthsBefore: 8 },
  
  // 6 months before
  { title: 'Enviar Save the Dates', description: 'Notifica a tus invitados la fecha', monthsBefore: 6 },
  { title: 'Reservar luna de miel', description: 'Investiga destinos y paquetes', monthsBefore: 6 },
  { title: 'Comprar argollas de matrimonio', description: 'Visita joyerías y elige el diseño', monthsBefore: 6 },
  { title: 'Contratar decorador', description: 'Define la decoración del lugar', monthsBefore: 6 },
  { title: 'Agendar pruebas de maquillaje y peinado', description: 'Programa citas con estilistas', monthsBefore: 6 },
  
  // 4 months before
  { title: 'Diseñar e imprimir invitaciones', description: 'Trabaja con un diseñador', monthsBefore: 4 },
  { title: 'Confirmar todos los proveedores', description: 'Revisa contratos y depósitos', monthsBefore: 4 },
  { title: 'Planear despedida de soltera/o', description: 'Coordina con tus amigos', monthsBefore: 4 },
  { title: 'Reservar alojamiento para invitados', description: 'Si vienen de otras ciudades', monthsBefore: 4 },
  
  // 3 months before
  { title: 'Enviar invitaciones formales', description: 'Incluye información de la boda y RSVP', monthsBefore: 3 },
  { title: 'Primera prueba del vestido', description: 'Verifica ajustes necesarios', monthsBefore: 3 },
  { title: 'Comprar accesorios de novia', description: 'Velo, zapatos, joyería', monthsBefore: 3 },
  { title: 'Organizar ensayo de la boda', description: 'Coordina con el oficiante', monthsBefore: 3 },
  { title: 'Definir menú final', description: 'Confirma platos con el catering', monthsBefore: 3 },
  
  // 2 months before
  { title: 'Segunda prueba del vestido', description: 'Ajustes finales', monthsBefore: 2 },
  { title: 'Prueba del traje del novio', description: 'Últimos ajustes', monthsBefore: 2 },
  { title: 'Confirmar detalles con proveedores', description: 'Horarios, entregas, setup', monthsBefore: 2 },
  { title: 'Hacer seguimiento de RSVPs', description: 'Confirma asistencia', monthsBefore: 2 },
  { title: 'Planear distribución de mesas', description: 'Organiza dónde se sienta cada invitado', monthsBefore: 2 },
  
  // 1 month before
  { title: 'Prueba final de maquillaje y peinado', description: 'Confirma el look final', monthsBefore: 1 },
  { title: 'Recoger vestido de novia', description: 'Verifica que todo esté perfecto', monthsBefore: 1 },
  { title: 'Recoger traje del novio', description: 'Última revisión', monthsBefore: 1 },
  { title: 'Confirmar itinerario del día', description: 'Horario detallado de la boda', monthsBefore: 1 },
  { title: 'Preparar pagos finales', description: 'Organiza sobres y transferencias', monthsBefore: 1 },
  { title: 'Ensayo de la boda', description: 'Practica la ceremonia', monthsBefore: 1 },
  { title: 'Preparar maleta de luna de miel', description: 'Organiza equipaje y documentos', monthsBefore: 1 },
  
  // Week before
  { title: 'Confirmar todos los horarios', description: 'Llama a cada proveedor', monthsBefore: 0 },
  { title: 'Entregar distribución de mesas', description: 'Al coordinador del lugar', monthsBefore: 0 },
  { title: 'Preparar propinas y pagos', description: 'Sobres listos', monthsBefore: 0 },
  { title: 'Sesión de spa/relajación', description: '¡Te lo mereces!', monthsBefore: 0 },
  { title: 'Revisar checklist del día D', description: 'Todo debe estar listo', monthsBefore: 0 },
];

// Format currency to Colombian Pesos
export const formatCOP = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date to Colombian format
export const formatDateCO = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
};

// Format date long
export const formatDateLong = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
};

// Calculate days until wedding
export const getDaysUntilWedding = (weddingDate: Date | string): number => {
  const wedding = typeof weddingDate === 'string' ? new Date(weddingDate) : weddingDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  wedding.setHours(0, 0, 0, 0);
  const diffTime = wedding.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get random motivational phrase
export const getRandomPhrase = (): string => {
  return MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
};