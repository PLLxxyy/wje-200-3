import { GiftRecord, OCCASION_ICONS } from '../types';

interface Props {
  records: GiftRecord[];
  onDelete: (id: string) => void;
  onSelectPerson?: (name: string) => void;
}

function RecordList({ records, onDelete, onSelectPerson }: Props) {
  if (records.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">{'\u{1F4CB}'}</div>
        <p>暂无记录</p>
        <p style={{ marginTop: 6, fontSize: 12 }}>点击右下角 + 号添加第一条礼金记录</p>
      </div>
    );
  }

  return (
    <div className="record-list">
      {records.map(r => (
        <div className="record-card" key={r.id}>
          <div className={`icon ${r.type === 'give' ? 'icon-give' : 'icon-receive'}`}>
            {OCCASION_ICONS[r.occasion]}
          </div>
          <div className="record-info">
            {onSelectPerson ? (
              <button
                type="button"
                className="record-name record-name-link"
                onClick={() => onSelectPerson(r.name)}
                aria-label={`查看 ${r.name} 的往来明细`}
              >
                {r.name}
              </button>
            ) : (
              <div className="record-name">{r.name}</div>
            )}
            <div className="record-meta">
              <span className="tag">{r.occasion}</span>
              <span>{r.date}</span>
            </div>
          </div>
          <div className="record-amount">
            <div className={`amount ${r.type === 'give' ? 'amount-give' : 'amount-receive'}`}>
              {r.type === 'give' ? '-' : '+'}{r.amount.toLocaleString()}
            </div>
            <div className="type-label">{r.type === 'give' ? '送出' : '收到'}</div>
          </div>
          <button
            className="delete-btn"
            onClick={() => onDelete(r.id)}
            title="删除"
          >
            {'✕'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default RecordList;
