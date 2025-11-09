import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';

// --- Import Page Components ---
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';

// --- Import Layouts & Route Protection ---
import ProtectedRoute from './ProtectedRoute'; // <-- IMPORT
import AdminLayout from '../components/layout/AdminLayout/AdminLayout'; // <-- IMPORT

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import ManageOrders from '../pages/admin/ManageOrders';
import ManageInventory from '../pages/admin/ManageInventory';
// Other pages...
import OrderHistory from '../pages/protected/OrderHistory';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Main public layout (has no sidebar)
    children: [
      // --- Public Routes ---
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      // ...other public routes like /register, /cart
    ],
  },
  {
    // --- Protected Admin Routes ---
    path: '/admin',
    element: (
      // 1. Check if user is logged in
      <ProtectedRoute>
        {/* 2. If logged in, show the Admin Layout (Sidebar + Content Area) */}
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // 3. These pages will render inside the AdminLayout's <Outlet />
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'orders', element: <ManageOrders /> },
      { path: 'inventory', element: <ManageInventory /> },
    ],
  },
  {
    // --- Protected Customer Routes ---
    path: '/my-account',
    element: (
      <ProtectedRoute>
        {/* We can create a simple <UserLayout> or just use the <App> layout */}
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="orders" replace /> },
      { path: 'orders', element: <OrderHistory /> },
      // { path: 'profile', element: <Profile /> },
    ],
  },
]);

export default router;