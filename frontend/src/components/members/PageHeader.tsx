'use client';

import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, Download, Upload } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  totalCount?: number;
  onAddMember?: () => void;
  onExport?: () => void;
  onImport?: () => void;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  totalCount,
  onAddMember,
  onExport,
  onImport,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
          {totalCount !== undefined && (
            <span className="ml-2 text-muted-foreground text-lg font-normal">
              ({totalCount})
            </span>
          )}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {onImport && (
          <Button variant="outline" onClick={onImport}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        )}
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
        {onAddMember && (
          <Button onClick={onAddMember}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        )}
      </div>
    </div>
  );
};