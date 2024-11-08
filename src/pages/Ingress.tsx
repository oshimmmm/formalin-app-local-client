import React, { useContext, useRef, useEffect, KeyboardEvent } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import { Formalin } from '../types/Formalin';

const Ingress: React.FC = () => {
  const { formalinList, addFormalin, updateFormalinStatus } = useContext(FormalinContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const filteredList = formalinList.filter((f: Formalin) => f.status === '入庫済み');

  const handleScan = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const id = target.value.trim();
      if (id) {
        const existingFormalin = formalinList.find((f: Formalin) => f.id === id);
        if (existingFormalin) {
          updateFormalinStatus(id, '入庫済み');
        } else {
          addFormalin({ id, status: '入庫済み' });
        }
        target.value = '';
      }
    }
  };

  return (
    <div>
      <h1>入庫ページ</h1>
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

export default Ingress;
