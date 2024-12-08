import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Formalin } from '../types/Formalin';
import {
  getFormalinData,
  addFormalinData,
  updateFormalinData,
} from '../services/formalinService';
import { deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface FormalinContextProps {
  formalinList: Formalin[];
  addFormalin: (formalin: Omit<Formalin, 'id'>) => Promise<void>;
  updateFormalinStatus: (id: string, data: Partial<Formalin>) => Promise<void>;
  removeFormalin: (id: string) => Promise<void>;
  updateFormalin: (id: string, data: Partial<Formalin>) => Promise<void>;
}

// 
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
      const oldData = formalinList.find((f) => f.id === id);
      const user = auth.currentUser;
      const updatedBy = user ? user.email || user.uid : 'unknown';

      // undefined対策: ?? ''でundefinedの場合空文字を代入
      const oldStatus = oldData?.status ?? '';
      const newStatus = data.status ?? '';
      const oldPlace = oldData?.place ?? '';
      const newPlace = data.place ?? '';

      const historyEntry = {
        updatedBy,
        updatedAt: new Date(),
        oldStatus,
        newStatus,
        oldPlace,
        newPlace
      };

      await updateFormalinData(id, data, historyEntry);
      // データを再取得
      const updatedData = await getFormalinData();
      setFormalinList(updatedData);
    } catch (error) {
      console.error('データの更新中にエラーが発生しました:', error);
    }
  };

  const removeFormalin = async (id: string) => {
    try {
      // Firestore上から削除する処理をformalinServiceなどに定義するか、直接ここで実行
      const formalinDoc = doc(db, 'posts', id);
      await deleteDoc(formalinDoc);

      // 削除後にデータを再取得
      const updatedData = await getFormalinData();
      setFormalinList(updatedData);
    } catch (error) {
      console.error('データの削除中にエラーが発生しました:', error);
    }
  };

  const updateFormalin = async (id: string, data: Partial<Formalin>) => {
    try {
      const oldData = formalinList.find((f) => f.id === id);
      const user = auth.currentUser;
      const updatedBy = user ? user.email || user.uid : 'unknown';

      // undefined対策: ?? ''でundefinedの場合空文字を代入
      const oldStatus = oldData?.status ?? '';
      const newStatus = data.status ?? '';
      const oldPlace = oldData?.place ?? '';
      const newPlace = data.place ?? '';

      const historyEntry = {
        updatedBy,
        updatedAt: new Date(),
        oldStatus,
        newStatus,
        oldPlace,
        newPlace
      };

      await updateFormalinData(id, data, historyEntry);
      const updatedData = await getFormalinData();
      setFormalinList(updatedData);
    } catch (error) {
      console.error('任意のフィールドの更新中にエラーが発生しました:', error);
    }
  };

  return (
    // ラッピングされた子コンポーネントは、コンテキストのデータと関数にアクセスできる
    <FormalinContext.Provider value={{ formalinList, addFormalin, updateFormalinStatus, removeFormalin, updateFormalin }}>
      {children}
    </FormalinContext.Provider>
  );
};
