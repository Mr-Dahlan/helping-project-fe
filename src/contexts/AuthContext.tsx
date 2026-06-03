// src/contexts/AuthContext.tsx

import { createContext, useEffect, useState } from "react";

import type { User, AuthResponse } from "../types/auth";

import * as authService from "../service/auth";

/*
|--------------------------------------------------------------------------
| CONTEXT TYPE
|--------------------------------------------------------------------------
*/
type AuthContextType = {
  user: User | null;

  loading: boolean;

  login: (email: string, password: string) => Promise<User>;

  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: string,
  ) => Promise<void>;

  logout: () => Promise<void>;
};

/*
|--------------------------------------------------------------------------
| CONTEXT
|--------------------------------------------------------------------------
*/
export const AuthContext = createContext<AuthContextType>({
  user: null,

  loading: true,

  login: async () => ({}) as User,

  register: async () => {},

  logout: async () => {},
});

/*
|--------------------------------------------------------------------------
| PROVIDER
|--------------------------------------------------------------------------
*/
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const [initialized, setInitialized] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | AUTO LOGIN / RESTORE SESSION
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (initialized) return;

    const init = async () => {
      const token = localStorage.getItem("token");

      console.log("RESTORE TOKEN:", token);

      /*
      |--------------------------------------------------------------------------
      | TOKEN TIDAK ADA
      |--------------------------------------------------------------------------
      */
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | GET USER LOGIN
      |--------------------------------------------------------------------------
      */
      try {
        const res = await authService.getMe();

        /*
        |--------------------------------------------------------------------------
        | SUPPORT:
        | res.data
        | atau langsung res
        |--------------------------------------------------------------------------
        */
        const userData: User = res?.data ?? res;

        console.log("RESTORE USER:", userData);

        setUser(userData);
      } catch (err) {
        console.error("RESTORE SESSION ERROR:", err);

        /*
        |--------------------------------------------------------------------------
        | TOKEN INVALID
        |--------------------------------------------------------------------------
        */
        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    init();
  }, [initialized]);

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */
  const login = async (email: string, password: string): Promise<User> => {
    const res: AuthResponse = await authService.login(email, password);

    console.log("LOGIN RESPONSE:", res);

    /*
  |--------------------------------------------------------------------------
  | RESPONSE:
  | {
  |   success,
  |   message,
  |   data: {
  |     user,
  |     token
  |   }
  | }
  |--------------------------------------------------------------------------
  */

    const token = res.data.token;

    const userFromLogin = res.data.user;

    console.log("TOKEN LOGIN:", token);

    console.log("USER LOGIN:", userFromLogin);

    /*
  |--------------------------------------------------------------------------
  | VALIDASI
  |--------------------------------------------------------------------------
  */
    if (!token || !userFromLogin) {
      throw new Error("Token atau user tidak ditemukan");
    }

    /*
  |--------------------------------------------------------------------------
  | SAVE TOKEN
  |--------------------------------------------------------------------------
  */
    localStorage.setItem("token", token);

    /*
  |--------------------------------------------------------------------------
  | SAVE USER
  |--------------------------------------------------------------------------
  */
    localStorage.setItem("user", JSON.stringify(userFromLogin));

    /*
  |--------------------------------------------------------------------------
  | SET STATE USER
  |--------------------------------------------------------------------------
  */
    setUser(userFromLogin);

    return userFromLogin;
  };

  /*
  |--------------------------------------------------------------------------
  | REGISTER
  |--------------------------------------------------------------------------
  */
  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: string,
  ) => {
    await authService.register(name, email, phone, password, role);

    /*
    |--------------------------------------------------------------------------
    | AUTO LOGIN SETELAH REGISTER
    |--------------------------------------------------------------------------
    */
    await login(email, password);
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("LOGOUT ERROR:", err);
    } finally {
      /*
      |--------------------------------------------------------------------------
      | CLEAR STORAGE
      |--------------------------------------------------------------------------
      */
      localStorage.removeItem("token");

      localStorage.removeItem("user");

      /*
      |--------------------------------------------------------------------------
      | CLEAR USER
      |--------------------------------------------------------------------------
      */
      setUser(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PROVIDER
  |--------------------------------------------------------------------------
  */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
