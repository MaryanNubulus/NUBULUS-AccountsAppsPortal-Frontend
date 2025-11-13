import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onClear: () => void;
  hasSearchTerm: boolean;
  searchButton: string;
  clearButton: string;
}

export function SearchBar({
  placeholder,
  value,
  onChange,
  onSearch,
  onClear,
  hasSearchTerm,
  searchButton,
  clearButton,
}: SearchBarProps) {
  return (
    <form onSubmit={onSearch} className="mb-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="default">
          <Search className="h-4 w-4 mr-2" />
          {searchButton}
        </Button>
        {hasSearchTerm && (
          <Button type="button" variant="outline" onClick={onClear}>
            <X className="h-4 w-4 mr-2" />
            {clearButton}
          </Button>
        )}
      </div>
    </form>
  );
}
