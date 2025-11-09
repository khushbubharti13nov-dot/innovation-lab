import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import styles from './AdminLayout.module.scss';

const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.content}>
        {/* Admin pages (Dashboard, etc.) will render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;