
import { useState } from "react";
import { absentStudents, AbsentStudent } from "@/utils/absentStudentsMock";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BellRing, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { NotificationDialog } from "./NotificationDialog";

// Filter students with absence rates higher than 25% (attendance below 75%)
const filteredAbsentStudents = absentStudents.filter(student => student.absenceRate > 25);

export function AbsentStudentsSection() {
  const { toast } = useToast();
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AbsentStudent | null>(null);
  
  const handleNotify = (student: AbsentStudent) => {
    setSelectedStudent(student);
    setOpenNotificationDialog(true);
  };

  const handleExportAbsentList = () => {
    // Create CSV content
    const header = ["ID", "Name", "Grade", "Class", "Absence Rate", "Last Attendance", "Parent Name", "Parent Phone", "Parent Email"];
    const rows = filteredAbsentStudents.map(student => [
      student.id,
      student.name,
      student.grade,
      student.class,
      `${student.absenceRate}%`,
      student.lastAttendance,
      student.parent.name,
      student.parent.phone,
      student.parent.email
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
    link.setAttribute("download", "absent_students.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export complete",
      description: "Absent students list has been exported to CSV.",
    });
  };

  return (
    <>
      <Alert variant="destructive" className="bg-red-50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Attention Required</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{filteredAbsentStudents.length} students have absence rates above 25% (attendance below 75%) and require follow-up.</span>
          <Button variant="destructive" size="sm" onClick={handleExportAbsentList}>
            Export List
          </Button>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Students with Low Attendance</CardTitle>
              <CardDescription>
                Students missing more than 25% of classes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Absence Rate</TableHead>
                  <TableHead>Last Attendance</TableHead>
                  <TableHead>Parent Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAbsentStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                      <div className="text-xs text-muted-foreground">{student.id}</div>
                    </TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={student.absenceRate >= 50 ? "destructive" : "outline"}
                        className={student.absenceRate >= 50 ? "" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}
                      >
                        {student.absenceRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>{student.lastAttendance}</TableCell>
                    <TableCell>
                      <div>{student.parent.name}</div>
                      <div className="text-xs text-muted-foreground">{student.parent.phone}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8"
                        onClick={() => handleNotify(student)}
                      >
                        <BellRing className="mr-2 h-3.5 w-3.5" />
                        Notify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <NotificationDialog 
        open={openNotificationDialog}
        setOpen={setOpenNotificationDialog}
        student={selectedStudent}
      />
    </>
  );
}
