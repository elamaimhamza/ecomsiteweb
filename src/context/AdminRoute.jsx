import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (isAdmin == false && !loading) return null; // or loading spinner

  return isAdmin && !loading ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
