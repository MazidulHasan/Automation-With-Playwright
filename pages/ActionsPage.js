import { HEROKU } from '../utils/testData.js';

export class ActionsPage {
  constructor(page) {
    this.page = page;

    // ── Drag & Drop (/drag_and_drop) ───────────────────────────────────────
    this.columnA = page.locator('#column-a');
    this.columnB = page.locator('#column-b');

    // ── Hover (/hovers) ────────────────────────────────────────────────────
    this.figures = page.locator('.figure');

    // ── Keyboard (/key_presses) ────────────────────────────────────────────
    this.keyInput  = page.locator('#target');
    this.keyResult = page.locator('#result');

    // ── Context menu / right-click (/context_menu) ────────────────────────
    this.contextMenuBox = page.locator('#hot-spot');
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async gotoDragAndDrop()  { await this.page.goto(HEROKU.dragAndDrop);  }
  async gotoHovers()       { await this.page.goto(HEROKU.hovers);       }
  async gotoKeyPresses()   { await this.page.goto(HEROKU.keyPresses);   }
  async gotoContextMenu()  { await this.page.goto(HEROKU.contextMenu);  }

  // ── Drag & Drop ──────────────────────────────────────────────────────────

  /** Drag column A on top of column B using the built-in dragTo helper. */
  async dragAtoB() {
    await this.columnA.dragTo(this.columnB);
  }

  async getColumnAHeader() {
    return await this.columnA.locator('header').textContent();
  }

  async getColumnBHeader() {
    return await this.columnB.locator('header').textContent();
  }

  // ── Hover ─────────────────────────────────────────────────────────────────

  /** Hover over a figure by 0-based index and wait for its caption to appear. */
  async hoverFigure(index) {
    await this.figures.nth(index).hover();
    // The figcaption becomes visible only after hovering
    await this.figures.nth(index).locator('.figcaption').waitFor({ state: 'visible' });
  }

  async getFigureCaptionText(index) {
    return await this.figures.nth(index).locator('.figcaption').innerText();
  }

  async getFigureCount() {
    return await this.figures.count();
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────

  /** Click the input, then press a single key (e.g. 'A', 'Enter', 'Shift'). */
  async pressKey(key) {
    await this.keyInput.click();
    await this.page.keyboard.press(key);
  }

  /** Type a full string character by character (triggers keydown/keypress/keyup). */
  async typeText(text) {
    await this.keyInput.click();
    await this.page.keyboard.type(text);
  }

  /** Hold modifier + press key (e.g. 'Shift', 'A'). */
  async pressCombo(modifier, key) {
    await this.keyInput.click();
    await this.page.keyboard.down(modifier);
    await this.page.keyboard.press(key);
    await this.page.keyboard.up(modifier);
  }

  async getKeyResult() {
    return await this.keyResult.textContent();
  }

  // ── Right-click ───────────────────────────────────────────────────────────

  async rightClickBox() {
    await this.contextMenuBox.click({ button: 'right' });
  }

  // ── Double-click helper (reusable across pages) ───────────────────────────

  async doubleClick(locator) {
    await locator.dblclick();
  }
}
