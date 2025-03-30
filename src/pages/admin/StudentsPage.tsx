
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
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
import { Search, UserPlus, Upload, Download, Edit, RefreshCcw } from "lucide-react";
import { mockData, Student } from "@/utils/mockData";
import { BulkStudentUpdateDialog } from "@/components/BulkStudentUpdateDialog";

const StudentsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState(mockData.students);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [bulkUpdateDialogOpen, setBulkUpdateDialogOpen] = useState(false);
  
  const filteredStudents = students.filter(
    student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAllStudents = (checked: boolean) => {
    if (checked) {
      // Only select displayed students (max 15)
      const displayedStudentIds = filteredStudents.slice(0, 15).map(student => student.id);
      setSelectedStudents(displayedStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };
  
  const handleBulkUpdate = (updates: Partial<Student>, studentIds: string[]) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        studentIds.includes(student.id) 
          ? { ...student, ...updates }
          : student
      )
    );
    
    // Reset selection after update
    setSelectedStudents([]);
  };

  const handleExport = () => {
    // Logic for exporting selected students or all filtered students
    const studentsToExport = selectedStudents.length > 0 
      ? students.filter(student => selectedStudents.includes(student.id))
      : filteredStudents.slice(0, 15);
    
    // Create CSV content
    const header = ["ID", "Name", "Age", "Grade", "Parent Name", "Phone", "Attendance"];
    const rows = studentsToExport.map(student => [
      student.id,
      student.name,
      student.age,
      student.grade,
      student.parentName,
      student.phone,
      `${student.attendanceRate}%`,
    ]);
    
    const csvContent = [
      header.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "students.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export complete",
      description: `${studentsToExport.length} students exported to CSV.`,
    });
  };

  const selectedDisplayedStudents = students.filter(
    student => selectedStudents.includes(student.id)
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
          <Button variant="outline" onClick={handleExport}>
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
            <div className="flex space-x-2">
              {selectedStudents.length > 0 && (
                <Button 
                  variant="outline" 
                  className="border-amber-500 text-amber-500 hover:bg-amber-50"
                  onClick={() => setBulkUpdateDialogOpen(true)}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> 
                  Bulk Update ({selectedStudents.length})
                </Button>
              )}
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
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={
                        filteredStudents.length > 0 &&
                        filteredStudents.slice(0, 15).every(
                          student => selectedStudents.includes(student.id)
                        )
                      }
                      onCheckedChange={handleSelectAllStudents}
                      aria-label="Select all students"
                    />
                  </TableHead>
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
                      <TableCell>
                        <Checkbox 
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => handleSelectStudent(student.id)}
                          aria-label={`Select ${student.name}`}
                        />
                      </TableCell>
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
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
                {filteredStudents.length > 15 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-2">
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
      
      {/* Bulk update dialog */}
      <BulkStudentUpdateDialog
        open={bulkUpdateDialogOpen}
        setOpen={setBulkUpdateDialogOpen}
        selectedStudents={selectedDisplayedStudents}
        onUpdate={handleBulkUpdate}
      />
    </div>
  );
};

export default StudentsPage;
