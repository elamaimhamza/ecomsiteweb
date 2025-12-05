import React, { useState, useEffect } from "react";
import { PlusCircle, LoaderIcon, Tags } from "lucide-react";
// --- SHADCN UI COMPONENT IMPORTS ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function ProductCreate() {
  // OR if you are testing:
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  // --- STATE DEFINITIONS ---
  const [product, setProduct] = useState({
    nom: "",
    prix: 0.01,
    type_produit_id: "",
    genre_id: "",
    stock: 0,
    image: "",
    description: "",
  });

  // States for options and loading
  const [typesList, setTypesList] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);

  // States for form submission
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  // --- API FETCHING FUNCTIONS ---
  const fetchProductTypes = async () => {
    // Assuming 'api' is your imported axios instance
    const res = await api.get("/admin/produits/types", {
      headers: { Authorization: "Bearer " + token },
    });
    return res.data;
  };

  const fetchGenres = async () => {
    const res = await api.get("/admin/produits/genres", {
      headers: { Authorization: "Bearer " + token },
    });
    return res.data;
  };

  // --- EFFECT HOOK TO LOAD OPTIONS ---
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [types, genders] = await Promise.all([
          fetchProductTypes(),
          fetchGenres(),
        ]);
        setTypesList(types);
        setGenresList(genders);
      } catch (error) {
        console.error("Erreur lors du chargement des options:", error);
        setError("Impossible de charger les types ou les genres.");
      } finally {
        setIsOptionsLoading(false);
      }
    };
    loadOptions();
  }, []);

  // --- HANDLERS ---
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      // Convert numeric fields to actual numbers
      [name]: name === "prix" || name === "stock" ? Number(value) : value,
    }));
    setIsSaved(false);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setIsSaved(false);
    setError(null);

    try {
      // POST request to create the product
      await api
        .post("/admin/produits", product, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          navigate("/admin/produits");
          // Success Toast
          toast.success("Product created successfully!");
        })
        .catch((err) => {
          // Error Toast
          toast.error("Failed to create product. Please try again.");
        });

      // Reset form fields to initial empty state
      setProduct({
        nom: "",
        prix: 0.01,
        type_produit_id: "",
        genre_id: "",
        stock: 0,
        image: "",
        description: "",
      });
    } catch (err) {
      console.error("Erreur de création du produit:", err);
      setError(
        "Échec de la création du produit. Veuillez vérifier les données."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // --- COMPONENT RENDER ---
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-10 border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-4 flex items-center">
          <PlusCircle className="h-6 w-6 mr-3 text-indigo-600" />
          Créer un Nouveau Produit
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Champ Nom du Produit */}
            <div>
              <Label htmlFor="nom">Nom du Produit</Label>
              <Input
                type="text"
                id="nom"
                name="nom"
                value={product.nom}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ Prix */}
            <div>
              <Label htmlFor="prix">Prix</Label>
              <Input
                type="number"
                id="prix"
                name="prix"
                value={String(product.prix)}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            {/* Liste déroulante Type de Produit */}
            <div>
              <Label htmlFor="type_produit_id">Type de Produit</Label>
              <Select
                value={product.type_produit_id}
                onValueChange={(value) => {
                  handleChange({ target: { name: "type_produit_id", value } });
                }}
              >
                <SelectTrigger id="type_produit_id" disabled={isOptionsLoading}>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>

                <SelectContent>
                  {isOptionsLoading ? (
                    <>
                      {/* <SelectItem value="" disabled> */}
                      Chargement...
                      {/* </SelectItem> */}
                    </>
                  ) : typesList && typesList.length > 0 ? (
                    typesList.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.nom}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      {/* <SelectItem value="" disabled> */}
                      Aucun type disponible
                      {/* </SelectItem> */}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Liste déroulante Genre */}
            <div>
              <Label htmlFor="genre_id">Genre</Label>
              <Select
                value={product.genre_id}
                onValueChange={(value) => {
                  handleChange({ target: { name: "genre_id", value } });
                }}
              >
                <SelectTrigger id="genre_id" disabled={isOptionsLoading}>
                  <SelectValue placeholder="Sélectionner le genre" />
                </SelectTrigger>

                <SelectContent>
                  {isOptionsLoading ? (
                    <>
                      {/* // <SelectItem value="" disabled> */}
                      Chargement...
                      {/* // </SelectItem> */}
                    </>
                  ) : genresList && genresList.length > 0 ? (
                    genresList.map((genre) => (
                      <SelectItem key={genre.id} value={String(genre.id)}>
                        {genre.nom}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      {/* <SelectItem value="" disabled> */}
                      Aucun genre disponible
                      {/* </SelectItem> */}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Champ Quantité en Stock */}
            <div>
              <Label htmlFor="stock">Quantité en Stock</Label>
              <Input
                type="number"
                id="stock"
                name="stock"
                value={String(product.stock)}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {/* Champ URL de l'Image */}
            <div>
              <Label htmlFor="image">URL de l'Image</Label>
              <Input
                type="url"
                id="image"
                name="image"
                value={product.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Champ Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                rows="4"
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Messages d'état: SUCCESS */}
          {isSaved && (
            <div
              className="mt-6 p-3 text-sm font-medium text-green-800 bg-green-100 border border-green-200 rounded-lg flex items-center"
              role="alert"
            >
              <span className="mr-2">✅</span> Produit créé avec succès !
            </div>
          )}

          {/* Messages d'état: ERROR */}
          {error && (
            <div
              className="mt-6 p-3 text-sm font-medium text-red-800 bg-red-100 border border-red-200 rounded-lg flex items-center"
              role="alert"
            >
              <span className="mr-2">❌</span> {error}
            </div>
          )}
          {/* Bouton de Soumission */}
          <div className="mt-8">
            <Button
              type="submit"
              disabled={isSaving || isOptionsLoading}
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 "
            >
              {isSaving ? (
                <>
                  <LoaderIcon className="mr-2 h-6 w-6 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer le Produit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
