import React, { useContext } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';

const List: React.FC = () => {
  const { formalinList } = useContext(FormalinContext);

  return (
    <div>
      <h1>一覧ページ</h1>
      <FormalinTable formalinList={formalinList} />
    </div>
  );
};

export default List;
