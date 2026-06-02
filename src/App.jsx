import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css'
import Dashboard from './features/dashboard/DashboardPage';
import AdminDashboard from './features/dashboard/AdminDashboard'; 
import Transaction from './features/transaction/TransactionPage';
import History from './features/history/HistoryPage';
import Success from './features/transaction/SuccessPage';
import Login from './features/auth/LoginPage';
import Navbar from './components/Navbar';

// IMPORT HALAMAN BARU ADMIN (Sesuaikan path jika perlu)
import FinancialReports from './features/admin/FinancialReports';
import ProductManagement from './features/admin/ProductManagement';
import UserManagement from './features/admin/UserManagement';
import CustomerDatabase from './features/admin/CustomerDatabase';

function App() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Authenticated layout including the Sidebar Navbar
  const ProtectedLayout = () => {
    const isLoggedIn = localStorage.getItem('cashier_logged_in') === 'true';

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="app-container">
        <Navbar onLogoutClick={() => setShowLogoutModal(true)} />
        <main className="main-content">
          <Outlet context={{ setShowLogoutModal }} />
        </main>
      </div>
    );
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('cashier_logged_in');
    localStorage.removeItem('cashier_name');
    localStorage.removeItem('cashier_outlet');
    localStorage.removeItem('user_role'); 
    setShowLogoutModal(false);
    window.location.href = '/login';
  };

  const HomeRoute = () => {
    const role = localStorage.getItem('user_role');
    return role === 'admin' ? <AdminDashboard /> : <Dashboard />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<HomeRoute />} /> 
            <Route path="/dashboard/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/transaksi" element={<Transaction />} />
            <Route path="/riwayat" element={<History />} />
            <Route path="/success" element={<Success />} />

            {/* RUTE TAMBAHAN UNTUK MENU-MENU ADMIN */}
            <Route path="/admin/financial-reports" element={<FinancialReports />} />
            <Route path="/admin/product-management" element={<ProductManagement />} />
            <Route path="/admin/user-management" element={<UserManagement />} />
            <Route path="/admin/customer-database" element={<CustomerDatabase />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Global Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Apakah Anda Ingin Logout?</h3>
            <div className="modal-buttons">
              <button className="modal-btn no" onClick={() => setShowLogoutModal(false)}>NO</button>
              <button className="modal-btn yes" onClick={handleConfirmLogout}>YES</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;