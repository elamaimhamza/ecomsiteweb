import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", mot_de_passe: "" });
  const { login, loading, loadingAdmin } = useAuth();
  const location = useLocation();
  const isFromCart = location.state?.fromCart || false;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Attempt login
      const data = await login(
        formData.email,
        formData.mot_de_passe,
        isFromCart
      );

      // 2. If we get here, login was successful
      toast.success("connexion avec success", {
        position: "top-center",
        dismissible: true,
        closeButton: true,
      });
      // navigate("/"); // Uncomment if needed

      console.log("LOGIN DATA", data);
    } catch (err) {
      // 3. If login throws, we land here immediately
      console.log("error status", err.response?.status);

      if (err.response && err.response.status === 401) {
        toast.error("Connexion echec", {
          description: err.response.data.message,
          position: "top-center",
          dismissible: true,
          closeButton: true,
        });
      } else {
        toast.error("Connexion echec", {
          description: "Une erreur est survenue", // Added generic description
          position: "top-center",
          dismissible: true,
          closeButton: true,
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 pt-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-2xl shadow-blue-300 w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl text-sky-800 font-extrabold text-center ">
          Bienvenue
        </h2>
        <p className="text-center text-slate-400">
          Connectez-vous à votre compte
        </p>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-800 transition"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            name="mot_de_passe"
            required
            value={formData.mot_de_passe}
            onChange={handleChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-800 transition"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-3 bg-sky-800  text-white cursor-pointer font-semibold rounded-lg transition"
        >
          Se connecter
        </Button>
      </form>
      {loading && (
        <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-black/20 z-50">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
