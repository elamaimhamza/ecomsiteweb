import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  return isAdmin && !loading ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
