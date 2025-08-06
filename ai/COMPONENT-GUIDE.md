# shadcn/ui Component Guide

**Modern Component System**: This project uses shadcn/ui components with Tailwind CSS v4 for a modern, type-safe, and accessible UI.

## Quick Reference

### 🚀 Currently Available Components

| Component | Usage | Location |
|-----------|-------|----------|
| **Table** | Data tables with sorting, pagination | `@/components/ui/table` |
| **Avatar** | User profile images with fallbacks | `@/components/ui/avatar` |
| **Badge** | Status indicators, labels | `@/components/ui/badge` |
| **Button** | Actions, navigation | `@/components/ui/button` |
| **Input** | Form inputs, search | `@/components/ui/input` |
| **Sheet** | Mobile drawers, overlays | `@/components/ui/sheet` |
| **DropdownMenu** | Action menus, navigation | `@/components/ui/dropdown-menu` |
| **Skeleton** | Loading states | `@/components/ui/skeleton` |
| **Separator** | Visual dividers | `@/components/ui/separator` |

---

## Core shadcn/ui Components

### 📊 Data Display Components

#### Table
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Badge variant="outline">{user.status}</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Avatar
```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src={user.avatar} alt={user.name} />
  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
</Avatar>
```

#### Badge
```tsx
import { Badge } from '@/components/ui/badge';

// Variants: default, secondary, destructive, outline
<Badge variant="outline">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Inactive</Badge>
```

### 🎯 Interactive Components

#### Button
```tsx
import { Button } from '@/components/ui/button';

// Variants: default, destructive, outline, secondary, ghost, link
<Button>Primary Action</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Subtle Action</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

#### DropdownMenu
```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 📱 Layout Components

#### Sheet (Mobile Drawer)
```tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="sm">
      <Menu className="h-4 w-4" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-64">
    {/* Sidebar content */}
  </SheetContent>
</Sheet>
```

### 📝 Form Components

#### Input
```tsx
import { Input } from '@/components/ui/input';

<Input
  type="search"
  placeholder="Search users..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

### ⚡ State Components

#### Skeleton (Loading States)
```tsx
import { Skeleton } from '@/components/ui/skeleton';

function UserTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Adding New shadcn/ui Components

### Installation Process
```bash
# Navigate to Next.js frontend
cd frontend-nextjs

# Add a new component (use canary version for Tailwind v4)
npx shadcn@canary add [component-name]

# Examples:
npx shadcn@canary add card
npx shadcn@canary add dialog
npx shadcn@canary add form
npx shadcn@canary add select
```

### Available Components to Add
- **Layout**: Card, Accordion, Tabs, Collapsible
- **Form**: Form, Select, Checkbox, Radio Group, Textarea, Switch
- **Feedback**: Dialog, Alert Dialog, Toast, Alert, Progress
- **Navigation**: Command, Menubar, Breadcrumb, Pagination
- **Data**: Data Table, Calendar, Carousel
- **Overlay**: Popover, Tooltip, HoverCard

---

## Custom Dashboard Components

### Location
Custom components are in `frontend-nextjs/src/components/dashboard/`:

- **`sidebar.tsx`** - Desktop sidebar navigation
- **`mobile-nav.tsx`** - Mobile navigation drawer
- **`user-table-shadcn.tsx`** - User management table
- **`header.tsx`** - Dashboard header

### Pattern for Custom Components
```tsx
// components/dashboard/my-component.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyComponent() {
  const [state, setState] = useState('');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-data'],
    queryFn: () => fetch('/api/my-endpoint').then(res => res.json())
  });

  if (isLoading) return <MyComponentSkeleton />;
  if (error) return <div>Error loading data</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Component</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  );
}

function MyComponentSkeleton() {
  return <Skeleton className="h-32 w-full" />;
}
```

---

## Design System

### Color System
```css
/* CSS Variables for theming */
:root {
  --background: 0 0% 100%;
  --foreground: 224 71.4% 4.1%;
  --primary: 220.9 39.3% 11%;
  --primary-foreground: 210 20% 98%;
  --muted: 220 14.3% 95.9%;
  --muted-foreground: 220 8.9% 46.1%;
}

.dark {
  --background: 224 71.4% 4.1%;
  --foreground: 210 20% 98%;
  /* ... dark mode variables */
}
```

### Typography
```tsx
// Use Tailwind classes for consistent typography
<h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<p className="text-sm text-muted-foreground">Helper text</p>
```

### Spacing & Layout
```tsx
// Consistent spacing patterns
<div className="space-y-4">        {/* Vertical spacing */}
<div className="space-x-2">        {/* Horizontal spacing */}
<div className="p-4">              {/* Padding */}
<div className="m-2">              {/* Margin */}
<div className="gap-4">            {/* Grid/flex gap */}
```

---

## Responsive Design

### Breakpoints
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)
- **Large**: `xl:` (1280px+)

### Mobile-First Example
```tsx
<div className="
  w-full          // Full width on mobile
  md:w-1/2        // Half width on tablet+
  lg:w-1/3        // Third width on desktop+
  p-4             // Padding on all screens
  md:p-6          // Larger padding on tablet+
">
  {/* Content */}
</div>
```

---

## Best Practices

### Component Organization
1. **Keep components focused** - Single responsibility
2. **Use TypeScript** - Define proper interfaces
3. **Handle loading states** - Always provide skeleton loading
4. **Error boundaries** - Handle API errors gracefully
5. **Accessibility** - Use semantic HTML and ARIA labels

### Performance
1. **Use React Query** - For API state management
2. **Optimize re-renders** - Memoize expensive operations
3. **Lazy loading** - Split large components
4. **Bundle optimization** - Import only what you need

### Code Example (Best Practices)
```tsx
'use client';

import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

interface Props {
  searchTerm?: string;
}

const UserTable = memo(function UserTable({ searchTerm = '' }: Props) {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users', searchTerm],
    queryFn: async () => {
      const url = searchTerm 
        ? `/api/users?search=${encodeURIComponent(searchTerm)}`
        : '/api/users';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json() as User[];
    }
  });

  if (isLoading) return <UserTableSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!users?.length) return <EmptyState />;

  return (
    <Table>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={getBadgeVariant(user.status)}>
                {user.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

export default UserTable;
```

---

## Migration from Legacy Templates

### From Old Template System
The project has migrated from a multi-template system to modern shadcn/ui components:

**Old Way (Archived):**
- Static HTML templates
- jQuery for interactions
- Bootstrap CSS framework
- Gulp build system

**New Way (Current):**
- React components with TypeScript
- shadcn/ui + Tailwind CSS v4
- Next.js with App Router
- Modern build tools

### Finding Equivalent Components
| Old Template Element | New shadcn/ui Component |
|---------------------|------------------------|
| Bootstrap Tables | Table component |
| Bootstrap Cards | Card component |
| Bootstrap Modals | Dialog component |
| Bootstrap Buttons | Button component |
| Bootstrap Forms | Form components |
| Bootstrap Alerts | Alert component |

This modern approach provides better performance, accessibility, type safety, and developer experience.