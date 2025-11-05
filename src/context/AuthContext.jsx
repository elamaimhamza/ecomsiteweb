import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage and verify token
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      console.log("TOKEN FOUND",token)
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const res = await api.post(
        "/verify",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.valid) {
        console.log("Valid Data from verify", res.data);
        const resData = res.data.data;
        const userData = {
          prenom: resData.prenom,
          nom: resData.nom,
          email: resData.email,
        };
        console.log("USERDATA", userData);
        setUser(userData); // assuming backend returns { valid: true, user: {...} }
      } else {
        logout();
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, mot_de_passe) => {
    try {
      const res = await api.post("/login", { email, mot_de_passe });
      const data = res.data;
      console.log("Loggeding", data);
      if (data.data.api_token) {
        const resData = data.data;
        const userData = {
          prenom: resData.prenom,
          nom: resData.nom,
          email: resData.email,
        };
        console.log("token", data.data);
        console.log("userData", userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("jwt", data.data.api_token);
        setUser(userData);
      }

      return data;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
