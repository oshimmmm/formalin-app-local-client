import React, { useContext } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import { Formalin } from '../types/Formalin';

const Home: React.FC = () => {
  const { formalinList } = useContext(FormalinContext);
  const filteredList = formalinList.filter((f: Formalin) => f.status === '出庫済み');

  return (
    <div>
      <h1>ホーム</h1>
      <FormalinTable formalinList={filteredList} />
    </div>
  );
};

export default Home;
