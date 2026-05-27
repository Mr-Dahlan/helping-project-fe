// src/contexts/AuthContext.tsx
import { createContext, useEffect, useState } from "react";
import type { User } from "../types/auth";
import * as authService from "../service/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, phone: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({} as User),
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // 🔥 auto login — restore session jika token ada
  useEffect(() => {
    if (initialized) return;

    const init = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        const res = await authService.getMe();
        // /me return { data: User } atau langsung User
        const userData: User = res?.data ?? res;
        setUser(userData);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    init();
  }, [initialized]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await authService.login(email, password);

    // response: { success, message, data: { token, user } }
    const token = res.data.token;
    const userFromLogin = res.data.user;

    localStorage.setItem("token", token);
    setUser(userFromLogin);
    return userFromLogin;
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: string
  ) => {
    await authService.register(name, email, phone, password, role);
    await login(email, password);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // tetap logout lokal meski API gagal
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};