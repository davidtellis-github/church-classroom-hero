
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Church, 
  Users, 
  BookOpen, 
  CheckSquare, 
  BarChart, 
  UserCog,
  LucideIcon
} from "lucide-react";

interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
  role: "admin" | "teacher" | "both";
}

const links: SidebarLink[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart,
    role: "admin",
  },
  {
    title: "Dashboard",
    href: "/teacher",
    icon: BarChart,
    role: "teacher",
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: Users,
    role: "admin",
  },
  {
    title: "Classes",
    href: "/admin/classes",
    icon: BookOpen,
    role: "admin",
  },
  {
    title: "Teachers",
    href: "/admin/teachers",
    icon: UserCog,
    role: "admin",
  },
  {
    title: "My Classes",
    href: "/teacher/classes",
    icon: BookOpen,
    role: "teacher",
  },
  {
    title: "Attendance",
    href: "/teacher/attendance",
    icon: CheckSquare,
    role: "teacher",
  },
];

export function DashboardSidebar() {
  const { pathname } = useLocation();
  const { isAdmin, isTeacher } = useAuth();

  const filteredLinks = links.filter(link => {
    if (link.role === "both") return true;
    if (link.role === "admin" && isAdmin) return true;
    if (link.role === "teacher" && isTeacher) return true;
    return false;
  });

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-church-navy text-white lg:block">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link to={isAdmin ? "/admin" : "/teacher"} className="flex items-center gap-2 font-semibold">
          <Church className="h-6 w-6" />
          <span>Church CCMS</span>
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {filteredLinks.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            className={cn(
              "w-full justify-start text-white/70 hover:text-white",
              pathname === link.href && "bg-white/10 text-white"
            )}
            asChild
          >
            <Link to={link.href}>
              <link.icon className="mr-2 h-5 w-5" />
              {link.title}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
