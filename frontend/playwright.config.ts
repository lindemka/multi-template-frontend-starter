import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    timeout: 60_000,
    expect: { timeout: 10_000 },
    fullyParallel: false,
    reporter: 'line',
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        trace: 'on-first-retry',
        headless: false,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
})


