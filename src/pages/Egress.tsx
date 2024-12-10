import React, { useContext, useRef, useEffect, useState, KeyboardEvent } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import { Formalin } from '../types/Formalin';
import { parseFormalinCode } from '../utils/parseFormalinCode';

const Egress: React.FC = () => {
  // useContextを使うことで、FormalinContext内のFormalinListやupdateFormalinStatusにアクセスして、データの取得、表示、更新を行う。
  const { formalinList, updateFormalinStatus } = useContext(FormalinContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedPlace, setSelectedPlace] = useState<string>('');
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
      const code = target.value.trim();
      if (code) {
        const parsed = parseFormalinCode(code);
        if (!parsed) {
          setErrorMessage('無効なコードです。');
          target.value = '';
          return;
        }

        // 出庫先が選択されていない場合はエラーメッセージ表示
        if (selectedPlace === '') {
          setErrorMessage('出庫先を選択してください。');
          target.value = '';
          return;
        }

        const { serialNumber } = parsed;

        // 既存のホルマリンを検索
        const existingFormalin = formalinList.find((f: Formalin) => f.key === serialNumber);
        if (existingFormalin) {
          // 既存の場合、状態と場所を更新
          await updateFormalinStatus(existingFormalin.id, {
            status: '出庫済み',
            place: selectedPlace,
            timestamp: new Date(),
          });
          setErrorMessage('');
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
      <h1 className='text-3xl font-bold mt-4 mb-10 ml-10'>出庫する</h1>

      <label htmlFor="place-select" className='text-2xl ml-10'>出庫先を選択してください: </label>
      <select 
        id="place-select" 
        value={selectedPlace} 
        onChange={handlePlaceChange}
        className="text-2xl border border-gray-300 rounded p-2 w-1/5"
        // style={{ fontSize: '1.5em', padding: '10px', width: '20%' }}
      >
        <option value=""></option>
        <option value="病理">病理</option>
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
        className="text-2xl border border-gray-300 rounded p-2 w-1/3 ml-10"
        // style={{ fontSize: '1.5em', padding: '10px', width: '30%' }}
      />

      {/* エラーメッセージの表示 */}
      {errorMessage && <p className='text-red-500 ml-10'>{errorMessage}</p>}

      <h2 className='text-xl mx-10 mt-8 mb-2'>出庫済みホルマリン一覧</h2>
      <div className='ml-10'>
      <FormalinTable formalinList={egressedList} />
      </div>
      
    </div>
  );
};

export default Egress;
