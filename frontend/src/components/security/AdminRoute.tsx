import { useSelector } from "react-redux";
import { type RootState } from "../../context/store";
import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useSelector((s: RootState) => s.auth);

  if (!user || user.userType !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
}