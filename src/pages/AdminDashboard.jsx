export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h2 className="text-2xl font-bold">Welcome to the Admin Dashboard</h2>
      <p className="text-gray-600">
        Here you can manage users, view statistics, and control the platform.
      </p>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold mt-2">123</p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-lg font-semibold">New This Month</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Active Admins</h3>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white p-6 rounded-lg shadow mt-4">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            View Users
          </button>

          <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">
            Manage Settings
          </button>
        </div>
      </div>
    </div>
  );
}
