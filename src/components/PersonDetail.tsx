import { useMemo } from 'react';
import { GiftRecord, OCCASION_ICONS } from '../types';

interface Props {
  name: string;
  records: GiftRecord[];
  onDelete: (id: string) => void;
}

function PersonDetail({ name, records, onDelete }: Props) {
  const sorted = useMemo(
    () => [...records].sort((a, b) => b.date.localeCompare(a.date)),
    [records]
  );

  const stats = useMemo(() => {
    let giveTotal = 0;
    let receiveTotal = 0;
    let giveCount = 0;
    let receiveCount = 0;
    for (const r of records) {
      if (r.type === 'give') {
        giveTotal += r.amount;
        giveCount++;
      } else {
        receiveTotal += r.amount;
        receiveCount++;
      }
    }
    const net = receiveTotal - giveTotal;
    const hasUnreturned = giveTotal > 0 && receiveTotal === 0;
    return { giveTotal, receiveTotal, giveCount, receiveCount, net, hasUnreturned };
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">{'\u{1F4CB}'}</div>
        <p>暂无往来记录</p>
      </div>
    );
  }

  return (
    <div className="person-detail">
      {stats.hasUnreturned && (
        <div className="unreturned-tip">
          {'⚠'} 你曾向 {name} 送出礼金 {stats.giveCount} 次，共 {stats.giveTotal.toLocaleString()} 元，尚未收到回礼
        </div>
      )}

      <div className="stats-cards">
        <div className="stat-card stat-give">
          <div className="stat-label">送出</div>
          <div className="stat-value">{stats.giveTotal.toLocaleString()}</div>
          <div className="stat-sub">{stats.giveCount} 次</div>
        </div>
        <div className="stat-card stat-receive">
          <div className="stat-label">收到</div>
          <div className="stat-value">{stats.receiveTotal.toLocaleString()}</div>
          <div className="stat-sub">{stats.receiveCount} 次</div>
        </div>
        <div className="stat-card stat-net">
          <div className="stat-label">净额</div>
          <div className="stat-value" style={{ color: stats.net >= 0 ? '#27ae60' : '#d4402f' }}>
            {stats.net >= 0 ? '+' : ''}{stats.net.toLocaleString()}
          </div>
          <div className="stat-sub">收-送</div>
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-title">
          往来明细
          <span style={{ fontWeight: 400, fontSize: 12, color: '#999', marginLeft: 8 }}>
            共 {records.length} 条
          </span>
        </div>
        <div className="record-list" style={{ padding: 0 }}>
          {sorted.map(r => (
            <div className="record-card detail-card" key={r.id}>
              <div className={`icon ${r.type === 'give' ? 'icon-give' : 'icon-receive'}`}>
                {OCCASION_ICONS[r.occasion]}
              </div>
              <div className="record-info">
                <div className="record-meta">
                  <span className="tag">{r.occasion}</span>
                  <span>{r.date}</span>
                </div>
                {r.note && <div className="record-note">{r.note}</div>}
              </div>
              <div className="record-amount">
                <div className={`amount ${r.type === 'give' ? 'amount-give' : 'amount-receive'}`}>
                  {r.type === 'give' ? '-' : '+'}{r.amount.toLocaleString()}
                </div>
                <div className="type-label">{r.type === 'give' ? '送出' : '收到'}</div>
              </div>
              <button
                className="delete-btn"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(r.id);
                }}
                title="删除"
              >
                {'✕'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PersonDetail;
