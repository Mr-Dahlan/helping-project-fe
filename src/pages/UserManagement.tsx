// src/features/admin/UserManagement.tsx

import { useState } from "react";
import { useUsers } from "../hooks/useUser";
import type { User, CreateUserPayload } from "../types/User";

const getRoleBadgeStyle = (role: User["role"]) => {
  if (role === "admin") {
    return { background: "#dbeafe", color: "#2563eb" };
  }
  if (role === "owner") {
    return { background: "#fef9c3", color: "#ca8a04" };
  }
  return { background: "#f3f4f6", color: "#4b5563" };
};

const getAvatarStyle = (role: User["role"]) => {
  if (role === "admin") {
    return { backgroundColor: "#dbeafe", color: "#2563eb" };
  }
  if (role === "owner") {
    return { backgroundColor: "#fef9c3", color: "#ca8a04" };
  }
  return { backgroundColor: "#ede9fe", color: "#8b5cf6" };
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "US";

const UserManagement = () => {
  const { users, loading, error, addUser, removeUser, totalByRole } = useUsers();

  const [roleFilter, setRoleFilter] = useState("Semua Role");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<User["role"]>("cashier");

  /*
  |--------------------------------------------------------------------------
  | HANDLERS
  |--------------------------------------------------------------------------
  */
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) return;

    setSubmitError("");
    setSubmitting(true);

    try {
      const payload: CreateUserPayload = {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      };
      await addUser(payload);
      // Reset form
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("cashier");
      setShowAddModal(false);
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.message || "Gagal menambah karyawan."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Hapus karyawan "${user.name}"?`)) return;
    await removeUser(user.id);
  };

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */
  const filteredUsers = users.filter((u) => {
    const matchesRole =
      roleFilter === "Semua Role" ||
      (roleFilter === "Administrator" && u.role === "admin") ||
      (roleFilter === "Kasir" && u.role === "cashier") ||
      (roleFilter === "Owner" && u.role === "owner");

    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */
  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Manajemen Karyawan / User</h1>
          <p>Kelola data karyawan dan hak akses sistem.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "24px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="16" x2="22" y1="11" y2="11" />
          </svg>
          Tambah Karyawan
        </button>
      </div>

      {/* Metrics */}
      <div
        className="metrics-grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}
      >
        <div
          className="metric-card"
          style={{ background: "#2563eb", color: "#ffffff", borderColor: "#2563eb", padding: "16px 20px" }}
        >
          <div className="metric-info">
            <span className="metric-label" style={{ color: "#93c5fd", fontSize: "11px", letterSpacing: "0.5px" }}>
              TOTAL ADMINISTRATOR
            </span>
            <span className="metric-value" style={{ color: "#ffffff", fontSize: "28px", fontWeight: "700" }}>
              {totalByRole.admin} Admin
            </span>
          </div>
          <div className="metric-icon" style={{ background: "rgba(255,255,255,0.1)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        <div className="metric-card orange" style={{ padding: "16px 20px" }}>
          <div className="metric-info">
            <span className="metric-label" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
              TOTAL KASIR
            </span>
            <span className="metric-value" style={{ fontSize: "28px", fontWeight: "700" }}>
              {totalByRole.cashier} Kasir
            </span>
          </div>
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
        </div>

        <div className="metric-card green" style={{ padding: "16px 20px" }}>
          <div className="metric-info">
            <span className="metric-label" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
              TOTAL OWNER
            </span>
            <span className="metric-value" style={{ fontSize: "28px", fontWeight: "700" }}>
              {totalByRole.owner} Owner
            </span>
          </div>
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Error global dari hook */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div className="table-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="table-title" style={{ fontSize: "16px", fontWeight: "600" }}>
              Daftar Karyawan
            </span>
            <span
              style={{
                background: "#f1f5f9",
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text-muted)",
              }}
            >
              {filteredUsers.length} Total
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="search-bar-container" style={{ width: "220px", margin: 0 }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  fontSize: "13px",
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Cari nama karyawan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                style={{ padding: "8px 12px 8px 34px", fontSize: "13px", borderRadius: "18px" }}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: "18px",
                border: "1px solid var(--border-color)",
                fontSize: "13px",
                outline: "none",
                cursor: "pointer",
                backgroundColor: "#ffffff",
                fontWeight: "500",
              }}
            >
              <option value="Semua Role">Semua Role</option>
              <option value="Administrator">Administrator</option>
              <option value="Kasir">Kasir</option>
              <option value="Owner">Owner</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
            Memuat data karyawan...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
            {searchQuery ? "Tidak ada karyawan yang cocok." : "Belum ada data karyawan."}
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>NAMA KARYAWAN</th>
                  <th>ALAMAT EMAIL</th>
                  <th>ROLE SISTEM</th>
                  <th style={{ textAlign: "center" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "600",
                            fontSize: "13px",
                            flexShrink: 0,
                            ...getAvatarStyle(u.role),
                          }}
                        >
                          {getInitials(u.name)}
                        </div>
                        <span style={{ fontWeight: "600", fontSize: "14px" }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "#6b7280" }}>{u.email}</td>
                    <td>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontWeight: "700",
                          letterSpacing: "0.3px",
                          textTransform: "uppercase",
                          ...getRoleBadgeStyle(u.role),
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => handleDeleteUser(u)}
                        style={{
                          padding: "4px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                        }}
                        title="Hapus karyawan"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{ maxWidth: "400px", textAlign: "left", borderRadius: "20px", padding: "24px" }}
          >
            <h3 className="modal-title" style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "700" }}>
              Tambah Karyawan Baru
            </h3>

            {submitError && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  marginBottom: "14px",
                  fontSize: "13px",
                }}
              >
                {submitError}
              </div>
            )}

            <form onSubmit={handleAddUser}>
              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600" }}>
                  Nama
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="form-input"
                  required
                  placeholder="Masukkan nama lengkap"
                  disabled={submitting}
                  style={{ background: "#ffffff", border: "1px solid #d1d5db" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="form-input"
                  required
                  placeholder="Masukkan alamat email"
                  disabled={submitting}
                  style={{ background: "#ffffff", border: "1px solid #d1d5db" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  required
                  placeholder="Masukkan password"
                  disabled={submitting}
                  style={{ background: "#ffffff", border: "1px solid #d1d5db" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600" }}>
                  Role Sistem
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as User["role"])}
                  className="form-input"
                  disabled={submitting}
                  style={{ background: "#ffffff", border: "1px solid #d1d5db" }}
                >
                  <option value="cashier">Kasir</option>
                  <option value="admin">Administrator</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <div className="modal-buttons" style={{ justifyContent: "flex-end", gap: "8px", display: "flex" }}>
                <button
                  type="button"
                  className="modal-btn no"
                  onClick={() => {
                    setShowAddModal(false);
                    setSubmitError("");
                  }}
                  disabled={submitting}
                  style={{ width: "auto", padding: "10px 20px", borderRadius: "20px", border: "none", cursor: "pointer" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="modal-btn yes"
                  disabled={submitting}
                  style={{
                    width: "auto",
                    padding: "10px 20px",
                    background: submitting ? "#9ca3af" : "#2563eb",
                    color: "#fff",
                    borderRadius: "20px",
                    border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;