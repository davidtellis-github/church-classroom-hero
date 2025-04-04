
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { absentStudents } from "@/utils/absentStudentsMock";

interface DashboardLayoutProps {
  requiredRole?: "admin" | "teacher";
}

export function DashboardLayout({ requiredRole }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading, isAdmin, isTeacher } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-navy"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check role restrictions
  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/teacher" />;
  }

  if (requiredRole === "teacher" && !isTeacher) {
    return <Navigate to="/admin" />;
  }

  // Pass the absent students count to the sidebar for admin notifications
  const absenceNotificationsCount = isAdmin ? absentStudents.length : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardSidebar absenceNotificationsCount={absenceNotificationsCount} />
      <div className="lg:pl-64">
        <DashboardHeader absenceNotificationsCount={absenceNotificationsCount} />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
