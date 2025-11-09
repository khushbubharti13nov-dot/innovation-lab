import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './AdminSidebar.module.scss';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear auth context
    navigate('/login'); // Redirect to login
  };

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>
        QuickCart
      </div>
      <ul className={styles.navList}>
        <li>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Manage Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/inventory"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Manage Inventory
          </NavLink>
        </li>
      </ul>
      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminSidebar;