import React, { useState } from 'react';
import { Formalin } from '../types/Formalin';

interface FormalinTableProps {
  // ホルマリンリストという配列プロパティを持ち、各要素はFormalin型
  formalinList: Formalin[];
}

// FormalinTableコンポーネントを、React.FC型で定義。受け取るプロパティは、FormalinTableProps。
// {formalinList}とすることで、props.formalinListの代わりに、直接formalinListにアクセスできる。
const FormalinTable: React.FC<FormalinTableProps> = ({ formalinList }) => {
  // ソート設定の状態管理
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Formalin; // ソート対象の列
    direction: 'asc' | 'desc'; // ソートの方向（昇順または降順）
  } | null>(null); //初期値はnull（ソート無し）

  // フィルタリングの状態管理
  // テーブルで適用するフィルタ条件を管理
  const [selectedFilters, setSelectedFilters] = useState<{
    [key in keyof Formalin]?: string;
  }>({});

  // 選択されたkeyに対して新しいフィルタ値Valueを設定する関数
  const handleFilterChange = (key: keyof Formalin, value: string) => {
    // 前のフィルタ設定を保ちつつ、指定したkeyの値を更新する
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value || undefined, // valueが空の場合、undefinedに設定してフィルタ解除
    }));
  };

  // 各列のユニークな値を取得
  const uniqueValues = {
    // Setを使って重複を排除して、Array.fromで配列に変換。
    key: Array.from(new Set(formalinList.map((item) => item.key))),
    place: Array.from(new Set(formalinList.map((item) => item.place))),
    status: Array.from(new Set(formalinList.map((item) => item.status))),
    timestamp: Array.from(
      // toLocaleStringメソッドで文字列に変換
      new Set(formalinList.map((item) => item.timestamp.toLocaleString()))
    ),
  };

  // 選択されたフィルタ条件に一致する項目だけを含む配列
  const filteredFormalinList = formalinList.filter((item) => {
    return Object.entries(selectedFilters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'timestamp') {
        return item.timestamp.toLocaleString() === value;
      }
      return item[key as keyof Formalin] === value;
    });
  });

  // ソートを適用React.useMemoはメモ化用のフック。依存データ（filteredFormalinListとsortConfig）が変更されたときだけ再計算される
  // sortedFormalinListにソート済みのデータを格納し、不要な再計算を防ぐためにメモ化
  const sortedFormalinList = React.useMemo(() => {

    // sortConfigがnull以外だったら（ソート条件が存在するなら）
    if (sortConfig !== null) {
      // [...filteredFormalinList]でfilteredFormalinListをコピーし、新しい配列として操作するためにソートする。
      // sort関数を使い、a, bに基づいて並び替えを実行する
      return [...filteredFormalinList].sort((a, b) => {
        // ソートする対象の値をaValueとbValueに格納する
        // sortConfig.keyは、ソート対象のプロパティ名（key,place,status,timestamp）を表す。
        let aValue: string | number | Date = a[sortConfig.key]; // a[sortConfig.key]で各オブジェクトのソート対象の値を取得。
        let bValue: string | number | Date = b[sortConfig.key];

        // timestampでソートするなら、getTimeメソッド使ってミリ秒単位の数値に変換。
        if (sortConfig.key === 'timestamp') {
          aValue = a.timestamp.getTime();
          bValue = b.timestamp.getTime();

          // 文字列でソートするなら、大文字と小文字を区別しないように全て小文字に変換
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase(); // toLowerCaseで、avalueの文字列を全て小文字にする。
          bValue = bValue.toLowerCase();
        }

        // aValueがbValueより小さい場合、昇順（asc）なら-1を返し、降順（desc）なら1を返す。
        // sort関数は、-1を返すとa→bとなるように並び替える。
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        // aValueとbValueが等しいとき、0を返す。これはsort関数で並び替え不要を示す。
        return 0;
      });

    // sortConfigがnullだったら（ソート条件が無い場合）、
    } else {
      // filteredFormalinListをそのまま表示
      return filteredFormalinList;
    }
  
  // filteredFormalinListやsortConfigが変わったときだけ、再レンダリング
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
