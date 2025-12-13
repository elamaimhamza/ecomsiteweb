import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import api from "@/api/axios";

const OrderDetailsPage = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let token = localStorage.getItem("jwt");
  // Helper: Format Price
  const formatPrice = (price) => {
    const numericPrice = parseFloat(price) || 0;

    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(numericPrice);
  };

  // Helper: Format Date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/commandes/${id}`, {
          headers: { Authorization: "Bearer " + token },
        });
        setOrder(res.data.commande);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Impossible de charger la commande.");
        // Optional: Redirect to list after 3 seconds if not found
        // setTimeout(() => navigate("/mes-commandes"), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, navigate]);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "livré" || s === "completed")
      return "text-green-600 bg-green-50 border-green-200";
    if (s === "annulé" || s === "cancelled")
      return "text-red-600 bg-red-50 border-red-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 size={40} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 gap-4">
        <XCircle size={48} className="text-red-400" />
        <h2 className="text-xl font-bold text-gray-900">
          Commande introuvable
        </h2>
        <Link to="/mes-commandes" className="text-indigo-600 hover:underline">
          Retour à mes commandes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Back */}
        <button
          onClick={() => navigate("/mes-commandes")}
          className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
        >
          <ArrowLeft
            size={20}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          Retour à la liste
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Commande #{String(order.id).padStart(4, "0")}
            </h1>
            <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
              <Calendar size={16} />
              Passée le {formatDate(order.created_at)}
            </div>
          </div>
          <div
            className={`px-4 py-2 rounded-full border flex items-center gap-2 font-medium ${getStatusColor(
              order.statut
            )}`}
          >
            {order.statut === "Livré" ? (
              <CheckCircle size={18} />
            ) : (
              <Clock size={18} />
            )}
            {order.statut}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Package size={20} className="text-indigo-600" />
                  Articles ({order.ligne_commandes?.length || 0})
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {order.ligne_commandes?.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4 sm:gap-6">
                    {/* Product Image Placeholder or Actual Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                      {item.produit?.image ? (
                        <img
                          src={`${item.produit.image}`}
                          alt={item.produit.nom}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package size={24} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {item.produit?.nom || "Produit supprimé"}
                        </h3>
                        {/* Optional: Add size/color if you have those columns */}
                        {/* <p className="text-sm text-gray-500">Taille: M</p> */}
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div className="text-sm text-gray-600">
                          Qté:{" "}
                          <span className="font-medium text-gray-900">
                            {item.quantite}
                          </span>
                        </div>
                        <p className="font-bold text-indigo-600">
                          {formatPrice(item.prix_unitaire)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Summary & Info */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Récapitulatif
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>
                    {formatPrice(
                      parseFloat(order.montant_total) -
                        parseFloat(order.livraison?.transporteur?.prix || 0)
                    )}
                  </span>
                  {/* Adjust if you have separate subtotal */}
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="text-green-600">
                    {formatPrice(order.livraison.transporteur.prix)}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(order.montant_total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address (Static for now, connect to DB if you have address table) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-indigo-600" />
                Adresse de livraison
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {/* Replace with {order.adresse_livraison} if available */}
                {order.utilisateur?.prenom} {order.utilisateur?.nom}
                <br />
                123 Avenue de la République
                <br />
                75001 Paris, France
              </p>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-indigo-600" />
                Paiement
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-400">
                  VISA
                </div>
                <span>**** **** **** 4242</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
