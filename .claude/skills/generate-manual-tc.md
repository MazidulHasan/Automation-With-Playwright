# Generate Manual Test Cases

Generate a comprehensive manual test case Excel (.xlsx) file for any web feature by navigating to the page with Playwright, analyzing its UI and behaviour, then writing structured test cases.

## Usage

```
/generate-manual-tc <feature-name> <url> [output-filename]
```

| Argument | Required | Description |
|---|---|---|
| `feature-name` | Yes | Short name for the feature (e.g. `login`, `checkout`, `registration`) |
| `url` | Yes | Full URL of the page to analyze |
| `output-filename` | No | Output .xlsx filename (default: `<feature-name>_manual_test_cases.xlsx`) |

**Example:**
```
/generate-manual-tc login https://www.saucedemo.com/
/generate-manual-tc checkout https://www.saucedemo.com/checkout-step-one.html checkout_manual_tc.xlsx
/generate-manual-tc registration https://example.com/register
```

---

## Instructions

When this skill is invoked with `$ARGUMENTS`, follow these steps exactly:

### Step 1 — Parse arguments

Extract from `$ARGUMENTS`:
- `featureName` — first token (e.g. `login`)
- `url` — second token (the URL)
- `outputFilename` — third token if present, otherwise `<featureName>_manual_test_cases.xlsx`

### Step 2 — Navigate and analyze the page

Use the Playwright MCP tools to:
1. Navigate to the URL with `mcp__playwright__browser_navigate`
2. Capture a full accessibility snapshot with `mcp__playwright__browser_snapshot`
3. Interact with the page as needed (fill forms, click buttons, observe errors) to discover all UI states, validation messages, error conditions, and navigation flows

Look for and document:
- All form fields (labels, types, placeholders, required indicators)
- All buttons and their actions
- All error/validation messages (exact text)
- Navigation changes after successful/failed actions
- Any hints, tooltips, or helper text visible on the page
- Edge cases: empty input, invalid formats, boundary values

### Step 3 — Design test cases

Group test cases into logical modules based on what you observe. Common modules include (adapt to the feature):

- **UI / Page Load** — elements visible, layout, placeholder text, hints
- **Successful <Action>** — happy path for each valid user type / scenario
- **Failed <Action>** — negative paths (wrong credentials, invalid input, etc.)
- **Empty Field Validation** — required field errors, order of validation
- **Input Boundary / Format** — max length, special characters, whitespace, case sensitivity
- **Error Message Behaviour** — dismissal, auto-clear, exact message text
- **Post-Action / Navigation** — redirects after success, back-button behaviour, direct URL access protection

For each test case define:
- **Test Case ID** — sequential: TC001, TC002, …
- **Module** — group name
- **Test Case Title** — concise, action-oriented (e.g. "Standard user logs in with valid credentials")
- **Pre-conditions** — what must be true before the test starts
- **Test Steps** — numbered steps (1. Do X\n2. Do Y)
- **Test Data** — exact inputs used (or "N/A")
- **Expected Result** — precise, verifiable outcome including exact error message text where applicable
- **Status** — leave blank (tester fills in: Pass / Fail)
- **Priority** — High / Medium / Low
- **Severity** — Critical / Major / Minor / Trivial

> **Note:** Do NOT include an "Actual Result" column. The sheet is a pre-execution document only.

Aim for thorough coverage — typically 20–35 test cases for a login/registration feature, more for complex flows.

### Step 4 — Generate the .xlsx file

Create a temporary Node.js script at `testCases/generate_tc_temp.mjs` using the `xlsx` package (already installed). The script must:

1. Use **ES module** syntax (`import`, not `require`) — the project has `"type": "module"` in package.json
2. Define the **10 columns** (no Actual Result):
   ```
   Test Case ID | Module | Test Case Title | Pre-conditions | Test Steps |
   Test Data | Expected Result | Status | Priority | Severity
   ```
3. Include all test cases derived from Step 3
4. Set column widths:
   - Test Case ID: 10, Module: 22, Test Case Title: 48, Pre-conditions: 35,
     Test Steps: 48, Test Data: 38, Expected Result: 60,
     Status: 10, Priority: 10, Severity: 12
5. Freeze the header row (`ws['!freeze'] = { xSplit: 0, ySplit: 1 }`)
6. Name the sheet after the feature (e.g. `Login Test Cases`)
7. Save to `testCases/<outputFilename>`
8. Log: `✔  Saved: <path>` and `   Total test cases: <n>`

### Step 5 — Execute and clean up

Run the script:
```bash
node testCases/generate_tc_temp.mjs
```

After it succeeds, delete the temporary script:
```bash
rm testCases/generate_tc_temp.mjs
```

### Step 6 — Report to the user

Summarise:
- Full path of the saved .xlsx file
- Total number of test cases generated
- A markdown table listing each module and its TC count
- Command to open the file: `start testCases/<outputFilename>` (Windows) or `open testCases/<outputFilename>` (Mac)
