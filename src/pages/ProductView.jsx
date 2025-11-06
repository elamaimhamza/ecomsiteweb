import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/api/axios";
import { toast } from "sonner";
import { SquarePen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProductView() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const { id } = location.state || useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = () => {
    const productData = {
      id: product.id,
      nom: product.nom,
      prix: product.prix,
      quantity: 1,
    };

    const panier = localStorage.getItem("panier");

    if (panier && panier.length !== 0) {
      let panierData = JSON.parse(panier);
      const productExists = panierData.some((p) => p.id === productData.id);

      if (productExists) {
        panierData = panierData.map((p) =>
          p.id === productData.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        panierData.push(productData);
      }

      localStorage.setItem("panier", JSON.stringify(panierData));
    } else {
      localStorage.setItem("panier", JSON.stringify([productData]));
    }

    // ✅ Afficher le message temporaire
    toast.success("Produit ajouté avec succès");
  };

  useEffect(() => {
    api
      .get(`/produits/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setLoading(false);
      });
    // verifyAdmin();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto pt-16 p-6 grid md:grid-cols-2 gap-10">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    );
  }

  if (!product)
    return <div className="text-center mt-10">Produit introuvable.</div>;

  return (
    <div className="pt-16 relative">
      {/* ✅ Message de succès (toast simple) */}
      {/* {showMessage && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out z-[9999] text-center">
          ✅ Produit ajouté avec succès !
        </div>
      )} */}

      <div className="flex p-2 absolute">
        <Button variant="outline" onClick={() => window.history.back()}>
          &larr; Retour aux produits
        </Button>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-2">
        {/* Image produit */}
        <div className="flex justify-center">
          <img
            src={`http://localhost:8000/storage/${product.image}`}
            alt={product.nom}
            className="w-full max-w-md rounded-2xl object-cover shadow-md"
          />
        </div>

        {/* Détails produit */}
        <Card className="p-6">
          <CardContent className="space-y-4 pt-8">
            <div className="pt-6 pb-2">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{product.nom}</h1>
                {isAdmin && (
                  <span>
                    <SquarePen />
                  </span>
                )}
              </div>
              <p className="text-gray-500 mt-1">{product.marque}</p>
            </div>

            <div className="flex items-center gap-2 ">
              <Badge variant="secondary">
                {product.genre?.nom || "Genre inconnu"}
              </Badge>
              <Badge variant="outline">
                {product.type_produit?.nom || "Type inconnu"}
              </Badge>
            </div>

            <p className="py-4 text-xl font-semibold text-green-600">
              {product.prix} €
            </p>

            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>

            <Button
              disabled={product.stock === 0}
              className="mt-4 w-full md:w-auto"
              onClick={handleAddToCart}
            >
              Ajouter au panier
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
