import api from "@/api/axios";
import {
  Loader2,
  Truck,
  MapPin,
  Trash2,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DELIVERY_OPTIONS = [
  {
    id: "bpost_home",
    title: "Bpost Domicile",
    detail: "2-3 jours",
    price: 6.95,
  },
  {
    id: "mondial_relay",
    title: "Point Relais",
    detail: "Mondial Relay",
    price: 4.5,
  },
  {
    id: "express",
    title: "Express BE",
    detail: "Lendemain (si <15h)",
    price: 12.95,
  },
];

export default function CartConfirmation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Global loading for payment
  const [dataLoading, setDataLoading] = useState(true); // Initial data fetch
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0]);

  // NEW: Track which items are currently updating (prevent double clicks)
  const [updatingItems, setUpdatingItems] = useState(new Set());

  // Helper to toggle loading state for a specific ID
  const setItemLoading = (id, isLoading) => {
    setUpdatingItems((prev) => {
      const newSet = new Set(prev);
      if (isLoading) newSet.add(id);
      else newSet.delete(id);
      return newSet;
    });
  };

  // --- 1. CORE LOGIC: Fetch & Calculate Cart ---
  const refreshCart = async () => {
    const panier = localStorage.getItem("panier");

    // Check if empty
    if (!panier || JSON.parse(panier).length === 0) {
      setCartItems([]);
      setSubtotal(0);
      setDataLoading(false);
      // Optional: Redirect if empty
      // navigate("/products");
      return;
    }

    let panierData = JSON.parse(panier);
    const produitsIds = panierData.map((p) => p.id);

    try {
      // Get fresh prices from DB
      const res = await api.post("/produits/list", { produitsIds });
      const newProduits = res.data.produits;

      // Merge DB data with LocalStorage Quantity
      const updatedItems = panierData
        .map((p) => {
          const productInfo = newProduits.find((newP) => newP.id == p.id);
          if (!productInfo) return null; // Handle case where product might be deleted from DB

          return {
            ...p,
            nom: productInfo.nom,
            prix: productInfo.prix,
            image: productInfo.image, // Ensure backend sends this
            itemTotal: productInfo.prix * p.quantity,
          };
        })
        .filter(Boolean); // Remove nulls

      setCartItems(updatedItems);

      // Calculate Subtotal
      const calcSubtotal = updatedItems.reduce(
        (acc, curr) => acc + curr.itemTotal,
        0
      );
      setSubtotal(calcSubtotal);
    } catch (error) {
      console.error("Error refreshing cart", error);
      toast.error("Erreur de synchronisation du panier");
    } finally {
      setDataLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    refreshCart();
  }, []);

  // --- 2. YOUR CART FUNCTIONS (Integrated) ---

  const addQuantity = async (id) => {
    // 1. Start loading for this ID
    setItemLoading(id, true);
    try {
      const panier = localStorage.getItem("panier");
      if (!panier) return;

      let panierData = JSON.parse(panier);
      panierData = panierData.map((prod) => {
        if (prod.id === id) {
          return { ...prod, quantity: prod.quantity + 1 };
        }
        return prod;
      });

      localStorage.setItem("panier", JSON.stringify(panierData));

      // 2. Await the refresh (API call)
      await refreshCart();
    } finally {
      // 3. Stop loading regardless of success/fail
      setItemLoading(id, false);
    }
  };

  const substractQuantity = async (id) => {
    setItemLoading(id, true);
    try {
      const panier = localStorage.getItem("panier");
      if (!panier) return;

      let panierData = JSON.parse(panier);
      panierData = panierData.map((prod) => {
        if (prod.id === id) {
          return { ...prod, quantity: Math.max(1, prod.quantity - 1) };
        }
        return prod;
      });

      localStorage.setItem("panier", JSON.stringify(panierData));
      await refreshCart();
    } finally {
      setItemLoading(id, false);
    }
  };

  const deleteProduct = async (id) => {
    setItemLoading(id, true);
    try {
      const panier = localStorage.getItem("panier");
      if (!panier) return;

      let panierData = JSON.parse(panier);
      panierData = panierData.filter((prod) => prod.id !== id);

      localStorage.setItem("panier", JSON.stringify(panierData));
      await refreshCart();
      toast.warning("Produit supprimé du panier");
    } finally {
      setItemLoading(id, false);
    }
  };

  // --- 3. PAYMENT HANDLER ---
  const handleConfirm = async () => {
    if (cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/payment");
    }, 1500);
  };

  const finalTotal = subtotal + selectedDelivery.price;

  if (dataLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- LEFT COLUMN: ITEMS --- */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Articles ({cartItems.length})
                </h2>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                  Votre panier est vide.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 ">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 flex flex-col sm:flex-row gap-6 transition-colors hover:bg-gray-50/50 group"
                    >
                      {/* Image Placeholder */}
                      <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center text-gray-400">
                        <img
                          src={item.image}
                          className="w-full h-full object-contain cursor-pointer"
                          onClick={() => {
                            navigate("/products/" + item.id);
                          }}
                        />
                      </div>

                      {/* Info & Controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              className="text-lg font-medium text-gray-900 cursor-pointer group-hover:underline"
                              onClick={() => {
                                navigate("/products/" + item.id);
                              }}
                            >
                              {item.nom}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Ref: {item.id}
                            </p>
                          </div>
                          <p className="font-bold text-gray-900 text-lg">
                            {item.itemTotal.toFixed(2)} €
                          </p>
                        </div>

                        {/* QUANTITY CONTROLS */}
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border border-gray-300 rounded-md bg-white">
                            <button
                              onClick={() => substractQuantity(item.id)}
                              disabled={
                                item.quantity <= 1 || updatingItems.has(item.id)
                              }
                              className="p-2 hover:bg-gray-100 rounded-md text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus size={16} />
                            </button>
                            {/* QUANTITY DISPLAY / LOADER */}
                            <span className="w-10 text-center font-medium text-gray-900 flex justify-center">
                              {updatingItems.has(item.id) ? (
                                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              onClick={() => addQuantity(item.id)}
                              disabled={updatingItems.has(item.id)}
                              className="p-2 hover:bg-gray-100 rounded-md text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => deleteProduct(item.id)}
                            disabled={updatingItems.has(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors text-sm flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center text-gray-500 text-sm opacity-80">
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>Paiement Sécurisé</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Truck className="w-5 h-5" />
                <span>Livraison Rapide</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Suivi Belgique</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: SUMMARY --- */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Résumé</h2>

              {/* Subtotal */}
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Delivery Selection */}
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Livraison
              </h3>
              <div className="space-y-3 mb-6">
                {DELIVERY_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedDelivery(option)}
                    className={`cursor-pointer border rounded-lg p-3 flex justify-between items-center transition-all ${
                      selectedDelivery.id === option.id
                        ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-900">
                        {option.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {option.detail}
                      </span>
                    </div>
                    <span className="font-medium text-sm">
                      {option.price} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Final Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">
                  Total TTC
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {finalTotal.toFixed(2)} €
                </span>
              </div>

              <button
                onClick={handleConfirm}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-neutral-900 text-white font-bold py-4 rounded-lg hover:bg-neutral-800 transition-colors flex justify-center items-center gap-2 disabled:bg-neutral-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Procéder au paiement"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
