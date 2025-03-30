
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ClassesActionButtonsProps {
  onExport: () => void;
  isMobile: boolean;
  BulkUploadTrigger: React.FC<{ children: React.ReactNode }>;
  BulkUploadContent: React.FC;
}

export function ClassesActionButtons({ 
  onExport, 
  isMobile, 
  BulkUploadTrigger,
  BulkUploadContent 
}: ClassesActionButtonsProps) {
  return (
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
              <DrawerTitle>
                <Button variant="outline">Cancel</Button>
              </DrawerTitle>
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
          </DialogContent>
        </Dialog>
      )}
      
      <Button variant="outline" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" /> Export
      </Button>
    </div>
  );
}
