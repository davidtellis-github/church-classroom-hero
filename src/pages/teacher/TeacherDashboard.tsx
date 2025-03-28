
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, CheckSquare, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock data
const stats = [
  {
    title: "My Classes",
    value: "2",
    icon: BookOpen,
    description: "Active classes",
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Students",
    value: "32",
    icon: Users,
    description: "Total students",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Attendance Rate",
    value: "92%",
    icon: CheckSquare,
    description: "Average this month",
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Next Class",
    value: "Sunday",
    icon: Calendar,
    description: "9:00 AM - Room 102",
    color: "bg-amber-100 text-amber-700",
  },
];

// Mock upcoming classes
const upcomingClasses = [
  { id: "C001", name: "Pre-K", date: "Sunday, June 4", time: "9:00 AM", room: "102", students: 15 },
  { id: "C007", name: "Wednesday Pre-K", date: "Wednesday, June 7", time: "7:00 PM", room: "102", students: 12 },
  { id: "C001", name: "Pre-K", date: "Sunday, June 11", time: "9:00 AM", room: "102", students: 15 },
];

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your classes and attendance.
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {cls.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {cls.date} at {cls.time} - Room {cls.room}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {cls.students} students
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "May 28, 2023", class: "Pre-K", present: 14, absent: 1, total: 15 },
                { date: "May 24, 2023", class: "Wednesday Pre-K", present: 10, absent: 2, total: 12 },
                { date: "May 21, 2023", class: "Pre-K", present: 13, absent: 2, total: 15 },
              ].map((record, index) => (
                <div key={index} className="rounded-lg border p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">{record.date}</p>
                    <p className="text-sm font-medium">{record.class}</p>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Attendance: {record.present}/{record.total}</span>
                      <span>{Math.round((record.present / record.total) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-primary/10">
                      <div
                        className="h-2 rounded-full bg-church-green"
                        style={{ width: `${(record.present / record.total) * 100}%` }}
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

export default TeacherDashboard;
