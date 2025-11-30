import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

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
      setLoading(true);
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
        const admin = await verifyAdmin(data.data.api_token);
        if (admin) {
          navigate("/admin");
        } else {
          navigate("/admin");
        }
      }
      return data;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyAdmin = async (token) => {
    try {
      setLoadingAdmin(true);
      await api
        .get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.data);
          const admin = res.data.user.type_utilisateur === "Gestionnaire";
          console.log("IS ADMIN", admin);
          if (admin) {
            setIsAdmin(admin);
          }
          return admin;
        });
    } catch (error) {
      console.error("error while validating Admin");
    } finally {
      setLoadingAdmin(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        loadingAdmin,
        verifyToken,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
