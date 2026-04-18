// Centralised test data for saucedemo.com
// Import this wherever you need credentials, product names, or expected messages.

export const USERS = {
  standard:   { username: 'standard_user',       password: 'secret_sauce' },
  locked:     { username: 'locked_out_user',      password: 'secret_sauce' },
  problem:    { username: 'problem_user',         password: 'secret_sauce' },
  performance:{ username: 'performance_glitch_user', password: 'secret_sauce' },
  error:       { username: 'error_user',              password: 'secret_sauce' },
};

export const PRODUCTS = {
  backpack:   'Sauce Labs Backpack',
  boltShirt:  'Sauce Labs Bolt T-Shirt',
  bikeLight:  'Sauce Labs Bike Light',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie:     'Sauce Labs Onesie',
  redShirt:   'Test.allTheThings() T-Shirt (Red)',
};

export const ERROR_MESSAGES = {
  wrongPassword:  'Username and password do not match',
  lockedOut:      'Sorry, this user has been locked out',
  emptyUsername:  'Username is required',
  emptyPassword:  'Password is required',
};

export const URLS = {
  inventory: /inventory/,
  cart:      /cart/,
  checkout:  /checkout-step-one/,
  complete:  /checkout-complete/,
};

// ─── External sites used for browser-feature demos ───────────────────────────

export const HEROKU = {
  base:            'https://the-internet.herokuapp.com',
  multipleWindows: 'https://the-internet.herokuapp.com/windows',
  newWindowTarget: 'https://the-internet.herokuapp.com/windows/new',
  jsAlerts:        'https://the-internet.herokuapp.com/javascript_alerts',
  iframe:          'https://the-internet.herokuapp.com/iframe',
  nestedFrames:    'https://the-internet.herokuapp.com/nested_frames',
  upload:          'https://the-internet.herokuapp.com/upload',
  download:        'https://the-internet.herokuapp.com/download',
  dragAndDrop:     'https://the-internet.herokuapp.com/drag_and_drop',
  hovers:          'https://the-internet.herokuapp.com/hovers',
  keyPresses:      'https://the-internet.herokuapp.com/key_presses',
  contextMenu:     'https://the-internet.herokuapp.com/context_menu',
};
