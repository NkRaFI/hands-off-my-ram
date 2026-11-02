import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const baseUrl = process.env.SMOKE_URL || 'http://127.0.0.1:5173/'

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${message.text()} (${message.location().url})`)
  })
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
  })
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Start scene' }).click()
  await page.locator('canvas').waitFor()
  await page.locator('.loading').waitFor({ state: 'hidden' })
  const desktop = await page.locator('canvas').boundingBox()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForFunction(() => {
    const box = document.querySelector('canvas')?.getBoundingClientRect()
    return !!box && box.width < 400 && box.height >= 844
  })
  const mobile = await page.locator('canvas').boundingBox()
  if (!desktop || !mobile || Math.abs(desktop.width - 1280) > 2 || Math.abs(mobile.width - 390) > 2 || Math.abs(mobile.height - 844) > 2) {
    throw new Error(`Canvas did not resize: ${JSON.stringify({ desktop, mobile })}`)
  }

  await page.goto(new URL('?inspect=1', baseUrl).toString(), { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Inspect approved assets' }).click()
  await page.getByRole('status').filter({ hasText: /All approved runtime assets|Asset errors:/ }).waitFor({ timeout: 120_000 })
  const result = await page.getByRole('status').last().textContent()
  if (!result?.includes('All approved runtime assets loaded successfully.')) throw new Error(result || 'Inspection failed')
  if (errors.length) throw new Error(`Browser console errors: ${errors.join(' | ')}`)
  console.log('Desktop and mobile canvas resize passed; all approved assets loaded; browser console clean.')
} finally {
  await browser.close()
}
