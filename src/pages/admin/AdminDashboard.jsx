import api from "@/api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Skeleton } from "@/components/ui/skeleton";

function Skeleton({ className, ...props }) {
  // Merging classes manually for simplicity
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className || ""}`}
      {...props}
    />
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  let token = localStorage.getItem("jwt");
  // 1. Define state to hold the stats
  const [stats, setStats] = useState({
    active_users: 0,
    new_this_month: 0,
    admins: 0,
    total_commands: 0,
    total_earned: 0,
  });

  const [loading, setLoading] = useState(true);

  // 2. Fetch data when component mounts
  useEffect(() => {
    // Replace '/api/stats' with your actual endpoint URL if different
    api
      .get("/stats", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(response.data);
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setLoading(false);
      });
  }, []);

  // 3. Helper to format currency (Euro/MAD/USD)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // --- LOADING STATE (SKELETONS) ---
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Grid for Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create 5 skeleton cards to match your 5 real cards */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-lg shadow border-l-4 border-gray-200 flex flex-col"
            >
              <Skeleton className="h-4 w-32 mb-2 bg-gray-200" />
              {/* Label title */}
              <Skeleton className="h-10 w-16 bg-gray-200" /> {/* Big number */}
            </div>
          ))}
        </div>

        {/* Skeleton for Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow mt-4">
          <Skeleton className="h-6 w-40 mb-4 bg-gray-200" /> {/* Title */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32 rounded bg-gray-200" /> {/* Button 1 */}
            <Skeleton className="h-10 w-40 rounded bg-gray-200" /> {/* Button 2 */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CARTES DE STATISTIQUES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Utilisateurs */}
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Utilisateurs Totaux
          </h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {stats.active_users}
          </p>
        </div>

        {/* Nouveaux Inscrits */}
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Nouveaux ce mois
          </h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {stats.new_this_month}
          </p>
        </div>

        {/* Admins */}
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Administrateurs
          </h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {stats.admins}
          </p>
        </div>

        {/* Commandes */}
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Commandes Totales
          </h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {stats.total_commands}
          </p>
        </div>

        {/* Revenu Total */}
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Chiffre d'Affaires
          </h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {formatCurrency(stats.total_earned)}
          </p>
        </div>
      </div>

      {/* ACTIONS RAPIDES */}
      <div className="bg-white p-6 rounded-lg shadow mt-4">
        <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>

        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => {
              navigate("/admin/produits");
            }}
          >
            Gérer les Produits
          </button>

          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            onClick={() => navigate("/admin/commandes")} // Assurez-vous que cette route existe
          >
            Voir les Commandes
          </button>
        </div>
      </div>
    </div>
  );
}
