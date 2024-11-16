import { expect, test } from '@playwright/test'

const hostname = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || '3000'

test.describe('Login', () => {
  test('renders the index', async ({ page }) => {
    await page.goto(`http://${hostname}:${port}/login`)
    const grid = await page.$('[data-testid="login-wrapper"]')

    expect(grid).toBeDefined()
  })
})