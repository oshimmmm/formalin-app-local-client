// contexts/FormalinContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Formalin } from '../types/Formalin';
import {
  getFormalinData,
  addFormalinData,
  updateFormalinData,
  deleteFormalinData,
} from '../services/formalinService';

interface FormalinContextProps {
  formalinList: Formalin[];
  addFormalin: (formalin: Omit<Formalin, 'id' | 'history'>) => Promise<void>;
  updateFormalinStatus: (id: number, data: Partial<Formalin>) => Promise<void>;
  removeFormalin: (id: number) => Promise<void>;
  updateFormalin: (id: number, data: Partial<Formalin>) => Promise<void>;
}

export const FormalinContext = createContext<FormalinContextProps>({
  formalinList: [],
  addFormalin: async () => {},
  updateFormalinStatus: async () => {},
  removeFormalin: async () => {},
  updateFormalin: async () => {},
});

interface FormalinProviderProps {
  children: ReactNode;
}

export const FormalinProvider: React.FC<FormalinProviderProps> = ({ children }) => {
  const [formalinList, setFormalinList] = useState<Formalin[]>([]);

  // 初回マウント時に一覧を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFormalinData();
        setFormalinList(data);
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      }
    };
    fetchData();
  }, []);

  // addFormalin
  const addFormalin = async (formalin: Omit<Formalin, 'id' | 'history'>) => {
    try {
      // ここでは仮で updatedBy='anonymous' とするなど
      const historyEntry = {
        updatedBy: 'anonymous',
        updatedAt: new Date(),
        oldStatus: '',
        newStatus: formalin.status,
        oldPlace: '',
        newPlace: formalin.place,
      };
      await addFormalinData(formalin, historyEntry);

      // 追加後に再取得
      const data = await getFormalinData();
      setFormalinList(data);
    } catch (error) {
      console.error('データの追加中にエラーが発生しました:', error);
    }
  };

  // updateFormalinStatus
  const updateFormalinStatus = async (id: number, data: Partial<Formalin>) => {
    try {
      const oldData = formalinList.find((f) => f.id === id);
      if (!oldData) return;

      const historyEntry = {
        updatedBy: 'anonymous',
        updatedAt: new Date(),
        oldStatus: oldData.status,
        newStatus: data.status || '',
        oldPlace: oldData.place,
        newPlace: data.place || '',
      };

      await updateFormalinData(id, data, historyEntry);

      // 更新後に再取得
      const updatedData = await getFormalinData();
      setFormalinList(updatedData);
    } catch (error) {
      console.error('データの更新中にエラーが発生しました:', error);
    }
  };

  // removeFormalin
  const removeFormalin = async (id: number) => {
    try {
      await deleteFormalinData(id);
      const updatedData = await getFormalinData();
      setFormalinList(updatedData);
    } catch (error) {
      console.error('データの削除中にエラーが発生しました:', error);
    }
  };

  // updateFormalin (任意のフィールド更新)
  const updateFormalin = async (id: number, data: Partial<Formalin>) => {
    try {
      const oldData = formalinList.find((f) => f.id === id);
      if (!oldData) return;

      const historyEntry = {
        updatedBy: 'anonymous',
        updatedAt: new Date(),
        oldStatus: oldData.status,
        newStatus: data.status || '',
        oldPlace: oldData.place,
        newPlace: data.place || '',
      };

      await updateFormalinData(id, data, historyEntry);
      const updatedData = await getFormalinData();
      setFormalinList(updatedData);
    } catch (error) {
      console.error('任意のフィールドの更新中にエラーが発生しました:', error);
    }
  };

  return (
    <FormalinContext.Provider
      value={{
        formalinList,
        addFormalin,
        updateFormalinStatus,
        removeFormalin,
        updateFormalin,
      }}
    >
      {children}
    </FormalinContext.Provider>
  );
};
