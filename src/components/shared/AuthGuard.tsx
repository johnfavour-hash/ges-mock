import { Navigate, Outlet } from "react-router";
import useAuthStore from "@stores/auth.store";

const AuthGuard = () => {
  const { id } = useAuthStore();

  if (!id) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
