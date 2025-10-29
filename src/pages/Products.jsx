import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import productImage from "/Logo_femme.avif";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import api from "@/api/axios";
import { useLocation, useNavigate } from "react-router-dom";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceOrder, setPriceOrder] = useState(""); // 'croissant' or 'decroissant'
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const selectedGenre = location.state?.genre;
    if (selectedGenre) {
      const fetchProducts = async () => {
        await api.post("/produits", { genre: selectedGenre }).then((res) => {
          setProducts(res.data.data);
        });
      };
      fetchProducts();
    }
  }, [location.state]);

  // Function to handle dropdown change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.type_produit.nom.toLowerCase() ===
          selectedCategory.toLowerCase()
      )
    : products; // show all if no category selected

  // Sort products by price
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.prix);
    const priceB = parseFloat(b.prix);

    if (priceOrder === "croissant") return priceA - priceB;
    if (priceOrder === "decroissant") return priceB - priceA;
    return 0; // no sorting
  });

  return (
    <div className="flex flex-col border h-full min-h-screen pt-16 px-2 gap-4 overflow-hidden bg-neutral-50 ">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 pt-4">
        {/* Sidebar */}
        <aside className="border rounded-md py-4 px-2 bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Filtres</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-2xl" htmlFor="categories">
                Catégories
              </Label>
              <Select
                onValueChange={handleCategoryChange}
                id="categories"
                name="categories"
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="choisissez une catégorie" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="T-shirt basique">
                    T-shirt basique
                  </SelectItem>
                  <SelectItem value="T-shirt imprimé">
                    T-shirt imprimé
                  </SelectItem>
                  <SelectItem value="Polo">Polo</SelectItem>
                  <SelectItem value="T-shirt de sport">
                    T-shirt de sport
                  </SelectItem>
                  <SelectItem value="T-shirt de luxe">
                    T-shirt de luxe
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prix">Prix</Label>
              <Select
                id="prix"
                name="prix"
                onValueChange={(value) => setPriceOrder(value)}
              >
                <SelectTrigger className="w-[260px]">
                  <SelectValue placeholder="choisissez un order pour les prix" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="croissant">
                    <div className="flex gap-2">
                      <ArrowUpWideNarrow /> Croissant
                    </div>
                  </SelectItem>
                  <SelectItem value="decroissant">
                    <div className="flex gap-2">
                      <ArrowDownWideNarrow /> Decroissant
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <section className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto max-h-[calc(100vh-144px)]">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-md shadow-sm p-4 flex flex-col"
            >
              <img
                src={`http://localhost:8000/storage/${product.image}`}
                alt={product.name}
                className="w-full h-full object-contain rounded mb-3"
              />
              <h3 className="font-semibold text-gray-800">{product.nom}</h3>
              <p className="text-gray-600">{product.prix} €</p>
              <Button
                onClick={() => {
                  navigate("/products/" + product.id, {
                    state: { id: product.id },
                  });
                }}
                className="mt-auto"
              >
                Voir
              </Button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
