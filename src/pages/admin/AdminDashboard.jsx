import api from "@/api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// --- 1. REGISTER CHARTJS COMPONENTS ---
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

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

  const [chartData, setChartData] = useState();
  const [barData, setBarData] = useState();

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
        const statsData = response.data;

        console.log("statsData", statsData);
        setBarData({
          labels: statsData.daily_revenue
            ? statsData.daily_revenue.map((d) => d.date)
            : [],
          datasets: [
            {
              label: "Revenu (€)",
              data: statsData.daily_revenue
                ? statsData.daily_revenue.map((d) => d.total)
                : [],
              backgroundColor: "#3b82f6", // Blue bars
              borderRadius: 4, // Rounded corners
            },
          ],
        });
        setChartData({
          labels: statsData.orders_by_status.map((item) => item.statut),
          datasets: [
            {
              label: "Nombre de commandes",
              data: statsData.orders_by_status.map((item) => item.count),
              backgroundColor: [
                "#3b82f6", // Blue (Tailwind blue-500)
                "#10b981", // Green (Tailwind green-500)
                "#f59e0b", // Orange (Tailwind amber-500)
                "#ef4444", // Red (Tailwind red-500)
                "#8b5cf6", // Purple (Tailwind violet-500)
                "#6b7280", // Gray
              ],
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        });
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

  // Options to make the Bar chart look clean
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Hide legend since we have a title
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f3f4f6" }, // Light gray grid lines
      },
      x: {
        grid: { display: false }, // No vertical grid lines
      },
    },
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
            <Skeleton className="h-10 w-32 rounded bg-gray-200" />{" "}
            {/* Button 1 */}
            <Skeleton className="h-10 w-40 rounded bg-gray-200" />{" "}
            {/* Button 2 */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Utilisateurs Totaux
          </h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {stats.active_users}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Nouveaux ce mois
          </h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {stats.new_this_month}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Administrateurs
          </h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {stats.admins}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Commandes Totales
          </h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {stats.total_commands}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Chiffre d'Affaires
          </h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {formatCurrency(stats.total_earned)}
          </p>
        </div>
        {/* 6. BEST SELLER (New!) */}
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-pink-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Le Produit le plus commandé
          </h3>
          {stats.top_product ? (
            <div>
              <p
                className="text-xl font-bold mt-2 text-gray-800 truncate"
                title={stats.top_product.name}
              >
                {stats.top_product.name}
              </p>
              <p className="text-sm text-gray-500">
                {stats.top_product.count} vendus
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold mt-2 text-gray-400">-</p>
          )}
        </div>
      </div>

      {/* --- CHART & ACTIONS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-6 text-gray-700 w-full text-left">
            Répartition des Commandes
          </h3>
          <div className="h-64 w-full flex justify-center">
            {stats.orders_by_status.length > 0 ? (
              <Pie
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom", // Puts labels under the pie
                    },
                  },
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                <p>Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>
        {/* BAR CHART (Revenue) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Revenus (7 derniers jours)
          </h3>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
