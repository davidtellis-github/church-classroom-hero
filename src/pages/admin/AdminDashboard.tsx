
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, UserCheck, Calendar } from "lucide-react";

// Mock data
const stats = [
  {
    title: "Total Students",
    value: "1,024",
    icon: Users,
    description: "Active students in system",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Total Classes",
    value: "36",
    icon: BookOpen,
    description: "Across all age groups",
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Teachers",
    value: "42",
    icon: UserCheck,
    description: "Active teachers",
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Weekly Attendance",
    value: "78%",
    icon: Calendar,
    description: "Average this month",
    color: "bg-amber-100 text-amber-700",
  },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your Church Classroom Management System
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {i % 2 === 0 ? "Attendance submitted" : "New student registered"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {i % 2 === 0 ? "Teacher Sarah marked attendance for Class 3B" : "Admin John added a new student to Class 5A"}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {i} hour{i > 1 ? "s" : ""} ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>
              Weekly attendance rates by class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Toddlers", "Pre-K", "K-2nd Grade", "3rd-5th Grade", "Middle School"].map((className, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{className}</p>
                      <p className="text-sm font-medium">
                        {80 - i * 5}%
                      </p>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-primary/10">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${80 - i * 5}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
