import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

export default function({ children }) {
  const { user,loading } = useContext(AuthContext);
  if (loading) {
    return <div />;
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children;
}