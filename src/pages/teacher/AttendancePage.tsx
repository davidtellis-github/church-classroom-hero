
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

// Mock data
const myClasses = [
  { id: "C002", name: "Pre-K", room: "102", day: "Sunday", time: "9:00 AM" },
  { id: "C008", name: "Wednesday Pre-K", room: "102", day: "Wednesday", time: "7:00 PM" },
];

const mockStudents = [
  { id: "STU1001", name: "Emma Johnson", age: 4, present: true },
  { id: "STU1002", name: "Noah Williams", age: 5, present: true },
  { id: "STU1003", name: "Olivia Brown", age: 4, present: false },
  { id: "STU1004", name: "Liam Davis", age: 5, present: true },
  { id: "STU1005", name: "Ava Wilson", age: 4, present: true },
  { id: "STU1006", name: "William Taylor", age: 5, present: true },
  { id: "STU1007", name: "Sophia Anderson", age: 4, present: false },
  { id: "STU1008", name: "James Thomas", age: 5, present: true },
  { id: "STU1009", name: "Isabella Jackson", age: 4, present: true },
  { id: "STU1010", name: "Oliver White", age: 5, present: true },
  { id: "STU1011", name: "Charlotte Harris", age: 4, present: true },
  { id: "STU1012", name: "Benjamin Martin", age: 5, present: false },
];

type AttendanceStatus = "present" | "absent" | "late" | "leftEarly";

interface StudentAttendance {
  id: string;
  name: string;
  age: number;
  status: AttendanceStatus;
}

const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<StudentAttendance[]>(
    mockStudents.map(student => ({ 
      ...student, 
      status: student.present ? "present" : "absent" 
    }))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(
      attendance.map(student => 
        student.id === studentId 
          ? { ...student, status } 
          : student
      )
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Attendance Saved",
        description: "Your attendance draft has been saved successfully.",
        duration: 3000,
      });
    }, 1000);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Attendance Submitted",
        description: `Attendance for ${selectedClass} on ${format(selectedDate, "PPP")} has been submitted.`,
        duration: 3000,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mark Attendance</h2>
        <p className="text-muted-foreground">
          Record student attendance for your classes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Form</CardTitle>
          <CardDescription>
            Select a class and date to mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Label htmlFor="class-select">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-select" className="w-full">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {myClasses.map(cls => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name} ({cls.day}, {cls.time})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {selectedClass && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Attendance for {selectedClass} on {format(selectedDate, "PPP")}
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Draft"}
                  </Button>
                  <Button className="bg-church-navy hover:bg-church-navy/90" onClick={handleSubmit} disabled={isSubmitting}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Submitting..." : "Submit Attendance"}
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.age}</TableCell>
                        <TableCell className="text-right">
                          <RadioGroup
                            value={student.status}
                            onValueChange={(value) => 
                              handleStatusChange(student.id, value as AttendanceStatus)
                            }
                            className="flex space-x-2 justify-end"
                          >
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem 
                                value="present" 
                                id={`present-${student.id}`} 
                                className="text-green-500"
                              />
                              <Label 
                                htmlFor={`present-${student.id}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                Present
                              </Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem 
                                value="absent" 
                                id={`absent-${student.id}`}
                                className="text-red-500"
                              />
                              <Label 
                                htmlFor={`absent-${student.id}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                Absent
                              </Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem 
                                value="late" 
                                id={`late-${student.id}`}
                                className="text-amber-500"
                              />
                              <Label 
                                htmlFor={`late-${student.id}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                Late
                              </Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem 
                                value="leftEarly" 
                                id={`leftEarly-${student.id}`}
                                className="text-blue-500"
                              />
                              <Label 
                                htmlFor={`leftEarly-${student.id}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                Left Early
                              </Label>
                            </div>
                          </RadioGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                  <span>Present: {attendance.filter(s => s.status === "present").length}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="h-3 w-3 rounded-full bg-red-500"></span>
                  <span>Absent: {attendance.filter(s => s.status === "absent").length}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                  <span>Late: {attendance.filter(s => s.status === "late").length}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                  <span>Left Early: {attendance.filter(s => s.status === "leftEarly").length}</span>
                </div>
              </div>
            </div>
          )}

          {!selectedClass && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Class Selected</h3>
              <p className="text-muted-foreground mt-1">
                Please select a class and date to mark attendance
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
