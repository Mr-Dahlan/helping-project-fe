import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css'
import Dashboard from './features/dashboard/DashboardPage';
import Transaction from './features/transaction/TransactionPage';
import History from './features/history/HistoryPage';
import Success from './features/transaction/SuccessPage';
import Login from './features/auth/LoginPage';
import Navbar from './components/Navbar';

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
    setShowLogoutModal(false);
    window.location.href = '/login';
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transaksi" element={<Transaction />} />
            <Route path="/riwayat" element={<History />} />
            <Route path="/success" element={<Success />} />
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