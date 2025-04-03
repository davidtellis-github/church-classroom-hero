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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Search, Upload, Download, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Mock data
const mockClasses = Array.from({ length: 12 }, (_, i) => ({
  id: `CLS${1000 + i}`,
  name: `${["Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade"][Math.floor(Math.random() * 5)]} Class ${String.fromCharCode(65 + Math.floor(i / 3))}`,
  location: `Room ${100 + i}`,
  day: ["Sunday", "Wednesday"][Math.floor(Math.random() * 2)],
  time: `${9 + Math.floor(i / 4)}:${Math.random() > 0.5 ? "00" : "30"} ${i < 8 ? "AM" : "PM"}`,
  teacherName: `Teacher ${i + 1}`,
  studentCount: Math.floor(Math.random() * 15) + 5,
}));

// Class form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Class name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  day: z.string().min(2, {
    message: "Day is required.",
  }),
  time: z.string().min(2, {
    message: "Time is required.",
  }),
  teacherName: z.string().min(2, {
    message: "Teacher name must be at least 2 characters.",
  }),
});

// CSV upload schema
const csvSchema = z.object({
  csvContent: z.string().min(10, {
    message: "CSV content must not be empty and follow required format.",
  }),
});

const ClassesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState(mockClasses);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Form for adding new class
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      day: "Sunday",
      time: "9:00 AM",
      teacherName: "",
    },
  });

  // Form for CSV upload
  const csvForm = useForm<z.infer<typeof csvSchema>>({
    resolver: zodResolver(csvSchema),
    defaultValues: {
      csvContent: "",
    },
  });

  // Filter classes based on search query
  const filteredClasses = classes.filter(
    classItem => 
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      classItem.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submission for adding a new class
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newClass = {
      id: `CLS${1000 + classes.length}`,
      name: values.name,
      location: values.location,
      day: values.day,
      time: values.time,
      teacherName: values.teacherName,
      studentCount: 0,
    };
    
    setClasses([...classes, newClass]);
    toast({
      title: "Class Added",
      description: `${values.name} has been added successfully.`,
    });
    form.reset();
  };

  // Parse CSV content
  const parseCSV = (content: string) => {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Expected headers
    const expectedHeaders = ['name', 'location', 'day', 'time', 'teacherName'];
    
    // Validate headers
    const errors: string[] = [];
    const isHeaderValid = expectedHeaders.every(header => 
      headers.includes(header)
    );
    
    if (!isHeaderValid) {
      errors.push(`Invalid headers. Expected: ${expectedHeaders.join(', ')}`);
      setCsvErrors(errors);
      return [];
    }
    
    // Parse rows
    const parsedRows = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length !== headers.length) {
        errors.push(`Line ${i + 1}: Expected ${headers.length} values but got ${values.length}`);
        continue;
      }
      
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      
      // Validate row data
      if (!row.name || row.name.length < 2) {
        errors.push(`Line ${i + 1}: Class name must be at least 2 characters`);
      }
      if (!row.location || row.location.length < 2) {
        errors.push(`Line ${i + 1}: Location must be at least 2 characters`);
      }
      if (!row.day || !['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(row.day)) {
        errors.push(`Line ${i + 1}: Day must be a valid day of the week`);
      }
      if (!row.time || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*(AM|PM)$/i.test(row.time)) {
        errors.push(`Line ${i + 1}: Time must be in format HH:MM AM/PM`);
      }
      if (!row.teacherName || row.teacherName.length < 2) {
        errors.push(`Line ${i + 1}: Teacher name must be at least 2 characters`);
      }
      
      if (errors.length === 0) {
        parsedRows.push(row);
      }
    }
    
    setCsvErrors(errors);
    return parsedRows;
  };

  // Handle CSV form submission
  const onCsvSubmit = (values: z.infer<typeof csvSchema>) => {
    const parsedRows = parseCSV(values.csvContent);
    setCsvPreview(parsedRows);
    
    if (csvErrors.length === 0 && parsedRows.length > 0) {
      // Add new classes
      const newClasses = parsedRows.map((row, index) => ({
        id: `CLS${1000 + classes.length + index}`,
        name: row.name,
        location: row.location,
        day: row.day,
        time: row.time,
        teacherName: row.teacherName,
        studentCount: 0,
      }));
      
      setClasses([...classes, ...newClasses]);
      toast({
        title: "Classes Imported",
        description: `Successfully imported ${parsedRows.length} classes.`,
      });
      csvForm.reset();
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      csvForm.setValue('csvContent', content);
      const parsedRows = parseCSV(content);
      setCsvPreview(parsedRows);
    };

    reader.readAsText(file);
  };

  // Handle CSV import confirmation
  const confirmCsvImport = () => {
    if (csvErrors.length === 0 && csvPreview.length > 0) {
      // Add new classes
      const newClasses = csvPreview.map((row, index) => ({
        id: `CLS${1000 + classes.length + index}`,
        name: row.name,
        location: row.location,
        day: row.day,
        time: row.time,
        teacherName: row.teacherName,
        studentCount: 0,
      }));
      
      setClasses([...classes, ...newClasses]);
      toast({
        title: "Classes Imported",
        description: `Successfully imported ${csvPreview.length} classes.`,
      });
      csvForm.reset();
      setCsvPreview([]);
    }
  };

  // Sample CSV template
  const csvTemplate = `name,location,day,time,teacherName
Kindergarten Class A,Room 101,Sunday,9:00 AM,Teacher 1
1st Grade Class B,Room 102,Sunday,10:30 AM,Teacher 2
2nd Grade Class C,Room 103,Wednesday,6:00 PM,Teacher 3`;

  // Bulk upload UI based on device
  const BulkUploadTrigger = ({ children }: { children: React.ReactNode }) => {
    if (isMobile) {
      return <DrawerTrigger asChild>{children}</DrawerTrigger>;
    }
    return <DialogTrigger asChild>{children}</DialogTrigger>;
  };

  const BulkUploadContent = () => (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="file-upload">Upload CSV File</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Upload a CSV file with columns: name, location, day, time, teacherName
          </p>
        </div>

        <div className="border-t pt-4">
          <Label htmlFor="csv-content">Or paste CSV content</Label>
          <Form {...csvForm}>
            <form onSubmit={csvForm.handleSubmit(onCsvSubmit)} className="space-y-4">
              <FormField
                control={csvForm.control}
                name="csvContent"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Paste CSV content here..."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Parse CSV</Button>
            </form>
          </Form>
        </div>

        {csvPreview.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Preview ({csvPreview.length} classes)</h3>
            <div className="max-h-60 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Teacher</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvPreview.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.day}</TableCell>
                      <TableCell>{row.time}</TableCell>
                      <TableCell>{row.teacherName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {csvErrors.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-lg font-medium">Validation Errors</h3>
            </div>
            <ul className="list-disc list-inside mt-2 text-sm text-destructive space-y-1">
              {csvErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-2">CSV Template</h3>
          <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">{csvTemplate}</pre>
          <Button
            variant="outline"
            className="mt-2 w-full"
            onClick={() => {
              navigator.clipboard.writeText(csvTemplate);
              toast({
                title: "Template Copied",
                description: "CSV template copied to clipboard.",
              });
            }}
          >
            Copy Template
          </Button>
        </div>
      </div>

      {csvPreview.length > 0 && csvErrors.length === 0 && (
        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>CSV is valid</span>
          </div>
          <Button onClick={confirmCsvImport} className="bg-church-navy hover:bg-church-navy/90">
            Import {csvPreview.length} Classes
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
          <p className="text-muted-foreground">
            Manage church school classes and teacher assignments
          </p>
        </div>
        <div className="flex space-x-2">
          {isMobile ? (
            <Drawer>
              <BulkUploadTrigger>
                <Button className="bg-church-navy hover:bg-church-navy/90">
                  <Upload className="mr-2 h-4 w-4" /> Bulk Upload
                </Button>
              </BulkUploadTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Bulk Upload Classes</DrawerTitle>
                  <DrawerDescription>
                    Upload multiple classes at once using a CSV file
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 py-2">
                  <BulkUploadContent />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog>
              <BulkUploadTrigger>
                <Button className="bg-church-navy hover:bg-church-navy/90">
                  <Upload className="mr-2 h-4 w-4" /> Bulk Upload
                </Button>
              </BulkUploadTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Upload Classes</DialogTitle>
                  <DialogDescription>
                    Upload multiple classes at once using a CSV file
                  </DialogDescription>
                </DialogHeader>
                <BulkUploadContent />
                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Classes List</CardTitle>
          <CardDescription>
            View and manage all church classes
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
                  <Plus className="mr-2 h-4 w-4" /> Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new class below.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Kindergarten Class A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Room 101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="day"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Day</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Sunday" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 9:00 AM" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="teacherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teacher</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit" className="bg-church-navy hover:bg-church-navy/90">
                        Add Class
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">{classItem.id}</TableCell>
                      <TableCell>{classItem.name}</TableCell>
                      <TableCell>{classItem.location}</TableCell>
                      <TableCell>{classItem.day}</TableCell>
                      <TableCell>{classItem.time}</TableCell>
                      <TableCell>{classItem.teacherName}</TableCell>
                      <TableCell>{classItem.studentCount}</TableCell>
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
