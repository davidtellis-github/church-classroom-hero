
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Users, BookOpen } from "lucide-react";

// Mock data - teacher's assigned classes
const myClasses = [
  { id: "C002", name: "Pre-K", room: "102", students: 15, time: "9:00 AM", day: "Sunday", nextDate: "June 4, 2023" },
  { id: "C008", name: "Wednesday Pre-K", room: "102", students: 12, time: "7:00 PM", day: "Wednesday", nextDate: "June 7, 2023" },
];

const TeacherClassesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState(myClasses);
  
  const filteredClasses = classes.filter(
    cls => 
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cls.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.day.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Classes</h2>
          <p className="text-muted-foreground">
            View and manage your assigned classes
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Classes List</CardTitle>
          <CardDescription>
            View details for your assigned classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full max-w-sm mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search classes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Next Class</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.id}</TableCell>
                      <TableCell>{cls.name}</TableCell>
                      <TableCell>{cls.room}</TableCell>
                      <TableCell>{cls.students}</TableCell>
                      <TableCell>{cls.time}</TableCell>
                      <TableCell>{cls.day}</TableCell>
                      <TableCell>{cls.nextDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" className="mr-2" title="View Roster">
                          <Users className="mr-2 h-4 w-4" />
                          Roster
                        </Button>
                        <Button className="bg-church-navy hover:bg-church-navy/90" title="Mark Attendance">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Attendance
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No classes found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherClassesPage;
