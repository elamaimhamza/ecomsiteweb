import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("jwt");

  // Load user from localStorage and verify token
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifyAdmin(token);
    } else {
      setIsAdmin(false);
    }
  }, [token]);

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
        const resData = res.data.data;
        const userData = {
          prenom: resData.prenom,
          nom: resData.nom,
          email: resData.email,
        };
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
      if (data.data.api_token) {
        const resData = data.data;
        const userData = {
          prenom: resData.prenom,
          nom: resData.nom,
          email: resData.email,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("jwt", data.data.api_token);
        setUser(userData);
        verifyAdmin(data.data.api_token);
      }

      return data;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const verifyAdmin = async (token) => {
    await api
      .get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.user.type_utilisateur == "Gestionnaire") {
          setIsAdmin(true);
        }
      });
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, verifyToken, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
