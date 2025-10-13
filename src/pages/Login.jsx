import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", mot_de_passe: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sign In Data:", {
      email: formData.email,
      mot_de_passe: formData.mot_de_passe,
    });
    await login(formData.email, formData.mot_de_passe)
      .then(() => {
        toast.success("connexion avec success");
        navigate("/");
      })
      .catch((err) => {
        console.log("error status", err.response.status);
        if (err.response.status == 401) {
          toast.error("Connexion echec", {
            description: err.response.data.message,
          });
        } else {
          toast.error("Connexion echec");
        }
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 pt-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            name="mot_de_passe"
            required
            value={formData.mot_de_passe}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </div>
  );
}
