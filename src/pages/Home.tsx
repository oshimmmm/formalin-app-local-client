import React, { useContext } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';

const Home: React.FC = () => {
  const { formalinList } = useContext(FormalinContext);

  return (
    <div>
      <h1 className='text-3xl font-bold my-4 ml-10'>ホーム</h1>
      <div className='ml-10'>
      <FormalinTable formalinList={formalinList} />
      </div>
      
    </div>
  );
};

export default Home;
