import { useState, useEffect, useCallback } from 'react';
import { GiftRecord, Occasion } from './types';
import { loadRecords, addRecord, deleteRecord } from './utils/storage';
import RecordList from './components/RecordList';
import RecordForm from './components/RecordForm';
import Statistics from './components/Statistics';

type Page = 'list' | 'stats';

function App() {
  const [page, setPage] = useState<Page>('list');
  const [records, setRecords] = useState<GiftRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterOccasion, setFilterOccasion] = useState<Occasion | ''>('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const handleAdd = useCallback((record: GiftRecord) => {
    const updated = addRecord(record);
    setRecords(updated);
    setShowForm(false);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      const updated = deleteRecord(id);
      setRecords(updated);
    }
  }, []);

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  const filtered = sorted.filter(r => {
    const matchSearch = !search || r.name.includes(search);
    const matchOccasion = !filterOccasion || r.occasion === filterOccasion;
    return matchSearch && matchOccasion;
  });

  return (
    <>
      {page === 'list' && (
        <>
          <div className="header">
            <div className="header-row">
              <div style={{ width: 50 }} />
              <h1>随份子礼金簿</h1>
              <button className="header-btn" onClick={() => setShowFilter(!showFilter)}>
                {filterOccasion ? '已筛选' : '筛选'}
              </button>
            </div>
          </div>

          <div className="search-bar">
            <input
              className="search-input"
              placeholder="搜索姓名..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="filter-btn" onClick={() => setSearch('')}>清除</button>
            )}
          </div>

          {showFilter && (
            <OccasionFilter
              selected={filterOccasion}
              onSelect={occ => {
                setFilterOccasion(occ === filterOccasion ? '' : occ);
              }}
            />
          )}

          <RecordList records={filtered} onDelete={handleDelete} />

          <button className="fab" onClick={() => setShowForm(true)} aria-label="新增记录">
            +
          </button>
        </>
      )}

      {page === 'stats' && (
        <>
          <div className="header">
            <div className="header-row">
              <div style={{ width: 50 }} />
              <h1>收支统计</h1>
              <div style={{ width: 50 }} />
            </div>
          </div>
          <Statistics records={records} />
        </>
      )}

      {showForm && (
        <RecordForm onAdd={handleAdd} onClose={() => setShowForm(false)} />
      )}

      <nav className="bottom-nav">
        <button
          className={`nav-item ${page === 'list' ? 'active' : ''}`}
          onClick={() => setPage('list')}
        >
          <span className="nav-icon">{'\u{1F4CB}'}</span>
          <span>记录</span>
        </button>
        <button
          className={`nav-item ${page === 'stats' ? 'active' : ''}`}
          onClick={() => setPage('stats')}
        >
          <span className="nav-icon">{'\u{1F4CA}'}</span>
          <span>统计</span>
        </button>
      </nav>
    </>
  );
}

function OccasionFilter({
  selected,
  onSelect,
}: {
  selected: Occasion | '';
  onSelect: (occ: Occasion) => void;
}) {
  const occasions: Occasion[] = ['婚礼', '满月', '乔迁', '生日', '丧事', '其他'];
  return (
    <div className="filter-dropdown">
      {occasions.map(occ => (
        <button
          key={occ}
          className={`filter-chip ${selected === occ ? 'active' : ''}`}
          onClick={() => onSelect(occ)}
        >
          {occ}
        </button>
      ))}
    </div>
  );
}

export default App;
