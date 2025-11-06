import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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

    await login(formData.email, formData.mot_de_passe)
      .then(() => {
        toast.success("connexion avec success", {
          position: "top-center",
          dismissible: true,
          closeButton: true,
        });
        navigate("/");
      })
      .catch((err) => {
        console.log("error status", err.response.status);
        if (err.response.status == 401) {
          toast.error("Connexion echec", {
            description: err.response.data.message,
            position: "top-center",
            dismissible: true,
            closeButton: true,
          });
        } else {
          toast.error("Connexion echec", {
            position: "top-center",
            dismissible: true,
            closeButton: true,
          });
        }
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 pt-16">
      <form
      //   onSubmit={handleSubmit}
      //   className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4"
      // >
      //   <h2 className="text-2xl font-bold text-center">Login</h2>

      //   <div>
      //     <label className="block text-sm font-medium">Email</label>
      //     <input
      //       type="email"
      //       name="email"
      //       required
      //       value={formData.email}
      //       onChange={handleChange}
      //       className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
      //     />
      //   </div>

      //   <div>
      //     <label className="block text-sm font-medium">Mot de passe</label>
      //     <input
      //       type="password"
      //       name="mot_de_passe"
      //       required
      //       value={formData.mot_de_passe}
      //       onChange={handleChange}
      //       className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
      //     />
      //   </div>

      //   <Button type="submit" className="w-full">
      //     Sign In
      //   </Button>
      onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-2xl shadow-blue-300 w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl text-sky-800 font-extrabold text-center ">
          Bienvenue
        </h2>
        <p className="text-center text-slate-400">Connectez-vous à votre compte</p>

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
          <label className="text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            name="mot_de_passe"
            required
            value={formData.mot_de_passe}
            onChange={handleChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-800 transition"
          />
        </div>

        <Button type="submit" className="w-full py-3 bg-sky-800  text-white cursor-pointer font-semibold rounded-lg transition">
          Se connecter
        </Button>
      </form>
    </div>
  );
}
