
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, UserPlus } from "lucide-react";

// Mock data
const mockTeachers = [
  { id: "T001", name: "Sarah Johnson", email: "sarah.j@example.com", phone: "(555) 123-4567", classes: ["Toddlers", "Wednesday Toddlers"], status: "Active" },
  { id: "T002", name: "Michael Williams", email: "m.williams@example.com", phone: "(555) 234-5678", classes: ["Pre-K", "Wednesday Pre-K"], status: "Active" },
  { id: "T003", name: "Emily Davis", email: "emily.d@example.com", phone: "(555) 345-6789", classes: ["K-2nd Grade"], status: "Active" },
  { id: "T004", name: "Robert Brown", email: "r.brown@example.com", phone: "(555) 456-7890", classes: ["3rd-5th Grade"], status: "Active" },
  { id: "T005", name: "Jennifer Wilson", email: "j.wilson@example.com", phone: "(555) 567-8901", classes: ["Middle School"], status: "Active" },
  { id: "T006", name: "David Miller", email: "d.miller@example.com", phone: "(555) 678-9012", classes: ["High School"], status: "Active" },
  { id: "T007", name: "Lisa Garcia", email: "l.garcia@example.com", phone: "(555) 789-0123", classes: [], status: "Inactive" },
  { id: "T008", name: "John Martinez", email: "j.martinez@example.com", phone: "(555) 890-1234", classes: [], status: "Inactive" },
];

const TeachersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState(mockTeachers);
  
  const filteredTeachers = teachers.filter(
    teacher => 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      teacher.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
          <p className="text-muted-foreground">
            Manage teacher information and class assignments
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Teachers List</CardTitle>
          <CardDescription>
            View and manage all teachers in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search teachers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-church-navy hover:bg-church-navy/90">
                  <UserPlus className="mr-2 h-4 w-4" /> Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new teacher below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" type="email" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input id="phone" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input id="password" type="password" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-church-navy hover:bg-church-navy/90">
                    Add Teacher
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.id}</TableCell>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell>
                        {teacher.classes.length > 0 ? 
                          teacher.classes.join(", ") : 
                          <span className="text-muted-foreground">None assigned</span>
                        }
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          teacher.status === "Active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {teacher.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" className="h-8 w-8 p-0" title="Edit">
                          <span className="sr-only">Edit</span>
                          <span className="h-4 w-4">✏️</span>
                        </Button>
                        <Button variant="ghost" className="h-8 w-8 p-0" title="Reset Password">
                          <span className="sr-only">Reset Password</span>
                          <span className="h-4 w-4">🔑</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No teachers found.
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

export default TeachersPage;
