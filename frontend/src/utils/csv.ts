export type CsvColumn<T> = {
  key: keyof T | string;
  header: string;
  value?: (row: T) => unknown;
};

function csvEscape(value: unknown) {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function normalizeFilename(filename: string) {
  return filename.endsWith('.csv') ? filename : `${filename}.csv`;
}

export function downloadCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]) {
  const header = columns.map(column => csvEscape(column.header)).join(',');
  const body = rows.map(row => columns.map(column => {
    if (column.value) return csvEscape(column.value(row));
    return csvEscape((row as Record<string, unknown>)[String(column.key)]);
  }).join(','));

  const csv = ['\uFEFF' + header, ...body].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = normalizeFilename(filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCsv(text: string): Record<string, string>[] {
  const source = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field.trim());
      field = '';
      continue;
    }

    if (char === '\n' && !inQuotes) {
      row.push(field.trim());
      if (row.some(cell => cell.length > 0)) rows.push(row);
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  row.push(field.trim());
  if (row.some(cell => cell.length > 0)) rows.push(row);
  if (rows.length === 0) return [];

  const headers = rows[0].map(header => header.trim());
  return rows.slice(1).map(values => Object.fromEntries(
    headers.map((header, index) => [header, values[index]?.trim() ?? ''])
  ));
}

export async function readCsvFile(file: File) {
  return parseCsv(await file.text());
}
