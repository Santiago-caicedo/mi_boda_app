import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Shield, Heart, TrendingUp, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminStats } from '@/hooks/useAdmin';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Usuarios registrados',
    },
    {
      title: 'Usuarios Activos',
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      color: 'bg-green-500',
      description: 'Con acceso habilitado',
    },
    {
      title: 'Usuarios Inactivos',
      value: stats?.inactiveUsers || 0,
      icon: UserX,
      color: 'bg-red-500',
      description: 'Con acceso deshabilitado',
    },
    {
      title: 'Bodas Programadas',
      value: stats?.totalWeddings || 0,
      icon: Heart,
      color: 'bg-pink-500',
      description: 'Perfiles de boda creados',
    },
    {
      title: 'Nuevos Este Mes',
      value: stats?.usersThisMonth || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: 'Registros recientes',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
          </div>
          <p className="text-slate-300">Gestiona usuarios y accesos de la plataforma</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Acciones rápidas */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link to="/admin/usuarios/nuevo">
            <Button className="bg-gradient-romantic hover:opacity-90">
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Usuario
            </Button>
          </Link>
          <Link to="/admin/usuarios">
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Ver Usuarios
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {isLoading ? (
                      <div className="h-9 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones de Administrador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <UserPlus className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Crear Usuarios</h4>
                  <p className="text-sm text-muted-foreground">
                    Solo tú puedes crear nuevas cuentas. Los usuarios no pueden registrarse por su cuenta.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <UserX className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium">Desactivar Accesos</h4>
                  <p className="text-sm text-muted-foreground">
                    Puedes desactivar usuarios para bloquear su acceso sin eliminar sus datos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Control Total</h4>
                  <p className="text-sm text-muted-foreground">
                    Tienes visibilidad de todos los usuarios y estadísticas de la plataforma.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
