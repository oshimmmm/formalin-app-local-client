import React, { useState } from 'react';
import { Formalin } from '../types/Formalin';

interface FormalinTableProps {
  formalinList: Formalin[];
}

const FormalinTable: React.FC<FormalinTableProps> = ({ formalinList }) => {
  // ソート設定の状態管理
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Formalin;
    direction: 'asc' | 'desc';
  } | null>(null);

  // フィルタリングの状態管理
  const [selectedFilters, setSelectedFilters] = useState<{
    [key in keyof Formalin]?: string;
  }>({});

  // 選択されたフィルターを更新する関数
  const handleFilterChange = (key: keyof Formalin, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  // 各列のユニークな値を取得
  const uniqueValues = {
    key: Array.from(new Set(formalinList.map((item) => item.key))),
    place: Array.from(new Set(formalinList.map((item) => item.place))),
    status: Array.from(new Set(formalinList.map((item) => item.status))),
    timestamp: Array.from(
      new Set(formalinList.map((item) => item.timestamp.toLocaleString()))
    ),
  };

  // フィルタリングを適用
  const filteredFormalinList = formalinList.filter((item) => {
    return Object.entries(selectedFilters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'timestamp') {
        return item.timestamp.toLocaleString() === value;
      }
      return item[key as keyof Formalin] === value;
    });
  });

  // ソートを適用
  const sortedFormalinList = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...filteredFormalinList].sort((a, b) => {
        let aValue: string | number | Date = a[sortConfig.key];
        let bValue: string | number | Date = b[sortConfig.key];

        if (sortConfig.key === 'timestamp') {
          aValue = a.timestamp.getTime();
          bValue = b.timestamp.getTime();
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else {
      return filteredFormalinList;
    }
  }, [filteredFormalinList, sortConfig]);

  // ソートをリクエストする関数
  const requestSort = (key: keyof Formalin) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // ヘッダーのスタイルを取得する関数
  const getHeaderStyle = (columnKey: keyof Formalin) => {
    return {
      cursor: 'pointer',
      backgroundColor:
        sortConfig && sortConfig.key === columnKey ? '#e0e0e0' : '#f2f2f2',
    };
  };

  return (
    <table
      style={{
        width: '80%',
        fontSize: '1.1em',
      }}
    >
      <thead>
        <tr>
          {/* Key 列 */}
          <th
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              textAlign: 'left',
            }}
          >
            <div
              onClick={() => requestSort('key')}
              style={{ ...getHeaderStyle('key') }}
            >
              Key
            </div>
            <select
              value={selectedFilters.key || ''}
              onChange={(e) => handleFilterChange('key', e.target.value)}
            >
              <option value="">すべて</option>
              {uniqueValues.key.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </th>
          {/* Place 列 */}
          <th
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              textAlign: 'left',
            }}
          >
            <div
              onClick={() => requestSort('place')}
              style={{ ...getHeaderStyle('place') }}
            >
              Place
            </div>
            <select
              value={selectedFilters.place || ''}
              onChange={(e) => handleFilterChange('place', e.target.value)}
            >
              <option value="">すべて</option>
              {uniqueValues.place.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </th>
          {/* Status 列 */}
          <th
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              textAlign: 'left',
            }}
          >
            <div
              onClick={() => requestSort('status')}
              style={{ ...getHeaderStyle('status') }}
            >
              Status
            </div>
            <select
              value={selectedFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">すべて</option>
              {uniqueValues.status.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </th>
          {/* Timestamp 列 */}
          <th
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              textAlign: 'left',
            }}
          >
            <div
              onClick={() => requestSort('timestamp')}
              style={{ ...getHeaderStyle('timestamp') }}
            >
              Timestamp
            </div>
            <select
              value={selectedFilters.timestamp || ''}
              onChange={(e) => handleFilterChange('timestamp', e.target.value)}
            >
              <option value="">すべて</option>
              {uniqueValues.timestamp.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedFormalinList.map((f) => (
          <tr
            key={f.id}
            style={{
              backgroundColor: '#fff',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9f9f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
            }}
          >
            <td
              style={{
                border: '1px solid #ddd',
                padding: '10px',
              }}
            >
              {f.key}
            </td>
            <td
              style={{
                border: '1px solid #ddd',
                padding: '10px',
              }}
            >
              {f.place}
            </td>
            <td
              style={{
                border: '1px solid #ddd',
                padding: '10px',
              }}
            >
              {f.status}
            </td>
            <td
              style={{
                border: '1px solid #ddd',
                padding: '10px',
              }}
            >
              {f.timestamp.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FormalinTable;
