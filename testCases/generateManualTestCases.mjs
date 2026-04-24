import * as XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const headers = [
  'Test Case ID',
  'Module',
  'Test Case Title',
  'Pre-conditions',
  'Test Steps',
  'Test Data',
  'Expected Result',
  'Actual Result',
  'Status',
  'Priority',
  'Severity',
];

const testCases = [
  // ── UI / Page Load ──────────────────────────────────────────────────────────
  {
    id: 'TC001',
    module: 'UI / Page Load',
    title: 'Login page loads successfully',
    pre: 'Browser is open',
    steps: '1. Navigate to https://www.saucedemo.com/',
    data: 'URL: https://www.saucedemo.com/',
    expected: 'Login page loads with "Swag Labs" logo, Username field, Password field, and Login button visible',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Critical',
  },
  {
    id: 'TC002',
    module: 'UI / Page Load',
    title: 'Login page displays accepted usernames hint',
    pre: 'Browser is open',
    steps: '1. Navigate to https://www.saucedemo.com/',
    data: 'N/A',
    expected: 'Accepted usernames section is displayed with: standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user',
    actual: '',
    status: '',
    priority: 'Low',
    severity: 'Minor',
  },
  {
    id: 'TC003',
    module: 'UI / Page Load',
    title: 'Login page displays password hint',
    pre: 'Browser is open',
    steps: '1. Navigate to https://www.saucedemo.com/',
    data: 'N/A',
    expected: 'Password hint section shows "secret_sauce" as the password for all users',
    actual: '',
    status: '',
    priority: 'Low',
    severity: 'Minor',
  },
  {
    id: 'TC004',
    module: 'UI / Page Load',
    title: 'Password field masks input',
    pre: 'Login page is open',
    steps: '1. Click on the Password field\n2. Type any characters',
    data: 'Password: secret_sauce',
    expected: 'Characters are masked (shown as dots/asterisks)',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Major',
  },

  // ── Successful Login ────────────────────────────────────────────────────────
  {
    id: 'TC005',
    module: 'Successful Login',
    title: 'Standard user logs in with valid credentials',
    pre: 'Login page is open',
    steps: '1. Enter username\n2. Enter password\n3. Click Login button',
    data: 'Username: standard_user\nPassword: secret_sauce',
    expected: 'User is redirected to the inventory page (/inventory.html) and product list is displayed',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Critical',
  },
  {
    id: 'TC006',
    module: 'Successful Login',
    title: 'Problem user logs in with valid credentials',
    pre: 'Login page is open',
    steps: '1. Enter username\n2. Enter password\n3. Click Login button',
    data: 'Username: problem_user\nPassword: secret_sauce',
    expected: 'User is redirected to the inventory page (/inventory.html)',
    actual: '',
    status: '',
    priority: 'Medium',
    severity: 'Major',
  },
  {
    id: 'TC007',
    module: 'Successful Login',
    title: 'Performance glitch user logs in (with delay)',
    pre: 'Login page is open',
    steps: '1. Enter username\n2. Enter password\n3. Click Login button\n4. Wait for page to load',
    data: 'Username: performance_glitch_user\nPassword: secret_sauce',
    expected: 'User is eventually redirected to the inventory page after a noticeable delay',
    actual: '',
    status: '',
    priority: 'Medium',
    severity: 'Major',
  },
  {
    id: 'TC008',
    module: 'Successful Login',
    title: 'Error user logs in with valid credentials',
    pre: 'Login page is open',
    steps: '1. Enter username\n2. Enter password\n3. Click Login button',
    data: 'Username: error_user\nPassword: secret_sauce',
    expected: 'User is redirected to the inventory page (/inventory.html)',
    actual: '',
    status: '',
    priority: 'Medium',
    severity: 'Major',
  },
  {
    id: 'TC009',
    module: 'Successful Login',
    title: 'Visual user logs in with valid credentials',
    pre: 'Login page is open',
    steps: '1. Enter username\n2. Enter password\n3. Click Login button',
    data: 'Username: visual_user\nPassword: secret_sauce',
    expected: 'User is redirected to the inventory page (/inventory.html)',
    actual: '',
    status: '',
    priority: 'Medium',
    severity: 'Major',
  },

  // ── Failed Login ────────────────────────────────────────────────────────────
  {
    id: 'TC010',
    module: 'Failed Login',
    title: 'Locked out user cannot log in',
    pre: 'Login page is open',
    steps: '1. Enter username\n2. Enter password\n3. Click Login button',
    data: 'Username: locked_out_user\nPassword: secret_sauce',
    expected: 'Error message displayed: "Epic sadface: Sorry, this user has been locked out."',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Critical',
  },
  {
    id: 'TC011',
    module: 'Failed Login',
    title: 'Login fails with invalid username',
    pre: 'Login page is open',
    steps: '1. Enter an invalid username\n2. Enter a valid password\n3. Click Login button',
    data: 'Username: invalid_user\nPassword: secret_sauce',
    expected: 'Error message displayed: "Epic sadface: Username and password do not match any user in this service"',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Critical',
  },
  {
    id: 'TC012',
    module: 'Failed Login',
    title: 'Login fails with invalid password',
    pre: 'Login page is open',
    steps: '1. Enter a valid username\n2. Enter an incorrect password\n3. Click Login button',
    data: 'Username: standard_user\nPassword: wrong_password',
    expected: 'Error message displayed: "Epic sadface: Username and password do not match any user in this service"',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Critical',
  },
  {
    id: 'TC013',
    module: 'Failed Login',
    title: 'Login fails with both fields invalid',
    pre: 'Login page is open',
    steps: '1. Enter an invalid username\n2. Enter an invalid password\n3. Click Login button',
    data: 'Username: bad_user\nPassword: bad_pass',
    expected: 'Error message displayed: "Epic sadface: Username and password do not match any user in this service"',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Critical',
  },
  {
    id: 'TC014',
    module: 'Failed Login',
    title: 'Login fails with correct password but wrong case for username',
    pre: 'Login page is open',
    steps: '1. Enter username in uppercase\n2. Enter correct password\n3. Click Login button',
    data: 'Username: STANDARD_USER\nPassword: secret_sauce',
    expected: 'Error message is displayed; login is case-sensitive',
    actual: '',
    status: '',
    priority: 'Medium',
    severity: 'Major',
  },
  {
    id: 'TC015',
    module: 'Failed Login',
    title: 'Login fails with leading/trailing spaces in username',
    pre: 'Login page is open',
    steps: '1. Enter username with spaces\n2. Enter correct password\n3. Click Login button',
    data: 'Username: " standard_user "\nPassword: secret_sauce',
    expected: 'Error message is displayed (spaces are not trimmed)',
    actual: '',
    status: '',
    priority: 'Low',
    severity: 'Minor',
  },

  // ── Empty Field Validation ──────────────────────────────────────────────────
  {
    id: 'TC016',
    module: 'Empty Field Validation',
    title: 'Login fails when username is empty',
    pre: 'Login page is open',
    steps: '1. Leave Username field empty\n2. Enter a valid password\n3. Click Login button',
    data: 'Username: (empty)\nPassword: secret_sauce',
    expected: 'Error message displayed: "Epic sadface: Username is required"',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Major',
  },
  {
    id: 'TC017',
    module: 'Empty Field Validation',
    title: 'Login fails when password is empty',
    pre: 'Login page is open',
    steps: '1. Enter a valid username\n2. Leave Password field empty\n3. Click Login button',
    data: 'Username: standard_user\nPassword: (empty)',
    expected: 'Error message displayed: "Epic sadface: Password is required"',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Major',
  },
  {
    id: 'TC018',
    module: 'Empty Field Validation',
    title: 'Login fails when both fields are empty',
    pre: 'Login page is open',
    steps: '1. Leave both Username and Password fields empty\n2. Click Login button',
    data: 'Username: (empty)\nPassword: (empty)',
    expected: 'Error message displayed: "Epic sadface: Username is required" (username validated first)',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Major',
  },
  {
    id: 'TC019',
    module: 'Empty Field Validation',
    title: 'Username field highlighted with red border on empty submit',
    pre: 'Login page is open',
    steps: '1. Leave Username field empty\n2. Click Login button',
    data: 'Username: (empty)',
    expected: 'Username input field is highlighted with a red/error border',
    actual: '',
    status: '',
    priority: 'Medium',
    severity: 'Minor',
  },

  // ── Error Message Behaviour ─────────────────────────────────────────────────
  {
    id: 'TC020',
    module: 'Error Message Behaviour',
    title: 'Error message is dismissible via close (X) button',
    pre: 'Login page is open; a failed login attempt has been made',
    steps: '1. Trigger any login error\n2. Click the X / close button on the error message',
    data: 'Username: (empty)',
    expected: 'Error message disappears from the page',
    actual: '',
    status: '',
    priority: 'Medium',
    severity: 'Minor',
  },
  {
    id: 'TC021',
    module: 'Error Message Behaviour',
    title: 'Error message clears after successful login',
    pre: 'Login page is open; a failed login attempt has been made causing an error',
    steps: '1. Trigger a login error\n2. Enter valid credentials\n3. Click Login button',
    data: 'Valid: standard_user / secret_sauce',
    expected: 'Error message is gone and user is redirected to inventory page',
    actual: '',
    status: '',
    priority: 'Medium',
    severity: 'Minor',
  },

  // ── Post-Login ──────────────────────────────────────────────────────────────
  {
    id: 'TC022',
    module: 'Post-Login',
    title: 'Logged-in user can log out via burger menu',
    pre: 'User is logged in as standard_user',
    steps: '1. Click the burger menu (☰) icon\n2. Click "Logout"',
    data: 'Username: standard_user\nPassword: secret_sauce',
    expected: 'User is logged out and redirected to the login page (/)',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Critical',
  },
  {
    id: 'TC023',
    module: 'Post-Login',
    title: 'Unauthenticated user is redirected to login when accessing inventory directly',
    pre: 'User is NOT logged in (no active session)',
    steps: '1. Navigate directly to https://www.saucedemo.com/inventory.html',
    data: 'URL: /inventory.html',
    expected: 'User is redirected back to the login page (/)',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Critical',
  },
  {
    id: 'TC024',
    module: 'Post-Login',
    title: 'Pressing browser back after logout does not re-enter the app',
    pre: 'User has just logged out',
    steps: '1. Log out successfully\n2. Click the browser Back button',
    data: 'N/A',
    expected: 'User remains on the login page (session is truly cleared)',
    actual: '',
    status: '',
    priority: 'High',
    severity: 'Critical',
  },
  {
    id: 'TC025',
    module: 'Post-Login',
    title: 'Logged-in user sees 6 products on inventory page',
    pre: 'User is logged in as standard_user',
    steps: '1. Log in with valid credentials\n2. Observe inventory page',
    data: 'Username: standard_user\nPassword: secret_sauce',
    expected: 'Exactly 6 product items are displayed on the inventory page',
    actual: '',
    status: '',
    priority: 'Medium',
    severity: 'Major',
  },
];

// Build worksheet rows
const rows = [
  headers,
  ...testCases.map(tc => [
    tc.id,
    tc.module,
    tc.title,
    tc.pre,
    tc.steps,
    tc.data,
    tc.expected,
    tc.actual,
    tc.status,
    tc.priority,
    tc.severity,
  ]),
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(rows);

// Column widths
ws['!cols'] = [
  { wch: 10 },  // Test Case ID
  { wch: 22 },  // Module
  { wch: 48 },  // Title
  { wch: 35 },  // Pre-conditions
  { wch: 48 },  // Test Steps
  { wch: 38 },  // Test Data
  { wch: 60 },  // Expected Result
  { wch: 30 },  // Actual Result
  { wch: 10 },  // Status
  { wch: 10 },  // Priority
  { wch: 12 },  // Severity
];

// Freeze header row
ws['!freeze'] = { xSplit: 0, ySplit: 1 };

XLSX.utils.book_append_sheet(wb, ws, 'Login Test Cases');

const outputPath = path.join(__dirname, 'login_manual_test_cases.xlsx');
XLSX.writeFile(wb, outputPath);

console.log(`✔  Saved: ${outputPath}`);
console.log(`   Total test cases: ${testCases.length}`);
