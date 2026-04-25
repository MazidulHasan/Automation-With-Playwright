import XLSX from 'xlsx';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

// Write a single sheet to a new xlsx file (overwrites if exists)
export function writeExcel(filePath, sheetName, rows) {
  mkdirSync(dirname(filePath), { recursive: true });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), sheetName);
  XLSX.writeFile(workbook, filePath);
}

// Write multiple sheets to one xlsx file: { SheetName: rows[] }
export function seedWorkbook(filePath, sheets) {
  mkdirSync(dirname(filePath), { recursive: true });
  const workbook = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheets)) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), name);
  }
  XLSX.writeFile(workbook, filePath);
}















// Read one sheet from an xlsx file; defaults to the first sheet
export function readExcel(filePath, sheetName) {
  const workbook = XLSX.readFile(filePath);
  const name     = sheetName ?? workbook.SheetNames[0];
  const sheet    = workbook.Sheets[name];
  if (!sheet) {
    throw new Error(`Sheet "${name}" not found in ${filePath}. Available: ${workbook.SheetNames.join(', ')}`);
  }
  return XLSX.utils.sheet_to_json(sheet);
}
