
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Student } from "@/utils/mockData";

interface StudentsTableProps {
  students: Student[];
  selectedStudents: string[];
  handleSelectStudent: (studentId: string) => void;
  handleSelectAllStudents: (checked: boolean) => void;
}

export function StudentsTable({ 
  students, 
  selectedStudents, 
  handleSelectStudent, 
  handleSelectAllStudents 
}: StudentsTableProps) {
  // Only show first 15 students for performance
  const displayedStudents = students.slice(0, 15);
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={
                  displayedStudents.length > 0 &&
                  displayedStudents.every(
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
          {displayedStudents.length > 0 ? (
            displayedStudents.map((student) => (
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
          {students.length > 15 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-2">
                <span className="text-sm text-muted-foreground">
                  Showing 15 of {students.length} students. Refine your search to see more.
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
