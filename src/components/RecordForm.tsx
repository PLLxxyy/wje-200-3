import { useState } from 'react';
import { GiftRecord, Occasion, OCCASIONS, OCCASION_ICONS } from '../types';
import { generateId } from '../utils/storage';

interface Props {
  onAdd: (record: GiftRecord) => void;
  onClose: () => void;
}

function RecordForm({ onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'give' | 'receive'>('give');
  const [occasion, setOccasion] = useState<Occasion>('婚礼');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  const canSubmit = !!(name.trim() && amount && Number(amount) > 0 && date);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd({
      id: generateId(),
      name: name.trim(),
      occasion,
      amount: Number(amount),
      date,
      type,
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>新增记录</h2>
          <button className="modal-close" onClick={onClose}>{'✕'}</button>
        </div>

        <div className="form-group">
          <label className="form-label">收/送</label>
          <div className="type-switch">
            <div
              className={`type-option ${type === 'give' ? 'selected-give' : ''}`}
              onClick={() => setType('give')}
            >
              {'\u{1F4E4}'} 送出
            </div>
            <div
              className={`type-option ${type === 'receive' ? 'selected-receive' : ''}`}
              onClick={() => setType('receive')}
            >
              {'\u{1F4E5}'} 收到
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">对方姓名</label>
          <input
            className="form-input"
            placeholder="请输入姓名"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">场合</label>
          <div className="occasion-grid">
            {OCCASIONS.map(occ => (
              <div
                key={occ}
                className={`occasion-option ${occasion === occ ? 'selected' : ''}`}
                onClick={() => setOccasion(occ)}
              >
                <span className="occasion-icon">{OCCASION_ICONS[occ]}</span>
                {occ}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">金额（元）</label>
          <input
            className="form-input"
            type="number"
            placeholder="请输入金额"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="1"
          />
        </div>

        <div className="form-group">
          <label className="form-label">日期</label>
          <input
            className="form-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">备注（可选）</label>
          <input
            className="form-input"
            placeholder="补充说明"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={!canSubmit}>
          保存
        </button>
      </div>
    </div>
  );
}

export default RecordForm;
