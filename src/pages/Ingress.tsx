import React, { useContext, useRef, useEffect, KeyboardEvent, useState } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import { Formalin } from '../types/Formalin';
import { parseFormalinCode } from '../utils/parseFormalinCode';
import { useUserContext } from '../context/UserContext';

const Ingress: React.FC = () => {
  const { formalinList, addFormalin } = useContext(FormalinContext);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserContext(); // ログイン中ユーザー

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const ingressedList = formalinList.filter((f: Formalin) => f.status === '入庫済み');

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

        const { serialNumber, size, expirationDate, lotNumber } = parsed;

        const now = new Date();
        const timeDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()));

        // 既存のホルマリンを検索
        const existingFormalin = formalinList.find((f) => f.key === serialNumber);
        if (existingFormalin) {
          setErrorMessage('このホルマリンは既に入庫済です。');
        } else {
          // 新規データを追加
          await addFormalin({
            key: serialNumber,
            place: '病理',
            status: '入庫済み',
            timestamp: timeDate,
            size: size,
            expired: expirationDate,
            lotNumber: lotNumber,
          },
          user?.username || 'anonymous'
        );
          setErrorMessage('');
        }
        // console.log("formalinList is: ", formalinList);
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
        className="text-2xl border border-gray-300 rounded p-2 w-1/3 ml-10"
        // style={{ fontSize: '1.5em', padding: '10px', width: '30%' }}
      />

      {errorMessage && <p className='text-red-500 ml-10'>{errorMessage}</p>}
      
      <h2 className='text-xl mx-10 mt-8 mb-2'>入庫済みホルマリン一覧</h2>
      <div className='ml-10'>
      <FormalinTable formalinList={ingressedList} />
      </div>
      
    </div>
  );
};

export default Ingress;
