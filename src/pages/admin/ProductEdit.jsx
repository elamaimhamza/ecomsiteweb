import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, Loader2, Save, Users, Tags } from "lucide-react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Données et Types Mock (Traduites en Français) ---

// Structure de données initiale du produit
const initialProduct = {
  id: 90,
  nom: "T-shirt imprimé vert enfant 1",
  description:
    "T-shirt vert imprimé au motif naturel, léger et agréable à porter.",
  prix: "30.00",
  image: "https://i.postimg.cc/9Mq1gkZD/tshirt-de-imprime-vert-enfant.avif",
  marque: "FunStyle",
  stock: 66,
  genre_id: 3,
  type_produit_id: 2,
  created_at: "2025-11-24T17:21:15.000000Z",
  updated_at: "2025-12-04T13:53:12.000000Z",
  genre: {
    id: 3,
    nom: "Enfant",
    created_at: "2025-11-24T17:21:11.000000Z",
    updated_at: "2025-11-24T17:21:11.000000Z",
  },
  type_produit: {
    id: 2,
    nom: "T-shirt imprimé",
    created_at: "2025-11-24T17:21:12.000000Z",
    updated_at: "2025-11-24T17:21:12.000000Z",
  },
  referencement: null,
};

// --- API Simulation ---
// Simule une requête API asynchrone pour charger les options
const simulateApiFetch = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Input
const Input = ({ className = "", ...props }) => (
  <input
    className={`
      flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
      ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium
      placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50
      transition-colors
      ${className}
    `}
    {...props}
  />
);

// Select Component
const Selecté = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  className = "",
}) => (
  <div className="relative">
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className={`
        appearance-none flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
        ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50
        pr-8 transition-colors
        ${className}
      `}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
  </div>
);

// Loader Icon (for saving state)
const LoaderIcon = ({ className = "" }) => (
  <Loader2 className={`animate-spin h-4 w-4 ${className}`} />
);

// --- Composant ProductEdit (Logique Principale) ---
const ProductEdit = () => {
  const token = localStorage.getItem("jwt");
  // Simuler l'ID depuis un paramètre de route
  const { id } = useParams();

  // États pour les données du produit
  const [product, setProduct] = useState(initialProduct);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Nouveaux états pour les options des listes déroulantes (chargées par API)
  const [typesList, setTypesList] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);

  const fetchProductTypes = async () => {
    const res = await api.get("/admin/produits/types", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return res.data;
  };

  const fetchGenres = async () => {
    const res = await api.get("/admin/produits/genres", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return res.data;
  };

  const fetchProductData = async () => {
    const res = await api.get("/produits/" + id);

    return res.data;
  };

  // Chargement des options via API simulée au montage du composant
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [types, genders, productData] = await Promise.all([
          fetchProductTypes(),
          fetchGenres(),
          fetchProductData(),
        ]);
        setTypesList(types);
        setGenresList(genders);
        setProduct(productData);
      } catch (error) {
        console.error("Erreur lors du chargement des options:", error);
      } finally {
        setIsOptionsLoading(false);
      }
    };
    loadOptions();
  }, []); // Exécuter une seule fois au montage

  useEffect(() => {
    console.log("genresList", genresList);
  }, [genresList]);

  // Gestionnaire des changements d'entrée
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => {
      let finalValue = value;

      // 1. Handle Floats (Price) - Check for 'prix', not 'price'
      if (name === "prix") {
        finalValue = parseFloat(value) || 0;
      }

      // 2. Handle Integers (Stock & IDs)
      // Shadcn returns strings, so we must parse them back to integers
      else if (["stock", "genre_id", "type_produit_id"].includes(name)) {
        finalValue = parseInt(value, 10) || 0;
      }

      return {
        ...prevProduct,
        [name]: finalValue,
      };
    });

    setIsSaved(false);
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    console.log("Soumission des données produit mises à jour:", product);

    try {
      // Simuler un délai réseau de 1 seconde
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dataToSend = {
        nom: product?.nom || "",
        description: product?.description || "",
        prix: product?.prix,
        image: product?.image || "",
        marque: product?.marque || "",
        stock: product?.stock,
        genre_id: product?.genre_id,
        type_produit_id: product?.type_produit_id,
      };
      console.log("Produit mis à jour avec succès! Données:", dataToSend);
      setIsSaved(true);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Afficher un état de chargement si les options ne sont pas prêtes
  if (isOptionsLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 sm:p-10 bg-gray-50 min-h-screen flex items-center justify-center">
        <LoaderIcon className="w-8 h-8 text-indigo-600 mr-3" />
        <span className="text-lg font-medium text-gray-700">
          Chargement des options...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-10 border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-4 flex items-center">
          <Save className="h-6 w-6 mr-3 text-indigo-600" />
          Modifier le Produit (ID: {id})
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Champ Nom du Produit */}
            <div>
              <Label htmlFor="name">Nom du Produit</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={product?.nom}
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
                value={product?.prix}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            {/* Liste déroulante Type de Produit (Chargée par API) */}
            <div>
              <Label htmlFor="type_produit_id">Type de Produit</Label>
              <Select
                value={product?.type_produit_id}
                onValueChange={(value) => {
                  // Shadcn returns the value directly, so we manually create the update
                  // mimicking the event your handleChange likely expects
                  handleChange({ target: { name: "type_produit_id", value } });
                }}
              >
                <SelectTrigger id="type_produit_id">
                  <SelectValue placeholder="Sélectionner le type de produit" />
                </SelectTrigger>

                <SelectContent>
                  {typesList ? (
                    typesList.map((type_produit) => (
                      <SelectItem key={type_produit.id} value={type_produit.id}>
                        {type_produit.nom}
                      </SelectItem>
                    ))
                  ) : (
                    <></>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Liste déroulante Sexe (Nouveau champ, Chargé par API) */}
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Select
                value={product?.genre_id}
                onValueChange={(value) => {
                  // Shadcn returns the value directly, so we manually create the update
                  // mimicking the event your handleChange likely expects
                  handleChange({ target: { name: "genre_id", value } });
                }}
              >
                <SelectTrigger id="genre">
                  <SelectValue placeholder="Sélectionner le genre" />
                </SelectTrigger>

                <SelectContent>
                  {genresList ? (
                    genresList.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id}>
                        {genre.nom}
                      </SelectItem>
                    ))
                  ) : (
                    <></>
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
                value={product?.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {/* Champ URL de l'Image (Pleine largeur) */}
            <div className="">
              <Label htmlFor="image_url">URL de l'Image</Label>
              <Input
                type="url"
                id="image"
                name="image"
                value={product?.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Champ Description (Pleine largeur) */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={product?.description}
                onChange={handleChange}
                rows="4"
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Messages d'état */}
          {isSaved && (
            <div
              className="mt-6 p-3 text-sm font-medium text-green-800 bg-green-100 border border-green-200 rounded-lg flex items-center"
              role="alert"
            >
              <span className="mr-2">✅</span> Produit enregistré avec succès !
              (Enregistrement simulé)
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
                  <LoaderIcon className="mr-2 h-6 w-6" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les Modifications"
              )}
            </Button>
          </div>
        </form>

        {/* Aperçu de l'état actuel des données */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <Tags className="h-5 w-5 mr-2 text-gray-500" /> État Actuel du
            Produit
          </h3>
          <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto text-gray-800 border border-gray-200 shadow-inner">
            {JSON.stringify(product, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
