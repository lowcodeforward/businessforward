import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = { name: '', email: '', role: 'user', password: '' };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error('Erro ao carregar usuários', err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        const payload = { ...form };
        if (!payload.password) {
          delete payload.password;
        }
        await api.put(`/users/${editingId}`, payload);
      } else {
        await api.post('/users', form);
      }
      resetForm();
      loadUsers();
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao salvar usuário';
      setError(message);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role, password: '' });
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja realmente remover este usuário?')) {
      await api.delete(`/users/${id}`);
      loadUsers();
    }
  };

  return (
    <div>
      <h1>Usuários</h1>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>{editingId ? 'Editar usuário' : 'Novo usuário'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="role">Perfil</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha {editingId ? '(opcional)' : ''}</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required={!editingId}
            />
          </div>
          <div className="form-actions">
            <button className="primary-button" type="submit">
              {editingId ? 'Atualizar' : 'Adicionar'}
            </button>
            {editingId && (
              <button type="button" className="secondary-button" onClick={resetForm}>
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Lista de usuários</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="secondary-button" onClick={() => handleEdit(user)}>
                    Editar
                  </button>
                  <button className="primary-button" style={{ backgroundColor: '#dc2626' }} onClick={() => handleDelete(user.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
