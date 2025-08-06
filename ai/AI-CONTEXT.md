# AI Development Context

## 🎯 Purpose
This document provides comprehensive context for AI assistants (Claude, Cursor, etc.) working on this multi-template frontend project with Shadcn/ui integration.

## 📁 Project Structure & AI Documentation Location

**IMPORTANT**: All AI-related documentation is centralized in the `/ai/` folder:

```
project1/
├── ai/                          # 🤖 ALL AI documentation goes here
│   ├── AI-CONTEXT.md           # This file - comprehensive AI context
│   ├── PROJECT-STATUS.md       # Current project status and completed features
│   ├── ARCHITECTURE.md         # System architecture overview
│   ├── COMPONENT-GUIDE.md      # Component usage and patterns
│   ├── QUICK-START.md          # Development setup instructions
│   ├── backend-integration-guide.md # Backend integration specifics
│   └── README.md               # AI folder overview
├── CLAUDE.md                   # Build commands and project instructions (root level)
├── frontend-nextjs/            # Next.js app with Shadcn/ui
├── backend/                    # Spring Boot API
└── src/                        # Original Gulp template assets
```

## 🚀 Current Technology Stack

### Frontend
- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (latest)
- **UI Library**: Shadcn/ui (canary version for Tailwind v4 compatibility)
- **Icons**: Lucide React
- **State Management**: React Query (@tanstack/react-query)
- **Components**: Radix UI primitives via Shadcn/ui

### Backend
- **Framework**: Spring Boot 3.4.2
- **Language**: Java 21
- **Database**: H2 (in-memory for development)
- **API**: RESTful endpoints with JSON responses
- **Build Tool**: Maven

### Integration
- **Deployment**: Next.js static export to Spring Boot static resources
- **API Communication**: React Query with TypeScript types
- **Build Process**: Automated frontend build integrated with Maven lifecycle

## 🎨 Shadcn/ui Implementation Details

### Key Components Implemented
- **Table**: User management with sorting, pagination, actions
- **Avatar**: User profile images with fallbacks
- **Badge**: Status indicators (Active, Inactive, Pending)
- **Button**: Primary, secondary, ghost variants
- **Input**: Search and form inputs with proper styling
- **Sheet**: Mobile navigation drawer
- **DropdownMenu**: User actions and navigation
- **Skeleton**: Loading states for data fetching
- **Separator**: Visual element separation

### Design System
- **Colors**: CSS variables with light/dark mode support
- **Typography**: Inter font family with proper weights
- **Spacing**: Consistent padding and margins
- **Responsive**: Mobile-first approach with lg: breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 📡 API Integration

### User Management API
```typescript
// GET /api/users - Returns array of User objects
interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER' | 'MODERATOR';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  avatar: string;
  lastLogin: string; // ISO date string
  createdAt: string; // ISO date string
}
```

### React Query Integration
- **Query Keys**: Consistent structure for caching
- **Error Handling**: Proper error boundaries and fallbacks
- **Loading States**: Skeleton components during data fetching
- **Automatic Refetching**: Background updates for fresh data

## 🔧 Development Workflow

### Build Process
1. **Frontend Development**: `cd frontend-nextjs && npm run dev`
2. **Frontend Production Build**: `npm run build` (exports to Spring Boot)
3. **Backend Development**: `cd backend && mvn spring-boot:run`
4. **Full Production Build**: `mvn clean package -DskipTests`

### File Organization
- **Components**: Organized by feature (dashboard, layouts, ui)
- **Types**: Centralized TypeScript definitions
- **Utils**: Shared utilities and helpers
- **Providers**: React context and query client setup

## 🌐 Deployment Configuration

### Next.js Configuration
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: '../backend/src/main/resources/static/nextjs',
  basePath: '/nextjs',
  images: { unoptimized: true }
};
```

### Spring Boot Static Resources
- **Next.js Build Output**: `backend/src/main/resources/static/nextjs/`
- **Template Assets**: `backend/src/main/resources/static/assets/`
- **Access URLs**: 
  - Dashboard: `http://localhost:8080/nextjs/dashboard/`
  - API: `http://localhost:8080/api/users`

## 🎯 Key Implementation Patterns

### Component Structure
```typescript
// Example: UserTableShadcn.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// ... other Shadcn imports

export default function UserTableShadcn() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  });

  if (isLoading) return <UserTableSkeleton />;
  if (error) return <ErrorState error={error} />;
  
  return (
    <Table>
      {/* Shadcn Table implementation */}
    </Table>
  );
}
```

### Layout Pattern
- **Desktop**: Fixed sidebar with main content area
- **Mobile**: Collapsible Sheet drawer with overlay
- **Responsive**: Hidden sidebar on mobile, drawer trigger button
- **Navigation**: Active state management with Next.js usePathname

## 🐛 Common Issues & Solutions

### Build Issues
- **Multiple lockfiles warning**: Keep only root `package-lock.json`
- **Tailwind v4 compatibility**: Use Shadcn canary version
- **Export path issues**: Ensure Next.js distDir points to Spring Boot static

### Runtime Issues
- **API CORS**: Handled by Spring Boot serving frontend
- **Asset loading**: Use basePath='/nextjs' for all static assets
- **Mobile navigation**: Sheet component requires proper trigger setup

## 📚 Documentation References

### External Resources
- **Shadcn/ui**: https://ui.shadcn.com/docs
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **Next.js 15**: https://nextjs.org/docs
- **React Query**: https://tanstack.com/query/latest/docs/react/overview
- **Spring Boot 3**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/

### Project-Specific Docs
- **CLAUDE.md**: Build commands and immediate instructions
- **PROJECT-STATUS.md**: Current status and completed features
- **ARCHITECTURE.md**: System design and component relationships
- **COMPONENT-GUIDE.md**: Detailed component usage examples

## 🎉 Current Status (Updated August 6, 2025)

### ✅ Completed Features
- Modern Shadcn/ui integration with Tailwind CSS v4
- Responsive user management dashboard
- Spring Boot API with user data endpoints
- Mobile-first responsive design
- Loading states and error handling
- Professional component implementations
- Clean project structure and documentation

### 🔄 Active Development Areas
The core functionality is complete. Future enhancements may include:
- Additional dashboard pages
- User authentication and authorization
- CRUD operations for user management
- Dark mode implementation
- Real-time data updates
- Advanced table features (sorting, filtering)

---

**For AI Assistants**: This document should be referenced for project context. All AI-related documentation is maintained in the `/ai/` folder. When creating new AI documentation, place it here and update this context file accordingly.