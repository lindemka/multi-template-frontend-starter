# Questions Log - Information Gaps & Assumptions

## Purpose
This document tracks questions that arise during development where information is missing. Each question includes:
- Context of why it's needed
- Assumption made to continue working
- Priority level (Critical/High/Medium/Low)
- Answer when provided

---

## Critical Questions (Need Immediate Answers)

### Q1: Production Database Choice
**Context**: Need to migrate from H2 to production database
**Assumption**: Using PostgreSQL 14+ based on planning docs
**Priority**: CRITICAL
**Status**: Assumed PostgreSQL
**Answer**: _Pending_

### Q2: User Migration Approach
**Context**: 2,000 existing users need migration, but unclear if system is live
**Question**: Is the current system in production? Can we have downtime for migration?
**Assumption**: System is live, need zero-downtime migration
**Priority**: CRITICAL
**Status**: Open
**Answer**: _Pending_

---

## High Priority Questions

### Q3: Authentication Provider Preferences
**Context**: OAuth implementation planned
**Question**: Which OAuth providers are priority? (Google, LinkedIn, GitHub, others?)
**Assumption**: Google first (most common), then LinkedIn (professional network)
**Priority**: HIGH
**Status**: Open
**Answer**: _Pending_

### Q4: File Storage Solution
**Context**: Need to store avatars, documents, pitch decks
**Question**: AWS S3, DigitalOcean Spaces, or self-hosted MinIO?
**Assumption**: S3-compatible API, specific provider TBD
**Priority**: HIGH
**Status**: Open
**Answer**: _Pending_

### Q5: Email Service Provider
**Context**: Need email for verification, password reset, notifications
**Question**: SendGrid, AWS SES, Postmark, or other?
**Assumption**: Any SMTP-compatible service, configure via environment variables
**Priority**: HIGH
**Status**: Open
**Answer**: _Pending_

---

## Medium Priority Questions

### Q6: Domain and Subdomain Strategy
**Context**: Planning shows country-based subdomains (de.foundersbase.com)
**Question**: Is the domain foundersbase.com secured? Which countries to launch first?
**Assumption**: Domain available, starting with DE (Germany) as primary
**Priority**: MEDIUM
**Status**: Open
**Answer**: _Pending_

### Q7: Caching Strategy Details
**Context**: Redis planned for caching
**Question**: Hosted Redis (Redis Cloud, AWS ElastiCache) or self-managed?
**Assumption**: Start with local Redis, cloud service for production
**Priority**: MEDIUM
**Status**: Open
**Answer**: _Pending_

### Q8: Search Requirements
**Context**: PostgreSQL full-text search initially planned
**Question**: What's the expected search volume? When to migrate to Elasticsearch?
**Assumption**: < 100k searchable documents initially, PostgreSQL sufficient
**Priority**: MEDIUM
**Status**: Open
**Answer**: _Pending_

---

## Low Priority Questions

### Q9: Monitoring and Analytics
**Context**: Need production monitoring
**Question**: Preference for monitoring stack? (Datadog, New Relic, self-hosted Grafana?)
**Assumption**: Start with free tiers (Sentry for errors, Prometheus/Grafana for metrics)
**Priority**: LOW
**Status**: Open
**Answer**: _Pending_

### Q10: CI/CD Platform
**Context**: Need automated deployment pipeline
**Question**: GitHub Actions, GitLab CI, Jenkins, or other?
**Assumption**: GitHub Actions (already using GitHub)
**Priority**: LOW
**Status**: Open
**Answer**: _Pending_

### Q11: Testing Coverage Requirements
**Context**: No tests currently exist
**Question**: Target coverage percentage? Focus areas?
**Assumption**: 80% coverage for critical paths (auth, payments), 60% overall
**Priority**: LOW
**Status**: Open
**Answer**: _Pending_

---

## Technical Decisions Made Without Full Context

### Assumed Technologies
1. **PostgreSQL 14+** - For main database (vs MySQL, MongoDB)
2. **Redis** - For caching (vs Memcached, Hazelcast)
3. **JWT** - For authentication (vs sessions, OAuth only)
4. **Docker** - For containerization (vs traditional deployment)
5. **Spring Boot 3.x** - Continuing with current choice
6. **Next.js 15** - Continuing with current choice

### Assumed Business Rules
1. **Email verification required** - Before users can fully use platform
2. **Multi-persona per user** - Users can be both founder and investor
3. **Organization multi-founder** - Multiple founders can own one startup
4. **Global platform** - Not restricted to one country/region
5. **Freemium model** - Basic features free, premium features paid

---

## How to Use This Document

1. **When you encounter a question**: Add it here with context and assumption
2. **Priority Levels**:
   - CRITICAL: Blocks development, need answer ASAP
   - HIGH: Important for next sprint
   - MEDIUM: Need answer within 2-4 weeks  
   - LOW: Nice to know, not blocking

3. **Making Assumptions**: 
   - Document what you assumed
   - Build in flexibility to change later
   - Use environment variables and interfaces

4. **Getting Answers**:
   - Review in weekly meetings
   - Escalate CRITICAL immediately
   - Update when answered

---

## Questions for Next Meeting

1. Production hosting environment (AWS, GCP, Azure, DigitalOcean)?
2. Budget constraints for third-party services?
3. Compliance requirements (GDPR, SOC2, others)?
4. Target launch date for boilerplate?
5. Team size and skill sets available?