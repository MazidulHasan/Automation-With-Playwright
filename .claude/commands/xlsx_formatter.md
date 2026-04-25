# XLSX Formatter

Format any Excel (.xlsx) file into a standard test case format.
Adds missing standard columns, auto-generates TC IDs, and preserves all existing data columns so running test specs are not broken.

## Usage

```
/xlsx_formatter <path-to-excel-file> [sheet-name]
```

| Argument             | Required | Description                                           |
| -------------------- | -------- | ----------------------------------------------------- |
| `path-to-excel-file` | Yes      | Relative or absolute path to the .xlsx file           |
| `sheet-name`         | No       | Only format this sheet. Omit to format **all** sheets |

**Examples:**

```
/xlsx_formatter utils/data/simpleData.xlsx
/xlsx_formatter utils/data/loginScenarios.xlsx Login
/xlsx_formatter tests/data/myTests.xlsx
```

---

## Instructions

When this command is invoked with `$ARGUMENTS`, follow these steps exactly.

### Step 1 — Parse arguments

Extract from `$ARGUMENTS`:

- `filePath` — first token (the .xlsx path, relative to project root)
- `targetSheet` — second token if present, otherwise `null` (means all sheets)

Verify the file exists. If it does not, tell the user and stop.

### Step 2 — Read the workbook

Write and run a temporary Node.js script at `_xlsx_formatter_read.mjs`:

```js
import XLSX from "xlsx";
const wb = XLSX.readFile("<filePath>");
const out = {};
for (const name of wb.SheetNames) {
  out[name] = XLSX.utils.sheet_to_json(wb.Sheets[name]);
}
console.log(JSON.stringify(out));
```

Parse the JSON output. For each sheet (or only `targetSheet` if specified):

- Inspect the column names present in the first row
- Note which standard columns are **already present** and which are **missing**

### Step 3 — Detect sheet type and plan enrichment

**Standard columns** (the target format):

| Column            | Type   | Default when missing                                                                                                                                                                               |
| ----------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TC_ID`           | string | Auto-generate: `TC_<SHEET_PREFIX>_001`, `002`, …                                                                                                                                                   |
| `Module`          | string | Infer from sheet name (e.g. sheet "Login" → "Authentication", "Inventory" → "Shopping Cart", "Cart" → "Shopping Cart", "Register" → "Registration"). Use sheet name as-is when no mapping applies. |
| `description`     | string | Keep existing OR use `title` / `name` / `test` column if found                                                                                                                                     |
| `Priority`        | string | `"Medium"`                                                                                                                                                                                         |
| `Precondition`    | string | `"Application is open in the browser"`                                                                                                                                                             |
| `Steps`           | string | `"1. Execute the test scenario as described"`                                                                                                                                                      |
| `Expected_Result` | string | Derive from `expectSuccess`/`errorContains` if present, otherwise `"Verify the feature behaves as expected"`                                                                                       |
| `Status`          | string | `"Not Run"`                                                                                                                                                                                        |

**Sheet prefix mapping for TC_ID:**

- Sheet "Login" → prefix `LOGIN`
- Sheet "Inventory" → prefix `INV`
- Sheet "Cart" → prefix `CART`
- Sheet "Register" / "Registration" → prefix `REG`
- Sheet "Checkout" → prefix `CHK`
- Sheet "Search" → prefix `SRCH`
- Anything else → first 4 chars of sheet name uppercased

**Expected_Result derivation rule** (when `expectSuccess` column exists):

- `expectSuccess === true` → `"User is redirected to the next page / success state"`
- `expectSuccess === false` and `errorContains` present → `"Error message is shown: <errorContains value>"`

**Column ordering** (preserve data columns in their original position; prepend/append standard columns in this order):

```
TC_ID | Module | description | Priority | Precondition | Steps |
<...all original data columns...> |
Expected_Result | Status
```

Do **not** remove or rename any original column — existing test specs depend on them.

### Step 4 — Generate the formatted workbook

Write a temporary Node.js script at `_xlsx_formatter_write.mjs` that:

1. Uses ES module syntax (`import XLSX from 'xlsx'`)
2. Reads the original workbook
3. For each sheet to format, applies the enrichment plan from Step 3:
   - Adds missing standard columns with the computed defaults
   - Auto-generates `TC_ID` values (zero-padded to 3 digits) if the column is absent
   - Preserves rows exactly as-is where a column already exists
4. Sets column widths:
   - `TC_ID`: 14
   - `Module`: 22
   - `description`: 48
   - `Priority`: 10
   - `Precondition`: 40
   - `Steps`: 50
   - `Expected_Result`: 60
   - `Status`: 12
   - All other columns: 25
5. Freezes the header row: `ws['!freeze'] = { xSplit: 0, ySplit: 1 }`
6. Writes back to the **same file path** (overwrites in place)
7. Logs for each sheet: `✔  Sheet "<name>": <n> rows formatted`

Run the script, then delete both temporary scripts.

### Step 5 — Verify the output

Run a quick verification script that reads the file back and prints the column headers for each formatted sheet. Confirm all standard columns are present.

### Step 6 — Report to the user

Summarise:

- File path updated
- For each formatted sheet: sheet name, row count, and a table of **columns before → columns after**
- Remind the user that all original data columns were preserved so existing specs continue to work unchanged
