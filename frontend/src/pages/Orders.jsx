import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const orderStatus = ['pending', 'processing', 'completed', 'cancelled'];

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    userId: '',
    items: [{ productId: '', quantity: 1 }]
  });

  const loadOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Erro ao carregar pedidos', err);
    }
  };

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Erro ao carregar produtos', err);
    }
  };

  const loadUsers = async () => {
    if (user.role !== 'admin') return;
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error('Erro ao carregar usuários', err);
    }
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
    loadUsers();
  }, []);

  const handleItemChange = (index, field, value) => {
    setForm((prev) => {
      const updatedItems = prev.items.map((item, idx) => (idx === index ? { ...item, [field]: value } : item));
      return { ...prev, items: updatedItems };
    });
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { productId: '', quantity: 1 }] }));
  };

  const removeItem = (index) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== index) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        items: form.items
          .filter((item) => item.productId)
          .map((item) => ({ productId: item.productId, quantity: Number(item.quantity) }))
      };

      if (user.role === 'admin' && form.userId) {
        payload.userId = form.userId;
      }

      if (payload.items.length === 0) {
        setError('Adicione pelo menos um item válido');
        return;
      }

      await api.post('/orders', payload);
      setError(null);
      setForm({ userId: '', items: [{ productId: '', quantity: 1 }] });
      loadOrders();
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao criar pedido';
      setError(message);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      loadOrders();
    } catch (err) {
      console.error('Erro ao atualizar status', err);
    }
  };

  return (
    <div>
      <h1>Pedidos</h1>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Novo pedido</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {user.role === 'admin' && (
            <div className="form-group">
              <label htmlFor="userId">Cliente</label>
              <select id="userId" name="userId" value={form.userId} onChange={(event) => setForm((prev) => ({ ...prev, userId: event.target.value }))}>
                <option value="">Selecione um usuário</option>
                {users.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.items.map((item, index) => (
            <div key={index} className="card" style={{ marginBottom: '1rem', background: '#f8fafc' }}>
              <div className="form-group">
                <label>Produto</label>
                <select value={item.productId} onChange={(event) => handleItemChange(index, 'productId', event.target.value)}>
                  <option value="">Selecione</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - R$ {Number(product.price).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantidade</label>
                <input type="number" min="1" value={item.quantity} onChange={(event) => handleItemChange(index, 'quantity', event.target.value)} />
              </div>
              {form.items.length > 1 && (
                <button type="button" className="secondary-button" onClick={() => removeItem(index)}>
                  Remover item
                </button>
              )}
            </div>
          ))}

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={addItem}>
              Adicionar item
            </button>
            <button className="primary-button" type="submit">
              Criar pedido
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Lista de pedidos</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Itens</th>
              <th>Status</th>
              <th>Total</th>
              {user.role === 'admin' && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.name}</td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                    {order.items?.map((item) => (
                      <li key={item.id}>
                        {item.product?.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{order.status}</td>
                <td>R$ {Number(order.total).toFixed(2)}</td>
                {user.role === 'admin' && (
                  <td>
                    <select value={order.status} onChange={(event) => handleStatusChange(order.id, event.target.value)}>
                      {orderStatus.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
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
