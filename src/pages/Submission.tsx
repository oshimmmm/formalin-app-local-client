import React, { useContext, useRef, useEffect, KeyboardEvent } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import { Formalin } from '../types/Formalin';

const Submission: React.FC = () => {
  const { formalinList, updateFormalinStatus } = useContext(FormalinContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const pendingSubmissionList = formalinList.filter((f: Formalin) => f.status === '出庫済み');
  const egressedList = formalinList.filter(
    (f: Formalin) => f.status === '出庫済み' || f.status === '提出済み'
  );

  const handleScan = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const id = target.value.trim();
      if (id) {
        const existingFormalin = formalinList.find((f: Formalin) => f.id === id);
        if (existingFormalin) {
          if (existingFormalin.status === '出庫済み') {
            updateFormalinStatus(id, '提出済み');
          } else {
            alert('このホルマリンは出庫されていません。');
          }
        } else {
          alert('ホルマリンが見つかりません。入庫してください。');
        }
        target.value = '';
      }
    }
  };

  return (
    <div>
      <h1>提出ページ</h1>
      <input
        type="text"
        ref={inputRef}
        onKeyPress={handleScan}
        placeholder="二次元バーコードを読み込んでください"
      />
      <h2>未提出のホルマリン一覧</h2>
      <FormalinTable formalinList={pendingSubmissionList} />
      <h2>出庫済みのホルマリン一覧</h2>
      <FormalinTable formalinList={egressedList} />
    </div>
  );
};

export default Submission;
