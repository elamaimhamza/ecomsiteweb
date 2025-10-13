import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    adresse: "",
    code_postal: "",
    ville: "",
    // mot_de_passe: "",
    // mot_de_passe_confirmation: "",
  });

  const token = localStorage.getItem("jwt");

  // 🔹 Fetch user data
  useEffect(() => {
    console.log("Fetching user data with token:", token);
    if (!token) return;
    api
      .get(`/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        console.log("User data:", data.data.user);
        const userData = data.data.user;
        setForm(() => ({
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          adresse: userData.adresse,
          code_postal: userData.code_postal,
          ville: userData.ville,
        }));
      })
      .catch(() =>
        toast.error("Erreur", {
          description: "Impossible de charger le profil.",
        })
      )
      .finally(() => setLoading(false));
  }, [token]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log("Submitting form data:", form);
      await api.put(`/user`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profil mis à jour avec succès ✅");
    } catch (error) {
      const message =
        error.response?.data?.message || "Une erreur s'est produite ❌";
      toast.error("Erreur", { description: message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center min-h-screen pt-20 px-4">
      <Card className="w-full max-w-2xl shadow-lg border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Mon Profil
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Nom */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="nom"
                className="text-sm font-medium text-muted-foreground"
              >
                Nom
              </label>
              <Input
                id="nom"
                name="nom"
                value={form.nom || ""}
                onChange={handleChange}
                placeholder="Entrez votre nom"
              />
            </div>

            {/* Prénom */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="prenom"
                className="text-sm font-medium text-muted-foreground"
              >
                Prénom
              </label>
              <Input
                id="prenom"
                name="prenom"
                value={form.prenom || ""}
                onChange={handleChange}
                placeholder="Entrez votre prénom"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-muted-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                placeholder="exemple@email.com"
              />
            </div>

            {/* Adresse */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="adresse"
                className="text-sm font-medium text-muted-foreground"
              >
                Adresse
              </label>
              <Input
                id="adresse"
                name="adresse"
                value={form.adresse || ""}
                onChange={handleChange}
                placeholder="Votre adresse complète"
              />
            </div>

            {/* Ville */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="ville"
                className="text-sm font-medium text-muted-foreground"
              >
                Ville
              </label>
              <Input
                id="ville"
                name="ville"
                value={form.ville || ""}
                onChange={handleChange}
                placeholder="Votre ville"
              />
            </div>

            {/* Code postal */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="code_postal"
                className="text-sm font-medium text-muted-foreground"
              >
                Code postal
              </label>
              <Input
                id="code_postal"
                name="code_postal"
                value={form.code_postal || ""}
                onChange={handleChange}
                placeholder="Ex: 75000"
              />
            </div>

            {/* Submit */}
            <div></div>
            <div className=" flex justify-end items-center mt-6 gap-2">
              <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                Enregistrer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
