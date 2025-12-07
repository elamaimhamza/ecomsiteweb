import { Button } from "@/components/ui/button";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ListCollapse } from "lucide-react";
export default function AdminLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-gray-100 max-h-screen overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col justify-between h-full gap-3">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-gray-700  px-3 py-2 rounded-sm ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent hover:bg-zinc-200"
                }`
              }
              end
            >
              <div className="flex justify-items-center gap-2">
                <LayoutDashboard />
                Dashboard
              </div>
            </NavLink>
            <NavLink
              to="/admin/produits"
              className={({ isActive }) =>
                `text-gray-700  px-3 py-2 rounded-sm ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent hover:bg-zinc-200"
                }`
              }
            >
              <div className="flex justify-items-center gap-2">
                <ListCollapse />
                Produits
              </div>
            </NavLink>
            <NavLink
              to="/admin/commandes"
              className={({ isActive }) =>
                `text-gray-700  px-3 py-2 rounded-sm ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent hover:bg-zinc-200"
                }`
              }
            >
              <div className="flex justify-items-center gap-2">
                <ListCollapse />
                Commandes
              </div>
            </NavLink>
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => {
                navigate("/");
              }}
            >
              Retour à la page principale
            </Button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-auto">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
