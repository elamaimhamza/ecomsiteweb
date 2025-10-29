import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/api/axios";

export default function ProductView() {
  // const { id } = useParams();
  const location = useLocation();
  const { id } = location.state || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/produits/${id}`)
      .then((res) => {
        console.log("Product data:", res.data);
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
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
    <div className="pt-16">
      <div className="flex p-2 absolute">
        <Button variant="outline" onClick={() => window.history.back()}>
          &larr; Retour aux produits
        </Button>
      </div>
      <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-2">
        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={`http://localhost:8000/storage/${product.image}`}
            alt={product.nom}
            className="w-full max-w-md rounded-2xl object-cover shadow-md"
          />
        </div>

        {/* Product Details */}
        <Card className="p-6">
          <CardContent className="space-y-4 pt-8">
            <div className="pt-6 pb-2">
              <h1 className="text-3xl font-bold">{product.nom}</h1>
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

            {/* <p className="text-sm text-gray-500">
              Stock :{" "}
              <span
                className={`${
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                } font-medium`}
              >
                {product.stock > 0
                  ? `${product.stock} disponibles`
                  : "Rupture de stock"}
              </span>
            </p> */}

            <Button
              disabled={product.stock === 0}
              className="mt-4 w-full md:w-auto"
            >
              Ajouter au panier
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
