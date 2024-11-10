import React, { useContext } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';

const Home: React.FC = () => {
  const { formalinList } = useContext(FormalinContext);

  return (
    <div>
      <h1>ホーム</h1>
      <FormalinTable formalinList={formalinList} />
    </div>
  );
};

export default Home;
