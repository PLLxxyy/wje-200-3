import { useMemo } from 'react';
import { GiftRecord } from '../types';

interface Props {
  records: GiftRecord[];
  onSelectPerson?: (name: string) => void;
}

interface PersonSummary {
  name: string;
  giveTotal: number;
  receiveTotal: number;
  giveCount: number;
  receiveCount: number;
  net: number;
  hasUnreturned: boolean;
}

function Statistics({ records, onSelectPerson }: Props) {
  const totalGive = useMemo(
    () => records.filter(r => r.type === 'give').reduce((s, r) => s + r.amount, 0),
    [records]
  );
  const totalReceive = useMemo(
    () => records.filter(r => r.type === 'receive').reduce((s, r) => s + r.amount, 0),
    [records]
  );
  const net = totalReceive - totalGive;

  const personSummaries = useMemo(() => {
    const map = new Map<string, PersonSummary>();

    for (const r of records) {
      let p = map.get(r.name);
      if (!p) {
        p = { name: r.name, giveTotal: 0, receiveTotal: 0, giveCount: 0, receiveCount: 0, net: 0, hasUnreturned: false };
        map.set(r.name, p);
      }
      if (r.type === 'give') {
        p.giveTotal += r.amount;
        p.giveCount++;
      } else {
        p.receiveTotal += r.amount;
        p.receiveCount++;
      }
    }

    const result: PersonSummary[] = [];
    for (const p of map.values()) {
      p.net = p.receiveTotal - p.giveTotal;
      // 未还礼：我送了对方但对方从未回礼（收到为0，送出>0）
      p.hasUnreturned = p.giveTotal > 0 && p.receiveTotal === 0;
      result.push(p);
    }

    // 有未还礼的排前面，然后按净额排序
    result.sort((a, b) => {
      if (a.hasUnreturned !== b.hasUnreturned) return a.hasUnreturned ? -1 : 1;
      return b.giveTotal - a.giveTotal;
    });

    return result;
  }, [records]);

  const unreturned = personSummaries.filter(p => p.hasUnreturned);

  if (records.length === 0) {
    return (
      <div className="stats-empty">
        <div className="empty-icon">{'\u{1F4CA}'}</div>
        <p>暂无数据</p>
        <p style={{ marginTop: 6, fontSize: 12 }}>添加记录后可查看统计</p>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="stats-cards">
        <div className="stat-card stat-give">
          <div className="stat-label">总送出</div>
          <div className="stat-value">{totalGive.toLocaleString()}</div>
        </div>
        <div className="stat-card stat-receive">
          <div className="stat-label">总收到</div>
          <div className="stat-value">{totalReceive.toLocaleString()}</div>
        </div>
        <div className="stat-card stat-net">
          <div className="stat-label">净收支</div>
          <div className="stat-value" style={{ color: net >= 0 ? '#27ae60' : '#d4402f' }}>
            {net >= 0 ? '+' : ''}{net.toLocaleString()}
          </div>
        </div>
      </div>

      {unreturned.length > 0 && (
        <div className="summary-section">
          <div className="summary-title">
            {'⚠'} 未还礼提醒
            <span style={{ fontWeight: 400, fontSize: 12, color: '#999', marginLeft: 8 }}>
              共 {unreturned.length} 人
            </span>
          </div>
          {unreturned.map(p => (
            <div
              className="summary-row unreturned summary-row-clickable"
              key={p.name}
              onClick={() => onSelectPerson && onSelectPerson(p.name)}
            >
              <div className="summary-avatar">{p.name.slice(0, 1)}</div>
              <div className="summary-info">
                <div className="summary-name">
                  {p.name}
                  <span className="unreturned-badge">未还礼</span>
                </div>
                <div className="summary-detail">
                  送出 {p.giveCount} 次，共 {p.giveTotal.toLocaleString()} 元
                </div>
              </div>
              <div className="summary-amounts">
                <div className="s-net" style={{ color: '#d4402f' }}>
                  -{p.giveTotal.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="summary-section">
        <div className="summary-title">按人汇总</div>
        {personSummaries.map(p => (
          <div
            className={`summary-row ${p.hasUnreturned ? 'unreturned' : ''} summary-row-clickable`}
            key={p.name}
            onClick={() => onSelectPerson && onSelectPerson(p.name)}
          >
            <div className="summary-avatar">{p.name.slice(0, 1)}</div>
            <div className="summary-info">
              <div className="summary-name">
                {p.name}
                {p.hasUnreturned && <span className="unreturned-badge">未还礼</span>}
              </div>
              <div className="summary-detail">
                送出 {p.giveCount} 次 / 收到 {p.receiveCount} 次
              </div>
            </div>
            <div className="summary-amounts">
              {p.giveTotal > 0 && <div className="s-give">送出 {p.giveTotal.toLocaleString()}</div>}
              {p.receiveTotal > 0 && <div className="s-receive">收到 {p.receiveTotal.toLocaleString()}</div>}
              <div className="s-net" style={{ color: p.net >= 0 ? '#27ae60' : '#d4402f' }}>
                净 {p.net >= 0 ? '+' : ''}{p.net.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Statistics;
