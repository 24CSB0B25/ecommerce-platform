import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({
  children,
}) {
  const { user } =
    useContext(AuthContext);

  return user &&
    user.isAdmin ? (
    children
  ) : (
    <Navigate to="/" />
  );
}

export default AdminRoute;