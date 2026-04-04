// My Blog Post: https://medium.com/p/e56422ab02d6?postPublishedType=initial
// All the details is written here


// ── PLAYWRIGHT LOCATOR CHEAT SHEET ──────────────────────────────

// By role (BEST — use this first)
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('link', { name: 'Home' })
page.getByRole('heading', { name: 'Products' })
page.getByRole('checkbox', { name: 'Remember me' })

// By label (great for form inputs)
page.getByLabel('Email address')

// By placeholder
page.getByPlaceholder('Search...')

// By text (visible content)
page.getByText('Welcome back!')
page.getByText('Exact match', { exact: true })

// By test ID (set testIdAttribute in config)
page.getByTestId('submit-btn')

// By CSS (when nothing else works)
page.locator('#id-name')
page.locator('.class-name')
page.locator('[data-custom="value"]')

// By XPath (last resort)
page.locator('xpath=//input[@id="name"]')

// ── NARROWING MULTIPLE ELEMENTS ─────────────────────────────────

// Count
await locator.count()

// Get one of many
locator.first()
locator.last()
locator.nth(2)           // 0-based index

// Filter down
locator.filter({ hasText: 'some text' })
locator.filter({ has: page.locator('button') })

// Chain (locator inside locator)
page.locator('.card').filter({ hasText: 'Backpack' }).locator('button')

// Get all text values
await locator.allTextContents()   // returns string[]
await locator.allInnerTexts()     // similar, trims whitespace