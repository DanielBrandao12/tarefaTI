import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/index";

const PrivateRoute = () => {
  const isAuthenticated = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};


export default PrivateRoute;