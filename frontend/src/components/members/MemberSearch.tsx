'use client';

import { FC, useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { debounce } from '@/lib/utils';

interface MemberSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MemberSearch: FC<MemberSearchProps> = ({ 
  value, 
  onChange,
  placeholder = "Search members by name, location, or skills..."
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      onChange(searchValue);
    }, 300),
    [onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {localValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};