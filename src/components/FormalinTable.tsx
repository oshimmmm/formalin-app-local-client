import React from 'react';
import { Formalin } from '../types/Formalin';

interface FormalinTableProps {
  formalinList: Formalin[];
}

const FormalinTable: React.FC<FormalinTableProps> = ({ formalinList }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>状態</th>
        </tr>
      </thead>
      <tbody>
        {formalinList.map((f) => (
          <tr key={f.id}>
            <td>{f.id}</td>
            <td>{f.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FormalinTable;
