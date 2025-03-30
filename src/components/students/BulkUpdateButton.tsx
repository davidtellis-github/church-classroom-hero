
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkUpdateButtonProps {
  selectedCount: number;
  onClick: () => void;
}

export function BulkUpdateButton({ selectedCount, onClick }: BulkUpdateButtonProps) {
  if (selectedCount === 0) return null;
  
  return (
    <Button 
      variant="outline" 
      className="border-amber-500 text-amber-500 hover:bg-amber-50"
      onClick={onClick}
    >
      <RefreshCcw className="mr-2 h-4 w-4" /> 
      Bulk Update ({selectedCount})
    </Button>
  );
}
