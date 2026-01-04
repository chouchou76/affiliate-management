export function parseDDMMYYYY(input: any): Date | null {
  if (!input) return null;

  // ✅ Nếu đã là Date
  if (input instanceof Date && !isNaN(input.getTime())) {
    return input;
  }

  // ✅ Nếu là Excel serial number
  if (typeof input === 'number') {
    // Excel epoch: 1899-12-30
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + input * 86400000);
    return isNaN(date.getTime()) ? null : date;
  }

  // ✅ Nếu là string dd-MM-yyyy
  if (typeof input === 'string') {
    const parts = input.split('-');
    if (parts.length !== 3) return null;

    const [dd, mm, yyyy] = parts.map(Number);
    if (!dd || !mm || !yyyy) return null;

    return new Date(yyyy, mm - 1, dd);
  }

  return null;
}
