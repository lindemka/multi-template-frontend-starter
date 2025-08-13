# Feed Test Suite

This directory contains comprehensive end-to-end tests for the feed functionality of the application.

## Test Files

### `feed-test-suite.spec.ts`
The main test suite that covers all feed functionality including:
- Loading and displaying posts
- Creating new posts
- Post interactions (like, comment, share)
- Feed refresh functionality
- Responsive design
- Post metadata display

## Test Configuration

### Prerequisites
1. **Backend**: Spring Boot application running on port 8080
2. **Frontend**: Next.js application running on port 3000
3. **Database**: PostgreSQL with test data from `V10__create_feed_tables.sql`

### Authentication
Currently, tests run with authentication bypassed for development purposes. This allows for faster testing and easier debugging.

**To re-enable authentication:**
1. Re-enable authentication in `backend/src/main/java/com/example/demo/config/SecurityConfig.java`
2. Re-enable authentication checks in frontend API routes
3. Update tests to include login steps

## Running Tests

### Quick Start
```bash
# Start the backend
cd backend && mvn spring-boot:run

# Start the frontend (in a new terminal)
cd frontend && npm run dev

# Run the feed test suite
npx playwright test tests/feed-test-suite.spec.ts
```

### Running with UI
```bash
# Run tests with browser UI visible
npx playwright test tests/feed-test-suite.spec.ts --headed

# Run tests in a specific browser
npx playwright test tests/feed-test-suite.spec.ts --project=chromium --headed
```

### Running All Tests
```bash
# Run all tests in the project
npx playwright test

# Run tests with coverage report
npx playwright test --reporter=html
```

## Test Structure

### Test Categories
1. **Page Loading**: Verifies feed page loads correctly with posts
2. **Modal Functionality**: Tests create post modal opening and form elements
3. **Post Interactions**: Verifies like, comment, and share buttons are present
4. **Metadata Display**: Checks author information, timestamps, and interaction counts
5. **Refresh Functionality**: Tests feed refresh behavior
6. **Responsive Design**: Verifies feed works on mobile viewports

### Test Data
Tests use sample data from the database migration `V10__create_feed_tables.sql`:
- 4 sample posts with different authors
- Various content types (text, emojis, hashtags)
- Different interaction counts

## Debugging Tests

### View Test Results
```bash
# Open the HTML report
npx playwright show-report
```

### Debug Mode
```bash
# Run tests in debug mode with step-by-step execution
npx playwright test tests/feed-test-suite.spec.ts --debug
```

### Screenshots and Videos
Test failures automatically generate:
- Screenshots of the failure state
- Video recordings of the test execution
- Error context information

## Common Issues

### Authentication Issues
If tests fail due to authentication:
1. Check that authentication is properly bypassed in the configuration
2. Verify backend and frontend are running
3. Check database connection and test data

### Element Not Found
If tests can't find elements:
1. Check that the page has loaded completely
2. Verify element selectors match the current UI
3. Check for dynamic content loading

### Network Issues
If API calls fail:
1. Verify backend is running on port 8080
2. Check frontend API routes are working
3. Verify database is accessible

## Test Maintenance

### Adding New Tests
1. Follow the existing test structure
2. Use descriptive test names
3. Add appropriate assertions
4. Include error handling

### Updating Selectors
When UI changes:
1. Update element selectors in tests
2. Verify tests still pass
3. Update documentation if needed

### Test Data Management
When database schema changes:
1. Update test data in migrations
2. Adjust test expectations
3. Verify all tests pass

## Best Practices

1. **Isolation**: Each test should be independent
2. **Descriptive Names**: Use clear, descriptive test names
3. **Proper Assertions**: Use appropriate assertions for each check
4. **Error Handling**: Include proper error handling and cleanup
5. **Documentation**: Keep this README updated with changes

## Troubleshooting

### Tests Not Running
- Check that Playwright is installed: `npm install -D @playwright/test`
- Verify browser binaries: `npx playwright install`

### Backend Connection Issues
- Check backend is running: `curl http://localhost:8080/health`
- Verify database connection
- Check application logs

### Frontend Issues
- Check frontend is running: `curl http://localhost:3000`
- Verify API routes are accessible
- Check browser console for errors

## Contributing

When adding new tests:
1. Follow the existing patterns
2. Add appropriate documentation
3. Ensure tests are reliable and fast
4. Update this README if needed

## Support

For issues with the test suite:
1. Check the troubleshooting section
2. Review test logs and screenshots
3. Verify all prerequisites are met
4. Check for recent changes that might affect tests
