import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    products: 0,
    orders: 0,
    total: 0,
    users: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          api.get('/products'),
          api.get('/orders')
        ]);

        const total = ordersResponse.data.reduce((sum, order) => sum + Number(order.total), 0);

        let users = 0;
        if (user.role === 'admin') {
          const usersResponse = await api.get('/users');
          users = usersResponse.data.length;
        }

        setMetrics({
          products: productsResponse.data.length,
          orders: ordersResponse.data.length,
          total,
          users
        });
      } catch (error) {
        console.error('Erro ao carregar dashboard', error);
      }
    };

    loadData();
  }, [user.role]);

  return (
    <div className="dashboard">
      <h1>Bem-vindo, {user.name}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <h2>Produtos</h2>
          <p>{metrics.products}</p>
        </div>
        <div className="card">
          <h2>Pedidos</h2>
          <p>{metrics.orders}</p>
        </div>
        <div className="card">
          <h2>Faturamento</h2>
          <p>R$ {metrics.total.toFixed(2)}</p>
        </div>
        {user.role === 'admin' && (
          <div className="card">
            <h2>Usuários</h2>
            <p>{metrics.users}</p>
          </div>
        )}
      </div>
    </div>
  );
}
