export interface GiftRecord {
  id: string;
  name: string;
  occasion: Occasion;
  amount: number;
  date: string;
  type: 'give' | 'receive';
  note?: string;
}

export type Occasion = '婚礼' | '满月' | '乔迁' | '生日' | '丧事' | '其他';

export const OCCASIONS: Occasion[] = ['婚礼', '满月', '乔迁', '生日', '丧事', '其他'];

export const OCCASION_ICONS: Record<Occasion, string> = {
  '婚礼': '\u{1F492}',
  '满月': '\u{1F476}',
  '乔迁': '\u{1F3E0}',
  '生日': '\u{1F382}',
  '丧事': '\u{1F54A}',
  '其他': '\u{1F4E6}',
};
