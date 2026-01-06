import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Shield,
  ArrowLeft,
  Search,
  UserCheck,
  UserX,
  MoreVertical,
  Mail,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUsers, useToggleUserActive } from '@/hooks/useAdmin';

export default function UsersList() {
  const { data: users, isLoading } = useUsers();
  const toggleUserActive = useToggleUserActive();
  const [searchTerm, setSearchTerm] = useState('');
  const [userToToggle, setUserToToggle] = useState<{
    userId: string;
    isActive: boolean;
    name: string;
  } | null>(null);

  const filteredUsers = users?.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUser = () => {
    if (userToToggle) {
      toggleUserActive.mutate({
        userId: userToToggle.userId,
        isActive: !userToToggle.isActive,
      });
      setUserToToggle(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/admin"
            className="inline-flex items-center text-slate-300 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al panel
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          </div>
          <p className="text-slate-300">Administra los accesos de la plataforma</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link to="/admin/usuarios/nuevo">
            <Button className="bg-gradient-romantic hover:opacity-90">
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Usuario
            </Button>
          </Link>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Usuarios ({filteredUsers?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : filteredUsers?.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'No se encontraron usuarios'
                    : 'No hay usuarios registrados'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers?.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user.is_active
                        ? 'bg-card'
                        : 'bg-muted/50 opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.role === 'admin'
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                            : 'bg-gradient-romantic'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <Shield className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white font-semibold">
                            {user.full_name?.[0]?.toUpperCase() ||
                              user.email[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {user.full_name || 'Sin nombre'}
                          </span>
                          {user.role === 'admin' && (
                            <Badge variant="secondary" className="text-xs">
                              Admin
                            </Badge>
                          )}
                          {!user.is_active && (
                            <Badge variant="destructive" className="text-xs">
                              Inactivo
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(user.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {user.role !== 'admin' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setUserToToggle({
                                userId: user.user_id,
                                isActive: user.is_active,
                                name: user.full_name || user.email,
                              })
                            }
                          >
                            {user.is_active ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activar
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!userToToggle}
        onOpenChange={() => setUserToToggle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToToggle?.isActive
                ? '¿Desactivar usuario?'
                : '¿Activar usuario?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToToggle?.isActive
                ? `El usuario "${userToToggle?.name}" no podrá acceder a la plataforma hasta que lo vuelvas a activar.`
                : `El usuario "${userToToggle?.name}" podrá acceder nuevamente a la plataforma.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleUser}
              className={
                userToToggle?.isActive
                  ? 'bg-destructive hover:bg-destructive/90'
                  : ''
              }
            >
              {userToToggle?.isActive ? 'Desactivar' : 'Activar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
