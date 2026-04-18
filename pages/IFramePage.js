import { HEROKU } from '../utils/testData.js';

export class IFramePage {
  constructor(page) {
    this.page = page;

    // ── Main iframe (TinyMCE editor) ───────────────────────────────────────
    // frameLocator() pierces the iframe boundary so we can chain locators inside it.
    // The TinyMCE editor creates an iframe with id ending in "_ifr".
    this.editorFrame = page.frameLocator('#mce_0_ifr');
    this.editorBody  = this.editorFrame.locator('body');

    // ── Nested frames (separate page: /nested_frames) ──────────────────────
    // The outer <frameset> contains a "frame-top" and "frame-bottom" frame.
    // frame-top itself contains three inner frames.
    this.topFrame    = page.frameLocator('[name="frame-top"]');
    this.middleFrame = this.topFrame.frameLocator('[name="frame-middle"]');
    this.bottomFrame = page.frameLocator('[name="frame-bottom"]');
  }

  async gotoIframe() {
    await this.page.goto(HEROKU.iframe);
    // Wait for TinyMCE to finish initialising before interacting
    await this.editorBody.waitFor();
  }

  async gotoNestedFrames() {
    await this.page.goto(HEROKU.nestedFrames);
  }

  // ── Editor helpers ─────────────────────────────────────────────────────────

  async clearEditor() {
    await this.editorBody.click();
    await this.page.keyboard.press('Control+a');
    await this.page.keyboard.press('Delete');
  }

  async typeInEditor(text) {
    await this.editorBody.click();
    await this.editorBody.type(text);
  }

  async getEditorText() {
    return await this.editorBody.innerText();
  }

  // ── Nested frame helpers ──────────────────────────────────────────────────

  async getMiddleFrameText() {
    return await this.middleFrame.locator('body').innerText();
  }

  async getBottomFrameText() {
    return await this.bottomFrame.locator('body').innerText();
  }
}
