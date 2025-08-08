# 🔨 Refactoring Examples

## Backend: DataMigrationService Refactoring

### Current Issue
The `DataMigrationService.java` file is 381 lines with hardcoded data.

### Proposed Solution

#### 1. Extract Data Factory
```java
// MemberDataFactory.java
@Component
public class MemberDataFactory {
    
    public List<Member> createFounders() {
        return Arrays.asList(
            createFounder("Ahmed Salman", "NYC", "Growth Expert"),
            createFounder("Andy Mitchell", "SF", "CEO TravelTech")
        );
    }
    
    public List<Member> createInvestors() {
        return Arrays.asList(
            createInvestor("Sophia Martinez", "Miami", "Hospitality"),
            createInvestor("Michael Thompson", "Boston", "EdTech")
        );
    }
    
    private Member createFounder(String name, String location, String role) {
        // Builder pattern for clean construction
        return Member.builder()
            .name(name)
            .location(location)
            .role(role)
            .type(MemberType.FOUNDER)
            .build();
    }
}
```

#### 2. Separate Migration Logic
```java
// MigrationService.java
@Service
@Profile("postgres")
public class MigrationService {
    
    private final MemberRepository repository;
    private final MemberDataFactory dataFactory;
    
    @Transactional
    public void migrate() {
        if (shouldMigrate()) {
            clearExistingData();
            loadInitialData();
        }
    }
    
    private void loadInitialData() {
        repository.saveAll(dataFactory.createFounders());
        repository.saveAll(dataFactory.createInvestors());
    }
}
```

#### 3. Use JSON/YAML for Data
```yaml
# resources/data/members.yaml
members:
  founders:
    - name: Ahmed Salman
      location: New York City, US
      tagline: Growth Marketing Expert
      interests:
        - AI & Machine Learning
        - Software & SaaS
  investors:
    - name: Sophia Martinez
      location: Miami, US
      company: Hospitality Ventures
      investmentRange: 500K-5M
```

## Frontend: Members Page Refactoring

### Current Issue
The `members/page.tsx` file is 770 lines with mixed concerns.

### Proposed Solution

#### 1. Extract Custom Hooks
```typescript
// hooks/useMembers.ts
export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({});
  
  const { data, error, mutate } = useSWR(
    `/api/members?${buildQueryString(filters)}`,
    fetcher
  );
  
  return {
    members: data?.members || [],
    loading: !data && !error,
    error,
    filters,
    setFilters,
    refresh: mutate
  };
};
```

#### 2. Extract Filter Component
```typescript
// components/members/MemberFilters.tsx
export const MemberFilters: FC<FilterProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  return (
    <Card>
      <CardContent className="space-y-4">
        <SearchInput 
          value={filters.search}
          onChange={(search) => onFilterChange({ search })}
        />
        <GoalsFilter 
          selected={filters.goals}
          onChange={(goals) => onFilterChange({ goals })}
        />
        <LocationFilter 
          value={filters.location}
          onChange={(location) => onFilterChange({ location })}
        />
      </CardContent>
    </Card>
  );
};
```

#### 3. Extract Table Component
```typescript
// components/members/MembersTable.tsx
export const MembersTable: FC<TableProps> = ({ 
  members, 
  loading,
  onMemberClick 
}) => {
  if (loading) return <TableSkeleton />;
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Goals</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map(member => (
          <MemberRow 
            key={member.id}
            member={member}
            onClick={onMemberClick}
          />
        ))}
      </TableBody>
    </Table>
  );
};
```

#### 4. Simplified Main Component
```typescript
// app/dashboard/members/page.tsx
export default function MembersPage() {
  const { members, loading, filters, setFilters } = useMembers();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  return (
    <div className="container py-6">
      <PageHeader 
        title="Members"
        description="Connect with founders and investors"
      />
      
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3">
          <MemberFilters 
            filters={filters}
            onFilterChange={setFilters}
          />
        </aside>
        
        <main className="col-span-9">
          <MembersTable 
            members={members}
            loading={loading}
            onMemberClick={setSelectedMember}
          />
        </main>
      </div>
      
      <MemberDrawer 
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
```

## Database Optimization Examples

### 1. Add Proper Indexes
```sql
-- Create indexes for common queries
CREATE INDEX idx_member_email ON members(email);
CREATE INDEX idx_member_status ON members(status);
CREATE INDEX idx_member_created_at ON members(created_at);
CREATE INDEX idx_member_location_status ON members(location, status);

-- Composite index for search
CREATE INDEX idx_member_search ON members 
  USING gin(to_tsvector('english', name || ' ' || tagline || ' ' || about));
```

### 2. Optimize JPA Queries
```java
// MemberRepository.java
@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    
    // Use JOIN FETCH to avoid N+1
    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.skills WHERE m.status = :status")
    List<Member> findActiveWithSkills(@Param("status") Status status);
    
    // Paginated query with projection
    @Query("SELECT new com.example.dto.MemberSummary(m.id, m.name, m.location) FROM Member m")
    Page<MemberSummary> findAllSummaries(Pageable pageable);
    
    // Native query for complex search
    @Query(value = "SELECT * FROM members WHERE " +
           "to_tsvector('english', name || ' ' || tagline) @@ plainto_tsquery(:query)",
           nativeQuery = true)
    List<Member> searchMembers(@Param("query") String query);
}
```

### 3. Implement Caching
```java
// CacheConfig.java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
            new ConcurrentMapCache("members"),
            new ConcurrentMapCache("memberDetails"),
            new ConcurrentMapCache("filters")
        ));
        return cacheManager;
    }
}

// MemberService.java
@Service
public class MemberService {
    
    @Cacheable(value = "members", key = "#filters.toString()")
    public List<Member> findMembers(FilterCriteria filters) {
        return memberRepository.findByFilters(filters);
    }
    
    @CacheEvict(value = "members", allEntries = true)
    public Member updateMember(Long id, MemberDto dto) {
        // Update logic
    }
}
```

## Performance Optimization Examples

### 1. Frontend Bundle Splitting
```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/*']
  },
  
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
          priority: 20
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    };
    return config;
  }
};
```

### 2. API Response Optimization
```java
// Add compression
@Configuration
public class CompressionConfig {
    
    @Bean
    public FilterRegistrationBean<CompressingFilter> compressingFilter() {
        FilterRegistrationBean<CompressingFilter> registration = 
            new FilterRegistrationBean<>();
        registration.setFilter(new CompressingFilter());
        registration.addUrlPatterns("/api/*");
        return registration;
    }
}

// Add pagination
@RestController
public class MemberController {
    
    @GetMapping("/api/members")
    public ResponseEntity<Page<MemberDto>> getMembers(
        @PageableDefault(size = 20, sort = "createdAt,desc") Pageable pageable,
        @RequestParam(required = false) String search
    ) {
        Page<Member> members = memberService.findPaginated(search, pageable);
        Page<MemberDto> dtos = members.map(MemberDto::fromEntity);
        
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(1, TimeUnit.MINUTES))
            .body(dtos);
    }
}
```

### 3. Database Connection Pool Optimization
```properties
# application.properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1200000
spring.datasource.hikari.auto-commit=false

# JPA optimization
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
spring.jpa.properties.hibernate.jdbc.batch_versioned_data=true
```

## Testing Strategy

### 1. Unit Tests for Refactored Components
```typescript
// MemberFilters.test.tsx
describe('MemberFilters', () => {
  it('should call onFilterChange when search input changes', () => {
    const onFilterChange = jest.fn();
    const { getByPlaceholderText } = render(
      <MemberFilters filters={{}} onFilterChange={onFilterChange} />
    );
    
    fireEvent.change(getByPlaceholderText('Search members...'), {
      target: { value: 'founder' }
    });
    
    expect(onFilterChange).toHaveBeenCalledWith({ search: 'founder' });
  });
});
```

### 2. Integration Tests
```java
@SpringBootTest
@AutoConfigureMockMvc
class MemberControllerIntegrationTest {
    
    @Test
    void shouldReturnPaginatedMembers() throws Exception {
        mockMvc.perform(get("/api/members?page=0&size=10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.totalElements").exists())
            .andExpect(jsonPath("$.pageable.pageSize").value(10));
    }
}
```

### 3. Performance Tests
```javascript
// lighthouse-config.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/dashboard/members'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
  },
};
```

---

*These examples demonstrate practical refactoring patterns that can be applied throughout the codebase to improve maintainability, performance, and code quality.*