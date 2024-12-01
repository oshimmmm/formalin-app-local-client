import React, { useContext, useRef, useEffect, KeyboardEvent, useState } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import { Formalin } from '../types/Formalin';

const Ingress: React.FC = () => {
  const { formalinList, addFormalin } = useContext(FormalinContext);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const ingressedList = formalinList.filter((f: Formalin) => f.status === '入庫済み');

  const handleScan = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const key = target.value.trim();
      if (key) {
        // 既存のホルマリンを検索
        const existingFormalin = formalinList.find((f) => f.key === key);
        if (existingFormalin) {
          setErrorMessage('このホルマリンは既に入庫済です。');
        } else {
          // 新規データを追加
          await addFormalin({
            key,
            place: '病理',
            status: '入庫済み',
            timestamp: new Date(),
          });
          setErrorMessage('');
        }
        target.value = '';
      }
    }
  };

  return (
    <div>
      <h1 className='text-3xl font-bold mt-4 mb-10 ml-10'>入庫する</h1>
      {/* バーコード入力フィールド */}
      <input
        type="text"
        ref={inputRef}
        onKeyPress={handleScan}
        placeholder="二次元バーコードを読み込んでください"
        className="text-2xl border border-gray-300 rounded p-2 w-1/4 ml-10"
        // style={{ fontSize: '1.5em', padding: '10px', width: '30%' }}
      />

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
      <h2 className='text-xl mx-10 mt-8 mb-2'>入庫済みホルマリン一覧</h2>
      <div className='ml-10'>
      <FormalinTable formalinList={ingressedList} />
      </div>
      
    </div>
  );
};

export default Ingress;
