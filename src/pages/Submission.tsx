import React, { useContext, useRef, useEffect, KeyboardEvent, useState } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import { Formalin } from '../types/Formalin';

const Submission: React.FC = () => {
  const { formalinList, updateFormalinStatus } = useContext(FormalinContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // '出庫済み'のホルマリン一覧
  const pendingSubmissionList = formalinList.filter((f: Formalin) => f.status === '出庫済み');
  // '提出済み'のホルマリン一覧
  const submittedList = formalinList.filter((f: Formalin) => f.status === '提出済み');

  const handleScan = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const key = target.value.trim();
      if (key) {
        const existingFormalin = formalinList.find((f: Formalin) => f.key === key);
        if (existingFormalin) {
          if (existingFormalin.status === '出庫済み') {
            await updateFormalinStatus(existingFormalin.id, {
              status: '提出済み',
              timestamp: new Date(),
            });
            setErrorMessage('');
          } else {
            setErrorMessage('このホルマリンは出庫されていません。');
          }
        } else {
          setErrorMessage('ホルマリンが見つかりません。入庫してください。');
        }
        target.value = '';
      }
    }
  };

  return (
    <div>
      <h1 className='text-3xl font-bold mt-4 mb-10 ml-10'>提出する</h1>
      <input
        type="text"
        ref={inputRef}
        onKeyPress={handleScan}
        placeholder="二次元バーコードを読み込んでください"
        className="text-2xl border border-gray-300 rounded p-2 w-1/4 ml-10"
        // style={{ fontSize: '1.5em', padding: '10px', width: '30%' }}
      />

      {/* エラーメッセージの表示 */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <h2 className='text-xl mx-10 mt-8 mb-2'>未提出のホルマリン一覧（出庫済み）</h2>
          <div className='ml-10'>
          <FormalinTable formalinList={pendingSubmissionList} />
          </div>
        </div>
        <div style={{ width: '48%' }}>
          <h2 className='text-xl mx-2 mt-8 mb-2'>提出済みのホルマリン一覧</h2>
          <FormalinTable formalinList={submittedList} />
        </div>
      </div>
    </div>
  );
};

export default Submission;
