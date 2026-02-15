function runLoginTest(testData) {
  const { username, password, expected } = testData;

  console.log(`Logging in with: ${username}`);

  // Example (Playwright):
  // await page.fill("#user-name", username);
  // await page.fill("#password", password);
  // await page.click("#login-button");

  console.log("Expected result:", expected);
}

const tests = [
  { username: "standard_user", password: "secret_sauce", expected: "success" },
  { username: "locked_out_user", password: "secret_sauce", expected: "error" }
];

for (const t of tests) {
  runLoginTest(t);
}

