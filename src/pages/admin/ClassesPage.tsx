
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, BookPlus } from "lucide-react";

// Mock data
const mockClasses = [
  { id: "C001", name: "Toddlers", room: "101", students: 18, teacher: "Sarah Johnson", time: "9:00 AM", day: "Sunday" },
  { id: "C002", name: "Pre-K", room: "102", students: 15, teacher: "Michael Williams", time: "9:00 AM", day: "Sunday" },
  { id: "C003", name: "K-2nd Grade", room: "103", students: 22, teacher: "Emily Davis", time: "9:00 AM", day: "Sunday" },
  { id: "C004", name: "3rd-5th Grade", room: "201", students: 20, teacher: "Robert Brown", time: "9:00 AM", day: "Sunday" },
  { id: "C005", name: "Middle School", room: "202", students: 17, teacher: "Jennifer Wilson", time: "9:00 AM", day: "Sunday" },
  { id: "C006", name: "High School", room: "203", students: 12, teacher: "David Miller", time: "9:00 AM", day: "Sunday" },
  { id: "C007", name: "Wednesday Toddlers", room: "101", students: 14, teacher: "Sarah Johnson", time: "7:00 PM", day: "Wednesday" },
  { id: "C008", name: "Wednesday Pre-K", room: "102", students: 12, teacher: "Michael Williams", time: "7:00 PM", day: "Wednesday" },
];

const ClassesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState(mockClasses);
  
  const filteredClasses = classes.filter(
    cls => 
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cls.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
          <p className="text-muted-foreground">
            Manage classes, teachers, and student assignments
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Classes List</CardTitle>
          <CardDescription>
            View and manage all classes in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search classes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-church-navy hover:bg-church-navy/90">
                  <BookPlus className="mr-2 h-4 w-4" /> Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new class below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Class Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room" className="text-right">
                      Room
                    </Label>
                    <Input id="room" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacher" className="text-right">
                      Teacher
                    </Label>
                    <Input id="teacher" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Time
                    </Label>
                    <Input id="time" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="day" className="text-right">
                      Day
                    </Label>
                    <Input id="day" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-church-navy hover:bg-church-navy/90">
                    Add Class
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Day</TableHead>
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
                      <TableCell>{cls.teacher}</TableCell>
                      <TableCell>{cls.time}</TableCell>
                      <TableCell>{cls.day}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" className="h-8 w-8 p-0" title="Edit">
                          <span className="sr-only">Edit</span>
                          <span className="h-4 w-4">✏️</span>
                        </Button>
                        <Button variant="ghost" className="h-8 w-8 p-0" title="View Roster">
                          <span className="sr-only">View Roster</span>
                          <span className="h-4 w-4">👥</span>
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

export default ClassesPage;
