import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import "./App.css";

import Dashboard from "./pages/DashboardPage";
import Transaction from "./pages/TransactionPage";
import History from "./pages/HistoryPage";
import Success from "./pages/SuccessPage";

import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";

import Navbar from "./components/Navbar";

import { useAuth } from "./hooks/useAuth";

import AdminDashboard from "./pages/AdminDashboard";
import AdminHistoryPage from "./pages/AdminHistoryPage";
import UserManagement from "./pages/UserManagement";
import CustomerDatabase from "./pages/CustomerDatabase";
import FinancialReports from "./pages/FinancialReports";

/*
|--------------------------------------------------------------------------
| USER LAYOUT
|--------------------------------------------------------------------------
*/
const UserLayout = ({
  setShowLogoutModal,
}: {
  setShowLogoutModal: (v: boolean) => void;
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Memuat...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 admin tidak boleh masuk route user
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
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

/*
|--------------------------------------------------------------------------
| ADMIN LAYOUT
|--------------------------------------------------------------------------
*/
const AdminLayout = ({
  setShowLogoutModal,
}: {
  setShowLogoutModal: (v: boolean) => void;
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Memuat...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 selain admin ditolak
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
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

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/
function App() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { logout } = useAuth();

  const handleConfirmLogout = async () => {
    await logout();

    setShowLogoutModal(false);

    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER ROUTES */}
        <Route
          element={
            <UserLayout
              setShowLogoutModal={setShowLogoutModal}
            />
          }
        >
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/transaksi"
            element={<Transaction />}
          />

          <Route
            path="/riwayat"
            element={<History />}
          />

          <Route
            path="/success"
            element={<Success />}
          />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminLayout
              setShowLogoutModal={setShowLogoutModal}
            />
          }
        >
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="riwayat"
            element={<AdminHistoryPage />}
          />

          <Route
            path="users"
            element={<UserManagement />}
          />

          <Route
            path="customers"
            element={<CustomerDatabase />}
          />

          <Route
            path="financial"
            element={<FinancialReports />}
          />
        </Route>

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              Apakah Anda Ingin Logout?
            </h3>

            <div className="modal-buttons">
              <button
                className="modal-btn no"
                onClick={() =>
                  setShowLogoutModal(false)
                }
              >
                NO
              </button>

              <button
                className="modal-btn yes"
                onClick={handleConfirmLogout}
              >
                YES
              </button>
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;