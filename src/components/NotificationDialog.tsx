
import { useState } from "react";
import { AbsentStudent } from "@/utils/absentStudentsMock";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

interface NotificationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  student: AbsentStudent | null;
}

export function NotificationDialog({ open, setOpen, student }: NotificationDialogProps) {
  const { toast } = useToast();
  const [method, setMethod] = useState<"email" | "sms" | "both">("both");
  const [message, setMessage] = useState("");

  // Set default message when student changes
  if (student && !message) {
    setMessage(
      `Dear ${student.parent.name},\n\nWe wanted to inform you that ${student.name} has been absent from ${student.class} for a significant number of sessions (${student.absenceRate}% absence rate). The last attendance was on ${student.lastAttendance}.\n\nPlease contact us if you have any questions or concerns.\n\nBest regards,\nChurch Classroom Administration`
    );
  }

  const handleSendNotification = () => {
    if (!student) return;
    
    // In a real app, this would call an API to send notifications
    const methodText = method === "both" 
      ? "email and SMS" 
      : method === "email" ? "email" : "SMS";
    
    toast({
      title: "Notification sent",
      description: `Notification sent to ${student.parent.name} via ${methodText}.`,
    });
    
    // Close dialog and reset state
    setOpen(false);
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Parent Notification</DialogTitle>
          <DialogDescription>
            {student ? `Notify ${student.parent.name} about ${student.name}'s absence` : ""}
          </DialogDescription>
        </DialogHeader>
        
        {student && (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="notification-method">Notification Method</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="method-email" 
                      checked={method === "email" || method === "both"} 
                      onCheckedChange={(checked) => {
                        if (checked && method === "sms") setMethod("both");
                        else if (checked) setMethod("email");
                        else if (method === "both") setMethod("sms");
                        else setMethod("sms");
                      }}
                    />
                    <label
                      htmlFor="method-email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email ({student.parent.email})
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="method-sms" 
                      checked={method === "sms" || method === "both"} 
                      onCheckedChange={(checked) => {
                        if (checked && method === "email") setMethod("both");
                        else if (checked) setMethod("sms");
                        else if (method === "both") setMethod("email");
                        else setMethod("email");
                      }}
                    />
                    <label
                      htmlFor="method-sms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      SMS ({student.parent.phone})
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={10}
                  className="resize-none"
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                onClick={handleSendNotification}
                disabled={!message.trim()}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
