import api from "@/api/axios";
import {
  Eye,
  Search,
  Filter,
  Loader2,
  Calendar,
  CheckCircle,
  XCircle,
  Truck,
  Package,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mapping status to colors/icons for better UI
const STATUS_CONFIG = {
  Payée: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  Expédiée: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Truck },
  Livrée: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: Package },
  Annulée: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
};

export default function AdminOrders() {
  const token = localStorage.getItem("jwt");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      // We assume the backend returns orders WITH the user relationship
      const res = await api.get("/admin/commandes", {
        headers: { Authorization: "Bearer " + token },
      });
      setOrders(res.data.commandes);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Impossible de charger les commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status Handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optimistic UI update (update immediately before API returns)
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, statut: newStatus } : order
        )
      );

      await api.put(
        `/admin/commandes/${id}/status`,
        { statut: newStatus },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      toast.success(`Statut mis à jour: ${newStatus}`);
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Erreur lors de la mise à jour");
      fetchOrders(); // Revert on error
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.utilisateur?.nom
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.utilisateur?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading)
    return (
      <div className="h-screen centered">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Commandes
            </h1>
            <p className="text-gray-500 text-sm">
              Vue d'ensemble de toutes les transactions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher (ID, Nom, Email)..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 outline-none w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 outline-none appearance-none bg-white cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">Tous les statuts</option>
                {Object.keys(STATUS_CONFIG).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-bleu border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const StatusIcon =
                      STATUS_CONFIG[order.statut]?.icon || Loader2;

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {order.utilisateur
                                ? `${order.utilisateur.prenom} ${order.utilisateur.nom}`
                                : "Utilisateur supprimé"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {order.utilisateur?.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(order.created_at).toLocaleDateString(
                              "fr-BE"
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {order.montant_total} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* STATUS DROPDOWN SELECTOR */}
                          <div className="relative inline-block">
                            <select
                              value={order.statut}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              className={`appearance-none pl-8 pr-8 py-1.5 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                STATUS_CONFIG[order.statut]?.color ||
                                "bg-gray-100"
                              }`}
                            >
                              {Object.keys(STATUS_CONFIG).map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <StatusIcon
                              className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${
                                STATUS_CONFIG[order.statut]?.color.split(" ")[1]
                              }`}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              console.log("Open details modal for", order.id);
                              navigate("/admin/commandes/" + order.id);
                            }}
                            className="text-neutral-600 hover:text-neutral-900 cursor-pointer bg-gray-100 hover:bg-blue-950 p-2 rounded-md transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4 " />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      Aucune commande trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Simple Pagination Footer (Static for now) */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Affichage de{" "}
              <span className="font-medium">{filteredOrders.length}</span>{" "}
              résultats
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
