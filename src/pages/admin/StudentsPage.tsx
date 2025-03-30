import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { mockData, Student } from "@/utils/mockData";
import { BulkStudentUpdateDialog } from "@/components/BulkStudentUpdateDialog";
import { StudentSearchBar } from "@/components/students/StudentSearchBar";
import { StudentActionButtons } from "@/components/students/StudentActionButtons";
import { StudentsTable } from "@/components/students/StudentsTable";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import { BulkUpdateButton } from "@/components/students/BulkUpdateButton";

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

  const handleImportStudents = (newStudents: Student[]) => {
    // Check for duplicate IDs
    const existingIds = new Set(students.map(s => s.id));
    const uniqueNewStudents = newStudents.filter(student => !existingIds.has(student.id));
    
    // Add new students to the state
    setStudents(prev => [...prev, ...uniqueNewStudents]);
    
    toast({
      title: "Students imported",
      description: `${uniqueNewStudents.length} new students have been added to the system.`,
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
        <StudentActionButtons 
          onExport={handleExport}
          onStudentsImported={handleImportStudents}
        />
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
            <StudentSearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
            <div className="flex space-x-2">
              <BulkUpdateButton 
                selectedCount={selectedStudents.length} 
                onClick={() => setBulkUpdateDialogOpen(true)} 
              />
              <AddStudentDialog />
            </div>
          </div>

          <StudentsTable 
            students={filteredStudents}
            selectedStudents={selectedStudents}
            handleSelectStudent={handleSelectStudent}
            handleSelectAllStudents={handleSelectAllStudents}
          />
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
