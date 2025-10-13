import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // optional loader/spinner
  }

  if (!user) {
    // 🚫 if not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // ✅ otherwise show the protected content
  return children;
};

export default ProtectedRoute;
