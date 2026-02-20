import { useAuthStore } from "@/store/auth-store";

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const isAdmin = useAuthStore((state) => state.isAdmin());

  return isAdmin ? <>{children}</> : <>{fallback}</>;
}
