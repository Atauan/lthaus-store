
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Users, Shield } from 'lucide-react';

const UserManagement = () => {
  const { user, getUsers, updateUserRole } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('salesperson');

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      toast.error('Acesso negado. Apenas administradores podem acessar esta página.');
      navigate('/');
      return;
    }

    // Fetch users
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await getUsers();
      if (error) {
        toast.error('Erro ao carregar usuários');
      } else if (data) {
        setUsers(data);
      }
      setLoading(false);
    };

    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user, getUsers, navigate]);

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    
    const { error } = await updateUserRole(selectedUser.id, selectedRole);
    
    if (!error) {
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === selectedUser.id ? { ...u, role: selectedRole } : u
        )
      );
      setDialogOpen(false);
    }
  };

  const openRoleDialog = (userProfile: UserProfile) => {
    setSelectedUser(userProfile);
    setSelectedRole(userProfile.role);
    setDialogOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const getRoleBadge = (role: UserRole) => {
    if (role === 'admin') {
      return <Badge className="bg-red-500">Administrador</Badge>;
    } else if (role === 'manager') {
      return <Badge className="bg-amber-500">Gerente</Badge>;
    } else {
      return <Badge className="bg-green-500">Vendedor</Badge>;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
              <p className="text-muted-foreground">
                Gerencie usuários e suas permissões no sistema
              </p>
            </div>
            
            <div className="flex items-center mt-4 md:mt-0 space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar usuários..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Convidar
              </Button>
            </div>
          </div>

          {/* Users list */}
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                <h2 className="text-lg font-semibold">Usuários do Sistema</h2>
              </div>
            </div>
            
            <div className="p-0">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <p>Carregando usuários...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Nenhum usuário encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((userProfile) => (
                        <TableRow key={userProfile.id}>
                          <TableCell>
                            <div className="font-medium">
                              {userProfile.first_name} {userProfile.last_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {/* Use session data to get email, since profile doesn't store it */}
                            {userProfile.id}
                          </TableCell>
                          <TableCell>
                            {getRoleBadge(userProfile.role)}
                          </TableCell>
                          <TableCell>
                            {userProfile.created_at ? new Date(userProfile.created_at).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openRoleDialog(userProfile)}
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Alterar Função
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          {/* Role change dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alterar Função do Usuário</DialogTitle>
                <DialogDescription>
                  Altere a função de {selectedUser?.first_name} {selectedUser?.last_name}.
                  Isso determinará quais permissões o usuário terá no sistema.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Selecione a função
                  </label>
                  <Select 
                    value={selectedRole} 
                    onValueChange={(value: UserRole) => setSelectedRole(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="salesperson">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Detalhes da função:</h4>
                  {selectedRole === 'admin' && (
                    <p className="text-sm text-muted-foreground">
                      Administradores têm controle total sobre o sistema, incluindo gerenciamento de usuários e todas as operações.
                    </p>
                  )}
                  {selectedRole === 'manager' && (
                    <p className="text-sm text-muted-foreground">
                      Gerentes podem gerenciar produtos, fornecedores e vendas, mas não podem gerenciar usuários.
                    </p>
                  )}
                  {selectedRole === 'salesperson' && (
                    <p className="text-sm text-muted-foreground">
                      Vendedores podem apenas registrar vendas e visualizar produtos.
                    </p>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleRoleChange}>
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserManagement;
