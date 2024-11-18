import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, UserPlus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useError } from '../contexts/ErrorContext';
import { User as UserType } from '../types';
import { getAllUsers, updateUser, deleteUser } from '../services/users';

export function UserManagement() {
  const { user } = useAuth();
  const { showError } = useError();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadUsers();
  }, [user]);

  async function loadUsers() {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      showError(
        'Não foi possível carregar a lista de usuários.',
        error instanceof Error ? error.stack : String(error)
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateUser(updatedUser: UserType) {
    try {
      await updateUser(updatedUser);
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setEditingUser(null);
    } catch (error) {
      showError(
        'Erro ao atualizar o usuário.',
        error instanceof Error ? error.stack : String(error)
      );
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      showError(
        'Erro ao excluir o usuário.',
        error instanceof Error ? error.stack : String(error)
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itau-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-itau-gray-800">
          Gestão de Usuários
        </h1>
        <button
          onClick={() => navigate('/admin/users/new')}
          className="flex items-center gap-2 px-4 py-2 bg-itau-orange text-white rounded-md hover:bg-itau-blue transition-colors duration-200"
        >
          <UserPlus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-itau-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-itau-gray-700">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-itau-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-itau-gray-700">
                Função
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-itau-gray-700">
                Último Acesso
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-itau-gray-700">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-itau-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-itau-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-itau-gray-400" />
                    <span className="text-itau-gray-700">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-itau-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm ${
                    user.role === 'admin'
                      ? 'bg-itau-orange text-white'
                      : user.role === 'member'
                      ? 'bg-itau-blue text-white'
                      : 'bg-itau-gray-100 text-itau-gray-700'
                  }`}>
                    <Shield className="w-4 h-4" />
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-itau-gray-700">
                  {user.lastLogin?.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-1 text-itau-gray-400 hover:text-itau-orange transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1 text-itau-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}