import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <header className="navbar">
      <div className="navbar__brand">BusinessForward</div>
      <nav className="navbar__links">
        <Link to="/">Dashboard</Link>
        <Link to="/products">Produtos</Link>
        <Link to="/orders">Pedidos</Link>
        {user.role === 'admin' && <Link to="/users">Usuários</Link>}
      </nav>
      <div className="navbar__user">
        <span>{user.name}</span>
        <button onClick={handleLogout}>Sair</button>
      </div>
    </header>
  );
}
