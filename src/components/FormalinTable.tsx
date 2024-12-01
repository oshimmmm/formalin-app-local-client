import React, { useState } from 'react';
import { Formalin } from '../types/Formalin';

interface FormalinTableProps {
  // ホルマリンリストという配列プロパティを持ち、各要素はFormalin型
  formalinList: Formalin[];
}

// FormalinTableコンポーネントを、React.FC型で定義。受け取るプロパティは、FormalinTablePropsつまりformalinListという配列プロパティで、中身はFormalin型。
// {formalinList}とすることで、props.formalinListの代わりに、直接formalinListにアクセスできる。
const FormalinTable: React.FC<FormalinTableProps> = ({ formalinList }) => {
  
  // ソート設定の状態管理
  // sortConfig:テーブルでどの列を基準にして、どの順序（昇順か降順か）でデータを並べるかを保持する。
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Formalin; // ソートする列の名前。Folmarlin型のキー（key, place, status, timestampのどれか）
    direction: 'asc' | 'desc'; // ソートの方向（昇順または降順）
  } | null>(null); //初期値はnull（ソート無し）

  // フィルタ設定の状態管理
  // selectedFilters:テーブルで適用するフィルタ条件を保持
  const [selectedFilters, setSelectedFilters] = useState<{
    [key in keyof Formalin]?: string; //Formalin型のプロパティ（key, place, status, timestamp）を動的にキーとして扱う型
  }>({});

  // フィルタ条件を更新する関数
  // 各列でフィルターを何か選択すると、選択された文言(e.target.value)がこの関数に渡されて、selectedFiltersの中身を更新する。
  const handleFilterChange = (key: keyof Formalin, value: string) => {
    // (prev) => { ... }で、引数prevは、現在のselectedFilters状態の値を示す。更新時に、前のフィルタ設定を保ちつつ、指定したkey(key, place, status, timestamp)の値を更新する
    setSelectedFilters((prev) => ({
      // ...prevで、現在のselectedFilters状態を展開して、新しいオブジェクト作成。
      // これによって以前のフィルタ設定を維持したまま、新しいフィルタ条件を追加、上書きできる。
      ...prev,
      // フィルタリンク対象の列（key）に新しい値（value）を設定。
      [key]: value || undefined, // valueが空の場合、undefinedに設定してフィルタ解除
    }));
    console.log("selectedFilters is: ", selectedFilters);
  };
  // handleFilterChangeの例
  // 現在の状態
  // selectedFilters = { key: '試薬IDの数字、5とか', status: '出庫済み'}
  // handleFielterChange('place', '内視鏡')を呼び出したら、、
  // selectedFilters = { key: '試薬ID', status: '出庫済み', place:'内視鏡'}
  // handleFilterChange('status', '')を呼び出したら、、
  // selectedFilters= { key: '試薬ID', place'内視鏡'}

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

  
  // 昇順か降順を実行する関数
  // key（ソート対象となる列の名前）を引数として受け取る
  // keyはFormalin型のプロパティ(key, place, status, timestamp)のどれか
  // この関数はソート条件を変更して、状態(sortConfig)を更新する
  const requestSort = (key: keyof Formalin) => {
    // sortConfigの初期状態として、ソート方向（direction）を昇順（asc）に設定
    let direction: 'asc' | 'desc' = 'asc';
    // ソート設定(sortConfig)が存在している（null ではない）場合は、、、
    // 現在ソート中の列（sortConfig.key）が、今回ソート対象に指定された列（key）と同じなら、、、
    // 現在のソート方向（sortConfig.direction）が昇順（asc）の場合は、、、
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      // 降順（desc）に切り替える
      direction = 'desc';
    }
    // setSortConfig を呼び出して、新しいソート設定を sortConfig に保存
    // ソート設定は、key: ソート対象となる列と、direction: ソートの方向（asc または desc）
    setSortConfig({ key, direction });
  };


  // ヘッダーのスタイルを取得する関数
  const getHeaderStyle = (columnKey: keyof Formalin) => {
    return {
      cursor: 'pointer',
      backgroundColor:
        // ソートかけている列ヘッダー(sortConfig.key)だけ背景色が濃くなる
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
              className='text-2xl'
            >
              試薬ID
            </div>
            <select
              value={selectedFilters.key || ''}
              onChange={(e) => handleFilterChange('key', e.target.value)}
              className="font-normal border border-gray-300 rounded"
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
              className='text-2xl'
            >
              出庫先
            </div>
            <select
              value={selectedFilters.place || ''}
              onChange={(e) => handleFilterChange('place', e.target.value)}
              className="font-normal border border-gray-300 rounded"
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
              className='text-2xl'
            >
              状態
            </div>
            <select
              value={selectedFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="font-normal border border-gray-300 rounded"
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
              className='text-2xl'
            >
              最終更新日時
            </div>
            <select
              value={selectedFilters.timestamp || ''}
              onChange={(e) => handleFilterChange('timestamp', e.target.value)}
              className="font-normal border border-gray-300 rounded"
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
