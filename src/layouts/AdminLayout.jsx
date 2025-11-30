import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <Link
            to="/admin"
            className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md"
          >
            Users
          </Link>

          <Link
            to="/"
            className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md mt-10"
          >
            Back to Site
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
