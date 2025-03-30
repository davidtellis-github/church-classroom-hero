
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileUp, AlertCircle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudentBulkUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onStudentsImported: (newStudents: any[]) => void;
}

export function StudentBulkUploadDialog({
  open,
  setOpen,
  onStudentsImported,
}: StudentBulkUploadDialogProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setErrors(['Please upload a CSV file']);
      return;
    }

    setFile(file);
    setErrors([]);
    setIsValidating(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = parseCSV(content);
        if (parsed.length === 0) {
          setErrors(['No data found in the CSV file']);
        } else {
          validateData(parsed);
        }
      } catch (error) {
        setErrors(['Failed to parse the CSV file']);
      } finally {
        setIsValidating(false);
      }
    };

    reader.onerror = () => {
      setErrors(['Failed to read the file']);
      setIsValidating(false);
    };

    reader.readAsText(file);
  };

  const parseCSV = (content: string): any[] => {
    const lines = content.split("\n");
    if (lines.length <= 1) return [];
    
    const headers = lines[0].split(",").map(h => h.trim());
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(",").map(v => v.trim());
      if (values.length === headers.length) {
        const entry: Record<string, string> = {};
        headers.forEach((header, index) => {
          entry[header] = values[index];
        });
        data.push(entry);
      }
    }
    
    return data;
  };

  const validateData = (data: any[]) => {
    const validationErrors = [];
    const requiredFields = ["name", "age", "grade", "parentName", "phone"];
    
    for (let i = 0; i < data.length; i++) {
      const student = data[i];
      
      // Check required fields
      for (const field of requiredFields) {
        if (!student[field]) {
          validationErrors.push(`Row ${i + 1}: Missing ${field}`);
        }
      }
      
      // Validate age is a number
      if (student.age && isNaN(Number(student.age))) {
        validationErrors.push(`Row ${i + 1}: Age must be a number`);
      }
      
      // Add more validations as needed
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
    } else {
      const processedData = data.map(student => ({
        ...student,
        id: student.id || crypto.randomUUID(),
        age: Number(student.age),
        attendanceRate: student.attendanceRate ? Number(student.attendanceRate) : 100,
        classId: student.classId || "class-1",
      }));
      
      setParsedData(processedData);
    }
  };

  const handleImport = () => {
    if (parsedData.length === 0) return;
    
    onStudentsImported(parsedData);
    toast({
      title: "Import Successful",
      description: `${parsedData.length} students have been imported.`,
    });
    
    // Reset state and close dialog
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Upload Students</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add multiple students at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {!file && (
            <div
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-2">
                <FileUp className="h-10 w-10 text-muted-foreground/70" />
                <p className="text-sm font-medium">
                  Drag and drop your CSV file here, or{" "}
                  <label className="text-primary cursor-pointer hover:underline">
                    browse
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground">
                  Your CSV must include: name, age, grade, parentName, phone
                </p>
              </div>
            </div>
          )}

          {file && (
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setParsedData([]);
                    setErrors([]);
                  }}
                >
                  Change
                </Button>
              </div>

              {isValidating && (
                <div className="mt-2 text-sm text-muted-foreground animate-pulse">
                  Validating file...
                </div>
              )}

              {!isValidating && parsedData.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  Found {parsedData.length} valid student records
                </div>
              )}

              {errors.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Found {errors.length} validation issues
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {errors.slice(0, 5).map((error, i) => (
                      <p key={i} className="text-xs text-destructive">
                        {error}
                      </p>
                    ))}
                    {errors.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        ... and {errors.length - 5} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!parsedData.length || errors.length > 0}
            >
              Import Students
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
