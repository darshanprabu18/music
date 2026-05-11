import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("aurora_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const persistSession = (payload) => {
    localStorage.setItem("aurora_token", payload.token);
    localStorage.setItem("aurora_user", JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const login = useCallback(async (form) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      persistSession(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (form) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      persistSession(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMe = useCallback(async () => {
    const { data } = await api.get("/auth/me");
    const fresh = {
      id: data._id,
      username: data.username,
      email: data.email,
      profileImage: data.profileImage,
      favorites: data.favorites
    };
    localStorage.setItem("aurora_user", JSON.stringify(fresh));
    setUser(fresh);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("aurora_token");
    localStorage.removeItem("aurora_user");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading, login, register, refreshMe, logout }),
    [user, loading, login, register, refreshMe, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
