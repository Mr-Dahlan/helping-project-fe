import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [role, setRole] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // VALIDASI PASSWORD
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  const isPasswordValid =
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasMinLength;

  const isPasswordMatch =
    password &&
    confirmPassword &&
    password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!isPasswordValid) {
      setError(
        "Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, serta angka."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Password dan konfirmasi password tidak cocok."
      );
      return;
    }

    setLoading(true);

    try {
      await register(
        name,
        email,
        phone,
        password,
        role
      );

      navigate("/");
    } catch (err: any) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const firstError = Object.values(
          err.response.data.errors
        )[0];

        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : String(firstError)
        );
      } else {
        setError("Tidak dapat terhubung ke server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(to bottom right, #111827, #1f2937)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 18px",
              borderRadius: "20px",
              background:
                "linear-gradient(to bottom right, #2563eb, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0" />
              <path d="M12 12h.01" />
              <rect
                width="6"
                height="4"
                x="9"
                y="4"
                rx="1"
              />
            </svg>
          </div>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Laundry POS
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Buat akun baru untuk mengakses sistem
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#dc2626",
              padding: "14px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* NAMA */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>
              Nama Lengkap
            </label>

            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={loading}
              required
              style={inputStyle}
            />
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Email</label>

            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              required
              style={inputStyle}
            />
          </div>

          {/* PHONE */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>
              Nomor HP
            </label>

            <input
              type="tel"
              placeholder="Contoh: 081234567890"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              disabled={loading}
              required
              style={inputStyle}
            />
          </div>

          {/* ROLE */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Role</label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              disabled={loading}
              required
              style={{
                ...inputStyle,
                background: "#ffffff",
                appearance: "none",
                cursor: "pointer",
                color: role
                  ? "#111827"
                  : "#9ca3af",
              }}
            >
              <option value="" disabled>
                Pilih role
              </option>

              <option value="owner">
                Owner
              </option>

              {/* <option value="admin">
                Admin
              </option> */}

              <option value="cashier">
                Kasir
              </option>
            </select>
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>
              Password
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                disabled={loading}
                required
                style={{
                  ...inputStyle,
                  paddingRight: "50px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* VALIDASI PASSWORD */}
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: hasUppercase
                    ? "#16a34a"
                    : "#dc2626",
                }}
              >
                {hasUppercase ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}

                Minimal 1 huruf besar
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: hasLowercase
                    ? "#16a34a"
                    : "#dc2626",
                }}
              >
                {hasLowercase ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}

                Minimal 1 huruf kecil
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: hasNumber
                    ? "#16a34a"
                    : "#dc2626",
                }}
              >
                {hasNumber ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}

                Minimal 1 angka
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: hasMinLength
                    ? "#16a34a"
                    : "#dc2626",
                }}
              >
                {hasMinLength ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}

                Minimal 8 karakter
              </div>
            </div>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>
              Konfirmasi Password
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                disabled={loading}
                required
                style={{
                  ...inputStyle,
                  paddingRight: "90px",
                }}
              />

              {/* STATUS MATCH */}
              {confirmPassword && (
                <div
                  style={{
                    position: "absolute",
                    right: "50px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    color: isPasswordMatch
                      ? "#16a34a"
                      : "#dc2626",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isPasswordMatch ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </div>
              )}

              {/* TOGGLE */}
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* MATCH TEXT */}
            {confirmPassword && (
              <p
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: isPasswordMatch
                    ? "#16a34a"
                    : "#dc2626",
                }}
              >
                {isPasswordMatch
                  ? "Password cocok"
                  : "Password tidak cocok"}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "14px",
              background: loading
                ? "#9ca3af"
                : "#2563eb",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              transition: "0.2s",
              marginBottom: "16px",
            }}
          >
            {loading
              ? "Mendaftarkan..."
              : "Daftar"}
          </button>

          {/* LINK LOGIN */}
          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#6b7280",
              margin: 0,
            }}
          >
            Sudah punya akun?{" "}
            <span
              onClick={() =>
                navigate("/login")
              }
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Masuk di sini
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;