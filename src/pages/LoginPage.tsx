// src/pages/LoginPage.tsx

import { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const {
    login,
    user,
    loading: authLoading,
  } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | AUTO REDIRECT JIKA SUDAH LOGIN
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (authLoading) return;

    if (!user) return;

    /*
    |--------------------------------------------------------------------------
    | JIKA SUDAH DI HALAMAN ADMIN
    |--------------------------------------------------------------------------
    */
    if (
      user.role === "admin" &&
      location.pathname.startsWith("/admin")
    ) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | REDIRECT BERDASARKAN ROLE
    |--------------------------------------------------------------------------
    */
    if (user.role === "admin") {
      navigate("/admin/dashboard", {
        replace: true,
      });
    } else {
      navigate("/", {
        replace: true,
      });
    }
  }, [
    user,
    authLoading,
    navigate,
    location.pathname,
  ]);

  /*
  |--------------------------------------------------------------------------
  | LOGIN SUBMIT
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      const loggedInUser = await login(
        email,
        password
      );

      /*
      |--------------------------------------------------------------------------
      | REDIRECT BERDASARKAN ROLE
      |--------------------------------------------------------------------------
      */
      if (
        loggedInUser.role === "admin"
      ) {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/", {
          replace: true,
        });
      }
    } catch (err: any) {
      console.error(
        "LOGIN ERROR:",
        err
      );

      if (
        err.response?.data?.message
      ) {
        setError(
          err.response.data.message
        );
      } else {
        setError(
          "Tidak dapat terhubung ke server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING RESTORE SESSION
  |--------------------------------------------------------------------------
  */
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(to bottom right, #111827, #1f2937)",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Memuat sesi login...
      </div>
    );
  }

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
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.25)",
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
              <circle
                cx="12"
                cy="12"
                r="10"
              />

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
            Login untuk mengakses
            dashboard
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
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              required
              style={{
                width: "100%",
                padding:
                  "14px 16px",
                borderRadius: "14px",
                border:
                  "1px solid #d1d5db",
                outline: "none",
                fontSize: "15px",
                boxSizing:
                  "border-box",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "24px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
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
                placeholder="Masukkan password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                disabled={loading}
                required
                style={{
                  width: "100%",
                  padding:
                    "14px 50px 14px 16px",
                  borderRadius:
                    "14px",
                  border:
                    "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "15px",
                  boxSizing:
                    "border-box",
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
                  position:
                    "absolute",
                  right: "14px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  border: "none",
                  background:
                    "transparent",
                  cursor: "pointer",
                  color: "#6b7280",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

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
              ? "Menghubungkan..."
              : "Masuk"}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#6b7280",
              margin: 0,
            }}
          >
            Belum punya akun?{" "}
            <span
              onClick={() =>
                navigate("/register")
              }
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Daftar di sini
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;