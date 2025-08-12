# fbase

A full-stack application: Spring Boot backend + Next.js frontend using shadcn/ui.

## Prerequisites

- Java 21 (via jenv recommended): `eval "$(jenv init -)" && jenv local 21 && jenv shell 21`
- Node.js 22.x and npm
- Maven 3.9+

## Quick Start (Development)

```bash
# From project root
./scripts/dev.sh           # start backend (8080) + frontend (3000)
./scripts/status.sh        # check what's running
./scripts/dev.sh stop      # stop both
```

## Testing

The project uses Playwright for end-to-end testing with a consolidated testing strategy.

### Quick Commands

```bash
# Run all tests
./scripts/test.sh all

# Run specific test categories
./scripts/test.sh basic      # Basic application tests
./scripts/test.sh auth       # Authentication tests
./scripts/test.sh messages   # Messages functionality tests
./scripts/test.sh chat       # Chat interface tests
./scripts/test.sh members    # Members page tests
./scripts/test.sh account    # Account management tests

# Run tests in different modes
./scripts/test.sh ui         # Interactive UI mode
./scripts/test.sh debug      # Debug mode
./scripts/test.sh headed     # Headed mode (see browser)
```

### Test Structure

All tests are organized in the `tests/` directory:
- `tests/README.md` - Comprehensive testing documentation
- `tests/MESSAGES_TROUBLESHOOTING.md` - Specific troubleshooting for messages page
- `tests/helpers/` - Reusable test utilities
- `tests/fixtures/` - Test data and configurations

### Test Users

The following test users are available for testing:
- **sarah.chen** (sarah.chen@example.com) - Primary test user
- **alex.johnson** (alex.johnson@example.com) - Chat testing
- **maria.garcia** (maria.garcia@example.com) - Multiple conversations
- **james.kim** (james.kim@example.com) - Profile testing
- **kai3** (kai3@example.com) - Alternative test user

All users have password: `password123`

### Common Issues

- **Login failures**: Use API authentication instead of UI login for reliable tests
- **Missing elements**: Use content-based selectors instead of data-testid attributes
- **API status codes**: Accept multiple valid responses (200, 404, 403)
- **Page structure**: Test functionality, not implementation details

See `tests/README.md` for detailed troubleshooting and best practices.

## Available Pages (Dev)

- **Home**: `