import { GiftRecord } from '../types';

const STORAGE_KEY = 'gift_money_records';

export function loadRecords(): GiftRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GiftRecord[];
  } catch {
    return [];
  }
}

export function saveRecords(records: GiftRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addRecord(record: GiftRecord): GiftRecord[] {
  const records = loadRecords();
  records.push(record);
  saveRecords(records);
  return records;
}

export function deleteRecord(id: string): GiftRecord[] {
  const records = loadRecords().filter(r => r.id !== id);
  saveRecords(records);
  return records;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
