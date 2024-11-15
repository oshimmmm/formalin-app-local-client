import React, { useContext, useRef, useEffect, useState, KeyboardEvent } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import { Formalin } from '../types/Formalin';

const Egress: React.FC = () => {
  // useContextを使うことで、FormalinContext内のFormalinListやupdateFormalinStatusにアクセスして、データの取得、表示、更新を行う。
  const { formalinList, updateFormalinStatus } = useContext(FormalinContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedPlace, setSelectedPlace] = useState<string>('内視鏡');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const egressedList = formalinList.filter((f: Formalin) => f.status === '出庫済み');

  const handlePlaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlace(e.target.value);
  };

  const handleScan = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const key = target.value.trim();
      if (key) {
        // 既存のホルマリンを検索
        const existingFormalin = formalinList.find((f: Formalin) => f.key === key);
        if (existingFormalin) {
          // 既存の場合、状態と場所を更新
          await updateFormalinStatus(existingFormalin.id, {
            status: '出庫済み',
            place: selectedPlace,
            timestamp: new Date(),
          });
          setErrorMessage(''); // エラーメッセージをクリア
        } else {
          // エラーメッセージを表示
          setErrorMessage('入庫されていません。');
        }
        target.value = '';
      }
    }
  };

  return (
    <div>
      <h1>出庫ページ</h1>

      <label htmlFor="place-select" style={{ fontSize: '1.5em'}}>出庫先を選択してください: </label>
      <select 
        id="place-select" 
        value={selectedPlace} 
        onChange={handlePlaceChange}
        style={{ fontSize: '1.5em', padding: '10px', width: '20%' }}
      >
        <option value="内視鏡">内視鏡</option>
        <option value="外科">外科</option>
        <option value="内科">内科</option>
        <option value="病棟">病棟</option>
      </select>

      <br /><br />

      <input
        type="text"
        ref={inputRef}
        onKeyPress={handleScan}
        placeholder="二次元バーコードを読み込んでください"
        style={{ fontSize: '1.5em', padding: '10px', width: '20%' }}
      />

      {/* エラーメッセージの表示 */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <h2>出庫済みホルマリン一覧</h2>
      <FormalinTable formalinList={egressedList} />
    </div>
  );
};

export default Egress;
