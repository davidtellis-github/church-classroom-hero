
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StudentSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function StudentSearchBar({ searchQuery, setSearchQuery }: StudentSearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search students..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
