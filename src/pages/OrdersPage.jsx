import React, { useEffect, useState } from "react";
import {
  Package,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState();
  const [loading, setLoading] = useState(true);
  let token = localStorage.getItem("jwt");

  const navigate = useNavigate();

  // Format Date (e.g., "2023-12-08" -> "08 déc. 2023")
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format Price (e.g., 145.00 -> "145,00 €")
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/commandes", {
          headers: { Authorization: "Bearer " + token },
        });
        // We map the backend data to match the UI structure
        const formattedOrders = res.data.commandes.map((order) => ({
          id: order.id,
          // Assuming backend returns 'created_at'
          date: order.created_at,
          // Assuming backend returns 'montant_total' or 'total'
          total: order.montant_total || order.total,
          // Assuming backend returns 'statut' or 'status'
          status: order.statut || order.status,
          // Count items safely (if eager loaded)
          items: order.ligne_commandes ? order.ligne_commandes.length : 0,
        }));
        setOrders(formattedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Updated Status Styles for: Payée, Expédiée, Livrée
  const getStatusStyle = (status) => {
    switch (status) {
      case "Livrée":
        return "bg-green-100 text-green-700 border-green-200";
      case "Expédiée":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Payée":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Annulée":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Helper to get the right icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Livrée":
        return <CheckCircle size={14} />;
      case "Expédiée":
        return <Truck size={14} />;
      case "Payée":
        return <CreditCard size={14} />; // Or <Clock />
      case "Annulée":
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 size={40} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-indigo-600" />
              Mes Commandes
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Retrouvez ici l'historique et le statut de vos achats.
            </p>
          </div>
        </div>

        {/* List */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                    <th className="px-6 py-4">Référence</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <ShoppingBag size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {/* Format ID to look like CMD-00123 */}
                              CMD-{String(order.id).padStart(4, "0")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.items} article(s)
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {formatDate(order.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {/* Render icon based on normalized status */}
                          {(order.status === "Livré" ||
                            order.status === "completed") && (
                            <CheckCircle size={12} />
                          )}
                          {(order.status === "En cours" ||
                            order.status === "pending") && <Clock size={12} />}
                          {(order.status === "Annulé" ||
                            order.status === "cancelled") && (
                            <XCircle size={12} />
                          )}

                          {/* Display the status text */}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* You can link this to a details page later e.g., to={`/commandes/${order.id}`} */}
                        <button
                          onClick={() => {
                            navigate("/mes-commandes/" + order.id);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Détails <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Aucune commande
              </h3>
              <p className="text-gray-500 mt-1">
                Vous n'avez pas encore passé de commande.
              </p>
              <Link
                to="/"
                className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Commencer mes achats
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
