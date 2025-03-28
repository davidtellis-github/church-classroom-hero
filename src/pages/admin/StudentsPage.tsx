
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
import { Search, UserPlus, Upload, Download } from "lucide-react";
import { mockData } from "@/utils/mockData";

const StudentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState(mockData.students);
  
  const filteredStudents = students.filter(
    student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage student information and class assignments
          </p>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-church-navy hover:bg-church-navy/90">
            <Upload className="mr-2 h-4 w-4" /> Bulk Upload
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Students List ({filteredStudents.length} students)</CardTitle>
          <CardDescription>
            View and manage all students in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-church-navy hover:bg-church-navy/90">
                  <UserPlus className="mr-2 h-4 w-4" /> Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new student below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="age" className="text-right">
                      Age
                    </Label>
                    <Input id="age" type="number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="grade" className="text-right">
                      Grade
                    </Label>
                    <Input id="grade" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="parent" className="text-right">
                      Parent Name
                    </Label>
                    <Input id="parent" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input id="phone" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="class" className="text-right">
                      Class
                    </Label>
                    <Input id="class" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-church-navy hover:bg-church-navy/90">
                    Add Student
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
                  <TableHead>Age</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  // Only show first 15 students for performance
                  filteredStudents.slice(0, 15).map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.age}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>{student.parentName}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={student.attendanceRate < 60 ? "text-red-500" : 
                                           student.attendanceRate < 80 ? "text-amber-500" : "text-green-500"}>
                            {student.attendanceRate}%
                          </span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${
                                student.attendanceRate < 60 ? "bg-red-500" : 
                                student.attendanceRate < 80 ? "bg-amber-500" : "bg-green-500"
                              }`} 
                              style={{ width: `${student.attendanceRate}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" className="h-8 w-8 p-0" title="Edit">
                          <span className="sr-only">Edit</span>
                          <span className="h-4 w-4">✏️</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
                {filteredStudents.length > 15 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-2">
                      <span className="text-sm text-muted-foreground">
                        Showing 15 of {filteredStudents.length} students. Refine your search to see more.
                      </span>
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

export default StudentsPage;
