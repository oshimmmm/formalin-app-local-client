import React, { useState } from 'react';
import { Formalin } from '../types/Formalin';

interface FormalinTableProps {
  // ホルマリンリストという配列プロパティを持ち、各要素はFormalin型
  formalinList: Formalin[];
  showLotNumber?: boolean;    // ロットナンバーを表示させるページは List.tsx のみにしたい
  showHistoryButton?: boolean; 
  onHistoryClick?: (key: string) => void; 
}

// FormalinTableコンポーネントを React.FC で定義
const FormalinTable: React.FC<FormalinTableProps> = ({
  formalinList,
  showLotNumber = false,
  showHistoryButton = false,
  onHistoryClick,
}) => {
  // ソート用の列名 (key, place, status, timestamp_str 等) を列挙
  type SortableKey = 'key' | 'place' | 'status' | 'timestamp_str' | 'expired' | 'size' | 'lotNumber';

  const [sortConfig, setSortConfig] = useState<{
    key: SortableKey;
    direction: 'asc' | 'desc';
  } | null>(null);

  // フィルタ用 State
  const [selectedFilters, setSelectedFilters] = useState<{
    [key in keyof Formalin]?: string;
  }>({});

  // フィルタ変更ハンドラ
  const handleFilterChange = (key: keyof Formalin, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  // ユニーク値を取得 (ここでは、f.timestamp_str はすでに string なので .toLocaleString()は不要)
  const uniqueValues = {
    key: Array.from(new Set(formalinList.map((item) => item.key))),
    place: Array.from(new Set(formalinList.map((item) => item.place))),
    status: Array.from(new Set(formalinList.map((item) => item.status))),
    // timestamp_str は文字列として保存している
    timestamp_str: Array.from(new Set(formalinList.map((item) => item.timestamp_str))),
    size: Array.from(new Set(formalinList.map((item) => item.size))),
    // expired がもし string なら同様に
    // expired_str: Array.from(new Set(formalinList.map((item) => item.expired_str))),
    // あるいは expired がまだ Date型なら toLocaleString() 等してください
    // (以下は例: expired が still Date の場合)
    expired: Array.from(new Set(formalinList.map((item) => item.expired.toLocaleString()))),
    lotNumber: Array.from(new Set(formalinList.map((item) => item.lotNumber))),
  };

  // フィルタ適用
  const filteredFormalinList = formalinList.filter((item) => {
    return Object.entries(selectedFilters).every(([key, val]) => {
      if (!val) return true;
      // 例: timestamp_str は文字列として比較
      if (key === 'timestamp_str') {
        return item.timestamp_str === val; 
      }
      // expired が Date の場合、toLocaleString() で比較
      if (key === 'expired') {
        return item.expired.toLocaleString() === val;
      }
      // それ以外は直接比較
      return (item as any)[key] === val; 
    });
  });

  // ソート適用
  const sortedFormalinList = React.useMemo(() => {
    if (sortConfig === null) return filteredFormalinList;

    return [...filteredFormalinList].sort((a, b) => {
      let aValue = (a as any)[sortConfig.key];
      let bValue = (b as any)[sortConfig.key];

      // timestamp_str は 文字列なので、文字列ソート
      if (sortConfig.key === 'timestamp_str') {
        // 小文字化して比較など
        aValue = (aValue as string).toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      // expired が Date なら getTime
      if (sortConfig.key === 'expired') {
        aValue = (aValue as Date).getTime();
        bValue = (bValue as Date).getTime();
      }
      // 文字列 vs 文字列
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      // number vs number
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      // それ以外は適当
      return 0;
    });
  }, [filteredFormalinList, sortConfig]);

  // ソートトリガ
  const requestSort = (key: SortableKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // テーブルヘッダーのスタイル
  const getHeaderStyle = (columnKey: keyof Formalin) => ({
    cursor: 'pointer',
    backgroundColor:
      sortConfig && sortConfig.key === columnKey ? '#e0e0e0' : '#f2f2f2',
  });

  return (
    <table className="w-11/12 table-fixed text-lg">
      <thead>
        <tr>
          {/* key */}
          <th className="border border-gray-300 p-2 text-left whitespace-normal break-words">
            <div
              onClick={() => requestSort('key')}
              style={getHeaderStyle('key')}
              className="text-lg cursor-pointer"
            >
              試薬ID
            </div>
            <select
              value={selectedFilters.key || ''}
              onChange={(e) => handleFilterChange('key', e.target.value)}
              className="font-normal border border-gray-300 rounded w-full"
            >
              <option value="">すべて</option>
              {uniqueValues.key.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </th>

          {/* place */}
          <th className="border border-gray-300 p-2 text-left">
            <div
              onClick={() => requestSort('place')}
              style={getHeaderStyle('place')}
              className="text-lg cursor-pointer"
            >
              場所
            </div>
            <select
              value={selectedFilters.place || ''}
              onChange={(e) => handleFilterChange('place', e.target.value)}
              className="font-normal border border-gray-300 rounded w-full"
            >
              <option value="">すべて</option>
              {uniqueValues.place.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </th>

          {/* status */}
          <th className="border border-gray-300 p-2 text-left">
            <div
              onClick={() => requestSort('status')}
              style={getHeaderStyle('status')}
              className="text-lg cursor-pointer"
            >
              状態
            </div>
            <select
              value={selectedFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="font-normal border border-gray-300 rounded w-full"
            >
              <option value="">すべて</option>
              {uniqueValues.status.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </th>

          {/* timestamp_str (文字列) */}
          <th className="border border-gray-300 p-2 text-left">
            <div
              onClick={() => requestSort('timestamp_str')}
              style={getHeaderStyle('timestamp_str')}
              className="text-lg cursor-pointer"
            >
              最終更新日時
            </div>
            <select
              value={selectedFilters.timestamp_str || ''}
              onChange={(e) => handleFilterChange('timestamp_str', e.target.value)}
              className="font-normal border border-gray-300 rounded w-full"
            >
              <option value="">すべて</option>
              {/** 
                * ここで uniqueValues.timestamp_str が必要なら
                *  uniqueValues.timestamp_str.map(...) で生成
                */}
            </select>
          </th>

          {/* size */}
          <th className="border border-gray-300 p-2 text-left">
            <div
              onClick={() => requestSort('size')}
              style={getHeaderStyle('size')}
              className="text-lg cursor-pointer"
            >
              規格
            </div>
            <select
              value={selectedFilters.size || ''}
              onChange={(e) => handleFilterChange('size', e.target.value)}
              className="font-normal border border-gray-300 rounded w-full"
            >
              <option value="">すべて</option>
              {uniqueValues.size.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </th>

          {/* expired (もし string にしたいなら expired_str にして同じ扱いにする) */}
          <th className="border border-gray-300 p-2 text-left">
            <div
              onClick={() => requestSort('expired')}
              style={getHeaderStyle('expired')}
              className="text-lg cursor-pointer"
            >
              有効期限
            </div>
            <select
              value={selectedFilters.expired || ''}
              onChange={(e) => handleFilterChange('expired', e.target.value)}
              className="font-normal border border-gray-300 rounded w-full"
            >
              <option value="">すべて</option>
              {uniqueValues.expired.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </th>

          {showLotNumber && (
            <th className="border border-gray-300 p-2 text-left">
              <div
                onClick={() => requestSort('lotNumber')}
                style={getHeaderStyle('lotNumber')}
                className="text-lg cursor-pointer"
              >
                ロットナンバー
              </div>
              <select
                value={selectedFilters.lotNumber || ''}
                onChange={(e) => handleFilterChange('lotNumber', e.target.value)}
                className="font-normal border border-gray-300 rounded w-full"
              >
                <option value="">すべて</option>
                {uniqueValues.lotNumber.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </th>
          )}

          {showHistoryButton && <th className="border border-gray-300 p-2 text-left">更新履歴</th>}
        </tr>
      </thead>

      <tbody>
        {sortedFormalinList.map((f) => (
          <tr
            key={f.id}
            style={{ backgroundColor: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9f9f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
            }}
          >
            <td className="border border-gray-300 p-2 whitespace-normal break-words">{f.key}</td>
            <td className="border border-gray-300 p-2">{f.place}</td>
            <td className="border border-gray-300 p-2">{f.status}</td>

            {/* timestamp_str をそのまま表示 */}
            <td className="border border-gray-300 p-2">{f.timestamp_str}</td>

            <td className="border border-gray-300 p-2">{f.size}</td>

            {/* expired がまだ Date なら toLocaleString() する、または "expired_str" にしてそのまま表示 */}
            <td className="border border-gray-300 p-2">{f.expired.toLocaleString()}</td>

            {showLotNumber && (
              <td className="border border-gray-300 p-2">{f.lotNumber}</td>
            )}

            {showHistoryButton && (
              <td className="border border-gray-300 p-2">
                {onHistoryClick && (
                  <button
                    className="text-blue-500 underline"
                    onClick={() => {
                      console.log('onHistoryClick triggered with key:', f.key);
                      onHistoryClick(f.key);
                    }}
                  >
                    履歴
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FormalinTable;
