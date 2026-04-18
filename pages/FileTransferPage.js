import { HEROKU } from '../utils/testData.js';

export class FileTransferPage {
  constructor(page) {
    this.page = page;

    // ── Upload page ────────────────────────────────────────────────────────
    this.fileInput      = page.locator('#file-upload');
    this.uploadButton   = page.locator('#file-submit');
    this.uploadHeading  = page.locator('h3');          // "File Uploaded!"
    this.uploadedFiles  = page.locator('#uploaded-files');

    // ── Download page ──────────────────────────────────────────────────────
    this.downloadLinks  = page.locator('#content .example a');
  }

  async gotoUpload() {
    await this.page.goto(HEROKU.upload);
  }

  async gotoDownload() {
    await this.page.goto(HEROKU.download);
  }

  // ── Upload helpers ─────────────────────────────────────────────────────────

  /**
   * Set one or more files on the hidden file input and click Upload.
   * @param {string|string[]} filePaths  Absolute path(s) to the file(s)
   */
  async uploadFile(filePaths) {
    await this.fileInput.setInputFiles(filePaths);
    await this.uploadButton.click();
  }

  async getUploadedFileName() {
    return await this.uploadedFiles.textContent();
  }

  async isUploadSuccessful() {
    return await this.uploadHeading.textContent();
  }

  // ── Download helpers ───────────────────────────────────────────────────────

  /**
   * Click the first available download link and return the Download object.
   * Caller should call download.saveAs() or download.path() to access the file.
   */
  async downloadFirstFile() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadLinks.first().click(),
    ]);
    return download;
  }

  /**
   * Download a specific file by its link text.
   */
  async downloadFileByName(filename) {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadLinks.filter({ hasText: filename }).click(),
    ]);
    return download;
  }

  async getAvailableFileNames() {
    return await this.downloadLinks.allTextContents();
  }
}
