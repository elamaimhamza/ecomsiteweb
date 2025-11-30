import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Register from "./pages/Register.jsx";
import Layout from "./layouts/Layout.jsx";
import Products from "./pages/Products.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import ProductView from "./pages/ProductView.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminRoute from "./context/AdminRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProductTable from "./pages/admin/ProductList.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductView />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<NotFound />} />
        </Route>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="produits" element={<ProductTable />} />
        </Route>
      </Routes>
    </>
  );
}
