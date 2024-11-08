import React, { createContext, useState, ReactNode } from 'react';
import { Formalin } from '../types/Formalin';

interface FormalinContextProps {
  formalinList: Formalin[];
  addFormalin: (formalin: Formalin) => void;
  updateFormalinStatus: (id: string, status: Formalin['status']) => void;
}

export const FormalinContext = createContext<FormalinContextProps>({
  formalinList: [],
  addFormalin: () => {},
  updateFormalinStatus: () => {},
});

interface FormalinProviderProps {
  children: ReactNode;
}

export const FormalinProvider: React.FC<FormalinProviderProps> = ({ children }) => {
  const [formalinList, setFormalinList] = useState<Formalin[]>([]);

  const addFormalin = (formalin: Formalin) => {
    setFormalinList([...formalinList, formalin]);
  };

  const updateFormalinStatus = (id: string, status: Formalin['status']) => {
    setFormalinList(
      formalinList.map((f) => (f.id === id ? { ...f, status } : f))
    );
  };

  return (
    <FormalinContext.Provider value={{ formalinList, addFormalin, updateFormalinStatus }}>
      {children}
    </FormalinContext.Provider>
  );
};
