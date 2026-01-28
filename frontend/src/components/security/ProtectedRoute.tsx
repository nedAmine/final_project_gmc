import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { type RootState } from "../../context/store";
import { type ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}