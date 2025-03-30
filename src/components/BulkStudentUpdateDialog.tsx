
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/utils/mockData";

const bulkUpdateSchema = z.object({
  classId: z.string().optional(),
  grade: z.string().optional(),
  updateAttendance: z.boolean().default(false),
  attendanceRate: z.string().optional(),
});

type BulkUpdateFormValues = z.infer<typeof bulkUpdateSchema>;

interface BulkStudentUpdateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedStudents: Student[];
  onUpdate: (updates: Partial<Student>, studentIds: string[]) => void;
}

export function BulkStudentUpdateDialog({ 
  open, 
  setOpen, 
  selectedStudents,
  onUpdate 
}: BulkStudentUpdateDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<BulkUpdateFormValues>({
    resolver: zodResolver(bulkUpdateSchema),
    defaultValues: {
      classId: "",
      grade: "",
      updateAttendance: false,
      attendanceRate: "",
    },
  });
  
  const handleSubmit = (values: BulkUpdateFormValues) => {
    // Create updates object with only the fields that are filled
    const updates: Partial<Student> = {};
    
    if (values.classId) updates.classId = values.classId;
    if (values.grade) updates.grade = values.grade;
    if (values.updateAttendance && values.attendanceRate) {
      updates.attendanceRate = parseInt(values.attendanceRate, 10);
    }
    
    // Check if any updates were specified
    if (Object.keys(updates).length === 0) {
      toast({
        title: "No updates specified",
        description: "Please specify at least one field to update.",
        variant: "destructive",
      });
      return;
    }
    
    // Get IDs of selected students
    const studentIds = selectedStudents.map(student => student.id);
    
    // Call the update function
    onUpdate(updates, studentIds);
    
    // Close dialog and reset form
    setOpen(false);
    form.reset();
    
    toast({
      title: "Students updated",
      description: `Successfully updated ${selectedStudents.length} student${selectedStudents.length === 1 ? '' : 's'}.`,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Update Students</DialogTitle>
          <DialogDescription>
            Update information for {selectedStudents.length} selected student{selectedStudents.length === 1 ? '' : 's'}.
            Only filled fields will be updated.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Class ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pre-K">Pre-K</SelectItem>
                      <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                      <SelectItem value="1st">1st Grade</SelectItem>
                      <SelectItem value="2nd">2nd Grade</SelectItem>
                      <SelectItem value="3rd">3rd Grade</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="updateAttendance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Update attendance rate</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            {form.watch("updateAttendance") && (
              <FormField
                control={form.control}
                name="attendanceRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attendance Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" placeholder="Attendance rate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-church-navy hover:bg-church-navy/90">
                Update Students
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
