// Login scenarios — inline JS array (no file I/O)
// Inventory scenarios live in utils/data/inventoryScenarios.xlsx

export const loginScenarios = [
  {
    description: 'valid user logs in successfully',
    username: 'standard_user',
    password: 'secret_sauce',
    expectSuccess: true,
    errorContains: null,
  },
  {
    description: 'locked-out user sees locked error',
    username: 'locked_out_user',
    password: 'secret_sauce',
    expectSuccess: false,
    errorContains: 'Sorry, this user has been locked out',
  },
  {
    description: 'wrong password shows credential mismatch error',
    username: 'standard_user',
    password: 'bad_password',
    expectSuccess: false,
    errorContains: 'Username and password do not match',
  },
  {
    description: 'empty username shows validation error',
    username: '',
    password: 'secret_sauce',
    expectSuccess: false,
    errorContains: 'Username is required',
  },
];
