import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Formalin } from '../types/Formalin';
import {
  getFormalinData,
  addFormalinData,
  updateFormalinData,
} from '../services/formalinService';

interface FormalinContextProps {
  formalinList: Formalin[];
  addFormalin: (formalin: Omit<Formalin, 'id'>) => Promise<void>;
  updateFormalinStatus: (id: string, data: Partial<Formalin>) => Promise<void>;
}

// 
export const FormalinContext = createContext<FormalinContextProps>({
  formalinList: [],
  addFormalin: async () => {},
  updateFormalinStatus: async () => {},
});


interface FormalinProviderProps {
  children: ReactNode;
}

// ホルマリンリストの状態管理用のコンポーネント
export const FormalinProvider: React.FC<FormalinProviderProps> = ({ children }) => {
  const [formalinList, setFormalinList] = useState<Formalin[]>([]);

  // Firestoreからデータを取得
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

  // addFormalin関数を定義
  const addFormalin = async (formalin: Omit<Formalin, 'id'>) => {
    try {
      await addFormalinData(formalin);
      // データを再取得
      const data = await getFormalinData();
      setFormalinList(data);
    } catch (error) {
      console.error('データの追加中にエラーが発生しました:', error);
    }
  };

  // updateFormalinStatus関数を定義
  const updateFormalinStatus = async (id: string, data: Partial<Formalin>) => {
    try {
      await updateFormalinData(id, data);
      // データを再取得
      const updatedData = await getFormalinData();
      setFormalinList(updatedData);
    } catch (error) {
      console.error('データの更新中にエラーが発生しました:', error);
    }
  };

  return (
    // ラッピングされた子コンポーネントは、コンテキストのデータと関数にアクセスできる
    <FormalinContext.Provider value={{ formalinList, addFormalin, updateFormalinStatus }}>
      {children}
    </FormalinContext.Provider>
  );
};
