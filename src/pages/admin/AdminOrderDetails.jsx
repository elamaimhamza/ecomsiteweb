import api from "@/api/axios";
import {
  ArrowLeft,
  Calendar,
  Mail,
  User,
  MapPin,
  Printer,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Status Colors Config (Reused)
const STATUS_CONFIG = {
  
  Payée: {
    color: "text-green-700 bg-green-50 border-green-200",
    icon: CheckCircle,
  },
  Expédiée: { color: "text-blue-700 bg-blue-50 border-blue-200", icon: Truck },
  Livrée: { color: "text-gray-700 bg-gray-50 border-gray-200", icon: Package },
  Annulée: { color: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
};

export default function AdminOrderDetails() {
  let token = localStorage.getItem("jwt");
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Order Data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/admin/commandes/${id}`, {
          headers: { Authorization: "Bearer " + token },
        });
        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Commande introuvable");
        navigate("/admin/commandes");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  // Update Status Handler
  const handleStatusChange = async (newStatus) => {
    try {
      // Optimistic update
      setOrder((prev) => ({ ...prev, statut: newStatus }));
      await api.put(
        `/admin/commandes/${id}/status`,
        { statut: newStatus },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      toast.success("Statut mis à jour");
    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };

  if (loading)
    return (
      <div className="h-screen centered">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!order) return null;

  const StatusIcon = STATUS_CONFIG[order.statut]?.icon || AlertCircle;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* TOP NAVIGATION */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/admin/commandes")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} /> Retour à la liste
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Printer size={16} /> Imprimer
            </button>
          </div>
        </div>

        {/* MAIN CONTENT CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* HEADER SECTION */}
          <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  Commande #{order.id}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
                    STATUS_CONFIG[order.statut]?.color
                  }`}
                >
                  <StatusIcon size={12} />
                  {order.statut}
                </span>
              </div>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <Calendar size={14} />
                Passée le{" "}
                {new Date(order.created_at).toLocaleDateString("fr-BE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* STATUS SELECTOR */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Changer le statut:
              </span>
              <select
                value={order.statut}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5"
              >
                {Object.keys(STATUS_CONFIG).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border-b border-gray-100">
            {/* Customer Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Client
              </h3>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <User className="w-4 h-4 mt-1 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {order.utilisateur?.prenom} {order.utilisateur?.nom}
                  </p>
                  <p>ID Client: #{order.utilisateur_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <a
                  href={`mailto:${order.utilisateur?.email}`}
                  className="hover:underline hover:text-blue-600"
                >
                  {order.utilisateur?.email}
                </a>
              </div>
            </div>

            {/* Delivery/Payment Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Livraison & Paiement
              </h3>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-1 text-gray-400" />
                <div>
                  {/* Fallback to user address if order address isn't saved separately */}
                  <p>
                    {order.adresse ||
                      order.utilisateur?.adresse ||
                      "Adresse non renseignée"}
                  </p>
                  <p>
                    {order.utilisateur?.code_postal} {order.utilisateur?.ville}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <div>
                  <p>Via Stripe / Bancontact</p>
                  <p
                    className="text-xs text-gray-400 truncate max-w-[200px]"
                    title={order.stripe_session_id}
                  >
                    Ref: {order.stripe_session_id || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCTS TABLE */}
          <div className="p-0">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                <tr>
                  <th className="px-8 py-3 w-16">Img</th>
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3 text-right">Prix Unit.</th>
                  <th className="px-4 py-3 text-center">Qté</th>
                  <th className="px-8 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.ligne_commandes &&
                  order.ligne_commandes.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-8 py-4">
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 overflow-hidden">
                          {/* Try to show image if relationship exists, otherwise placeholder */}
                          {item.produit?.image ? (
                            <img
                              src={item.produit.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "IMG"
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">
                          {item.produit.nom}
                        </p>
                        <p className="text-xs text-gray-400">
                          Ref Product: {item.produit_id}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {parseFloat(item.prix_unitaire).toFixed(2)} €
                      </td>
                      <td className="px-4 py-4 text-center">{item.quantite}</td>
                      <td className="px-8 py-4 text-right font-medium text-gray-900">
                        {(item.prix_unitaire * item.quantite).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER TOTALS */}
          <div className="bg-gray-50 p-8 flex justify-end">
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Sous-total</span>
                <span>
                  {/* Recalculate subtotal from lines to be sure */}
                  {order.ligne_commandes
                    .reduce(
                      (acc, item) => acc + item.prix_unitaire * item.quantite,
                      0
                    )
                    .toFixed(2)}{" "}
                  €
                </span>
              </div>

              {/* Logic to guess shipping cost: Difference between Order Total and Subtotal */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Livraison (estimée)</span>
                <span>
                  {(
                    parseFloat(order.montant_total) -
                    order.ligne_commandes.reduce(
                      (acc, item) => acc + item.prix_unitaire * item.quantite,
                      0
                    )
                  ).toFixed(2)}{" "}
                  €
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {parseFloat(order.montant_total).toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
