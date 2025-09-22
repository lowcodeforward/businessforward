import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: 0 });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Erro ao carregar produtos', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock: 0 });
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock)
        });
      } else {
        await api.post('/products', {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock)
        });
      }
      resetForm();
      loadProducts();
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao salvar produto';
      setError(message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja realmente remover este produto?')) {
      await api.delete(`/products/${id}`);
      loadProducts();
    }
  };

  return (
    <div>
      <h1>Produtos</h1>
      {user.role === 'admin' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>{editingId ? 'Editar produto' : 'Novo produto'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="price">Preço</label>
              <input id="price" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Estoque</label>
              <input id="stock" name="stock" type="number" value={form.stock} onChange={handleChange} min="0" />
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
      )}

      <div className="card">
        <h2>Lista de produtos</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Estoque</th>
              {user.role === 'admin' && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>R$ {Number(product.price).toFixed(2)}</td>
                <td>{product.stock}</td>
                {user.role === 'admin' && (
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="secondary-button" onClick={() => handleEdit(product)}>
                      Editar
                    </button>
                    <button className="primary-button" style={{ backgroundColor: '#dc2626' }} onClick={() => handleDelete(product.id)}>
                      Excluir
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
