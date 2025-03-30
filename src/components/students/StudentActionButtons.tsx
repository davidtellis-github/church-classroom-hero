
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentActionButtonsProps {
  onExport: () => void;
}

export function StudentActionButtons({ onExport }: StudentActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <Button className="bg-church-navy hover:bg-church-navy/90">
        <Upload className="mr-2 h-4 w-4" /> Bulk Upload
      </Button>
      <Button variant="outline" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" /> Export
      </Button>
    </div>
  );
}
