/**
 * Excel utility using SheetJS (xlsx package).
 * Provides two functions:
 *   writeExcel(filePath, sheetName, rows[]) — create an xlsx from an array of objects
 *   readExcel(filePath, sheetName?)         — read an xlsx back into an array of objects
 *
 * Install dependency: npm install xlsx
 */

import * as XLSX from 'xlsx';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * Write an array of plain objects to an Excel file.
 * Each object key becomes a column header; each element becomes a row.
 *
 * @param {string}   filePath   Absolute path of the .xlsx to create/overwrite
 * @param {string}   sheetName  Name of the worksheet tab
 * @param {object[]} rows       Data rows
 */
export function writeExcel(filePath, sheetName, rows) {
  mkdirSync(dirname(filePath), { recursive: true });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook  = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filePath);
}

/**
 * Read an Excel file and return its rows as an array of plain objects.
 * Column headers (row 1) become object keys; remaining rows become values.
 *
 * @param {string}  filePath   Absolute path to the .xlsx file
 * @param {string=} sheetName  Sheet to read (defaults to the first sheet)
 * @returns {object[]}
 */
export function readExcel(filePath, sheetName) {
  const workbook = XLSX.readFile(filePath);
  const name     = sheetName ?? workbook.SheetNames[0];
  const sheet    = workbook.Sheets[name];

  if (!sheet) {
    throw new Error(`Sheet "${name}" not found in ${filePath}. Available: ${workbook.SheetNames.join(', ')}`);
  }

  return XLSX.utils.sheet_to_json(sheet);
}
