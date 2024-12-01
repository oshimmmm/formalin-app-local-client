import React, { useContext } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';

const List: React.FC = () => {
  const { formalinList } = useContext(FormalinContext);

  return (
    <div>
      <h1 className='text-3xl font-bold mt-4 mb-10 ml-10'>一覧ページ</h1>
      <div className='ml-10'>
      <FormalinTable formalinList={formalinList} />
      </div>
    </div>
  );
};

export default List;
