import React, { useContext, useRef, useEffect, KeyboardEvent } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import { Formalin } from '../types/Formalin';

const Egress: React.FC = () => {
  const { formalinList, updateFormalinStatus } = useContext(FormalinContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const filteredList = formalinList.filter(
    (f: Formalin) => f.status === '出庫済み' || f.status === '入庫済み'
  );

  const handleScan = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const id = target.value.trim();
      if (id) {
        const existingFormalin = formalinList.find((f: Formalin) => f.id === id);
        if (existingFormalin) {
          if (existingFormalin.status === '入庫済み') {
            updateFormalinStatus(id, '出庫済み');
          } else {
            alert('このホルマリンはすでに出庫されています。');
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
      <h1>出庫ページ</h1>
      <input
        type="text"
        ref={inputRef}
        onKeyPress={handleScan}
        placeholder="二次元バーコードを読み込んでください"
      />
      <FormalinTable formalinList={filteredList} />
    </div>
  );
};

export default Egress;
