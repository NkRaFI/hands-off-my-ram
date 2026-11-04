import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const baseUrl = process.env.SMOKE_URL || 'http://127.0.0.1:5173/'

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const position = async () => {
    const text = await page.getByTestId('player-position').textContent()
    const match = text?.match(/Position: (-?\d+\.\d+), (-?\d+\.\d+), (-?\d+\.\d+)/)
    if (!match) throw new Error(`Missing player position: ${text}`)
    return { x: Number(match[1]), y: Number(match[2]), z: Number(match[3]) }
  }
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${message.text()} (${message.location().url})`)
  })
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
  })
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Explore city' }).click()
  await page.locator('canvas').waitFor()
  await page.locator('.loading').waitFor({ state: 'hidden' })
  await page.waitForTimeout(1500)
  const desktop = await page.locator('canvas').boundingBox()
  await page.keyboard.down('w')
  await page.waitForTimeout(700)
  const moving = await position()
  if (moving.z > -1.5) throw new Error(`Player did not move forward: ${JSON.stringify(moving)}`)
  await page.waitForTimeout(3300)
  await page.keyboard.up('w')
  await page.waitForTimeout(150)
  const approach = await position()
  if (approach.z > -12 || approach.z < -22) throw new Error(`Player did not approach the building: ${JSON.stringify(approach)}`)
  await page.keyboard.down('a')
  await page.waitForTimeout(3000)
  await page.keyboard.up('a')
  const blocked = await position()
  if (blocked.x < -10 || blocked.x > -8.5) throw new Error(`Player crossed the large building: ${JSON.stringify(blocked)}`)
  if (blocked.y < 0.7 || blocked.y > 1.1) throw new Error(`Player fell through or floated above the ground: ${JSON.stringify(blocked)}`)
  await page.keyboard.press('Escape')
  await page.keyboard.down('d')
  await page.waitForTimeout(350)
  await page.keyboard.up('d')
  const whilePaused = await position()
  if (Math.abs(whilePaused.x - blocked.x) > 0.1) throw new Error('Player moved while paused')
  await page.keyboard.press('Escape')
  await page.keyboard.down('d')
  await page.waitForTimeout(400)
  await page.keyboard.up('d')
  const resumed = await position()
  if (resumed.x < blocked.x + 0.8) throw new Error('Player did not resume movement')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForFunction(() => {
    const box = document.querySelector('canvas')?.getBoundingClientRect()
    return !!box && box.width < 400 && box.height >= 844
  })
  const mobile = await page.locator('canvas').boundingBox()
  if (!desktop || !mobile || Math.abs(desktop.width - 1280) > 2 || Math.abs(mobile.width - 390) > 2 || Math.abs(mobile.height - 844) > 2) {
    throw new Error(`Canvas did not resize: ${JSON.stringify({ desktop, mobile })}`)
  }
  await page.keyboard.down('ArrowLeft')
  await page.waitForTimeout(350)
  await page.keyboard.up('ArrowLeft')
  const afterResize = await position()
  if (afterResize.x > resumed.x - 0.5) throw new Error('Arrow key movement failed after resize')

  await page.goto(new URL('?inspect=1', baseUrl).toString(), { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Inspect approved assets' }).click()
  await page.getByRole('status').filter({ hasText: /All approved runtime assets|Asset errors:/ }).waitFor({ timeout: 120_000 })
  const result = await page.getByRole('status').last().textContent()
  if (!result?.includes('All approved runtime assets loaded successfully.')) throw new Error(result || 'Inspection failed')
  if (errors.length) throw new Error(`Browser console errors: ${errors.join(' | ')}`)
  console.log('City movement, building collision, pause/resume, resize, approved assets, and browser console passed.')
} finally {
  await browser.close()
}
