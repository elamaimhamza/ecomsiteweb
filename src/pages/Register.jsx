import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    code_postal: "",
    ville: "",
    email: "",
    mot_de_passe: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: send this data to your Laravel backend
    console.log("Register Data:", formData);
    await axios
      .post("http://127.0.0.1:8000/api/register", formData)
      .then((response) => {
        console.log("returned data :", response.data);
      })
      .catch((err) => console.log(err.response));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 pt-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-full max-w-xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Créer un compte</h2>
        <p className="text-sm font-semibold mb-2 text-red-400">
          Tout les champs sont obligatoires :
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Adresse</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Code postal</label>
            <input
              type="text"
              name="code_postal"
              value={formData.code_postal}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Ville</label>
            <input
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Courriel</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-4">
          S'inscrire
        </Button>
      </form>
    </div>
  );
}
