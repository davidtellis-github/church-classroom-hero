
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { StudentBulkUploadDialog } from "./StudentBulkUploadDialog";

interface StudentActionButtonsProps {
  onExport: () => void;
  onStudentsImported: (newStudents: any[]) => void;
}

export function StudentActionButtons({ onExport, onStudentsImported }: StudentActionButtonsProps) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <div className="flex space-x-2">
      <Button 
        className="bg-church-navy hover:bg-church-navy/90"
        onClick={() => setUploadDialogOpen(true)}
      >
        <Upload className="mr-2 h-4 w-4" /> Bulk Upload
      </Button>
      <Button variant="outline" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" /> Export
      </Button>
      
      <StudentBulkUploadDialog 
        open={uploadDialogOpen} 
        setOpen={setUploadDialogOpen} 
        onStudentsImported={onStudentsImported}
      />
    </div>
  );
}
