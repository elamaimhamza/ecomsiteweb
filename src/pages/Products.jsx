import { Button } from "@/components/ui/button";
import React from "react";
import productImage from "/Logo_femme.webp";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
export default function Products() {
  const products = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: `${(Math.random() * 100 + 10).toFixed(2)} €`,
    image: productImage, // Replace with real image URLs
  }));
  return (
    <div className="flex flex-col border bg-blue- min-h-screen pt-16 px-2 gap-4 max-h-screen overflow-hidden bg-neutral-50 ">
      <div className="flex justify-center gap-2 pt-4">
        <Button size="lg" className="rounded-sm border">
          Homme
        </Button>
        <Button size="lg" className="rounded-sm border">
          Femme
        </Button>
        <Button size="lg" className="rounded-sm border">
          Enfant
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
        {/* Sidebar */}
        <aside className="border rounded-md py-4 px-2 bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Filtres</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-2xl" htmlFor="categories" >Catégories</Label>
              <Select id="categories" name="categories">
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="choisissez une catégorie" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="basique">T-shirt basique</SelectItem>
                  <SelectItem value="imprime">T-shirt imprimé</SelectItem>
                  <SelectItem value="polo">Polo</SelectItem>
                  <SelectItem value="sport">T-shirt de sport</SelectItem>
                  <SelectItem value="luxe">T-shirt de luxe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prix">Prix</Label>
              <Select id="prix" name="prix">
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
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 overflow-auto max-h-[calc(100vh-144px)]">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-md shadow-sm p-4 flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain rounded mb-3"
              />
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600">{product.price}</p>
              <Button className="mt-auto">Voir</Button>
            </div>
          ))}
          <div
            key={"Image homme"}
            className="bg-white border rounded-md shadow-sm p-4 flex flex-col"
          >
            <img
              src={"/Logo_homme.jpg"}
              alt={"Image homme"}
              className="w-full h-full object-contain rounded mb-3"
            />
            <h3 className="font-semibold text-gray-800">T shirt homme</h3>
            <p className="text-gray-600">20 $</p>
            <Button className="mt-auto">Voir</Button>
          </div>
          <div
            key={"Image homme"}
            className="bg-white border rounded-md shadow-sm p-4 flex flex-col"
          >
            <img
              src={"/Logo_femme.webp"}
              alt={"Image homme"}
              className="w-full h-full object-contain rounded mb-3"
            />
            <h3 className="font-semibold text-gray-800">T shirt homme</h3>
            <p className="text-gray-600">20 $</p>
            <Button className="mt-auto">Voir</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
