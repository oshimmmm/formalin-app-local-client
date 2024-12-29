// contexts/FormalinContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Formalin, NewFormalin } from '../types/Formalin';
import {
  getFormalinData,
  addFormalinData,
  updateFormalinData,
  deleteFormalinData,
} from '../services/formalinService';

interface FormalinContextProps {
  formalinList: Formalin[];
  addFormalin: (formalin: NewFormalin, updatedBy?: string) => Promise<void>;
  updateFormalinStatus: (id: number, data: Partial<Formalin>, updatedBy?: string) => Promise<void>;
  removeFormalin: (id: number) => Promise<void>;
  updateFormalin: (id: number, data: Partial<Formalin>, updatedBy?: string) => Promise<void>;
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
        // console.log("data is: ", data);
        setFormalinList(data);
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      }
    };
    fetchData();
  }, []);

  // 入庫処理
  // 入庫画面から渡される情報は、NewFormalin型で定義したデータ内容と、更新者のusername
  const addFormalin = async (formalin: NewFormalin, updatedBy?: string) => {
    try {
      const historyEntry = {
        updatedBy: updatedBy || 'anonymous',
        updatedAt: new Date(),
        oldStatus: '',
        newStatus: formalin.status,
        oldPlace: '',
        newPlace: formalin.place,
      };
      // 入庫画面から渡された情報とhistoryEntryをaddFormalinData（formalinService.tsx）に渡す
      await addFormalinData(formalin, historyEntry);

      // 追加後に再取得
      const data = await getFormalinData();
      setFormalinList(data);
    } catch (error) {
      console.error('データの追加中にエラーが発生しました:', error);
    }
  };

  // 出庫処理
  // 出庫画面から渡される情報は、existingFormalin.id（出庫済みのホルマリンのid）と、Formalin型で定義したデータ内容の一部（status, place, timestamp）と、更新者のusername
  const updateFormalinStatus = async (id: number, data: Partial<Formalin>, updatedBy?: string) => {
    try {
      const oldData = formalinList.find((f) => f.id === id);
      if (!oldData) return;

      const historyEntry = {
        updatedBy: updatedBy || 'anonymous',
        updatedAt: new Date(),
        oldStatus: oldData.status,
        newStatus: data.status || '',
        oldPlace: oldData.place,
        newPlace: data.place || '',
      };

      // 出庫画面から渡された情報とhistoryEntryをupdateFormalinData（formalinService.tsx）に渡す
      await updateFormalinData(id, data, historyEntry);

      // 更新後に再取得
      const updatedData = await getFormalinData();
      setFormalinList(updatedData);
    } catch (error) {
      console.error('データの更新中にエラーが発生しました:', error);
    }
  };

  // 管理者専用ページ（Admin.tsx）
  const removeFormalin = async (id: number) => {
    try {
      await deleteFormalinData(id);
      const updatedData = await getFormalinData();
      setFormalinList(updatedData);
    } catch (error) {
      console.error('データの削除中にエラーが発生しました:', error);
    }
  };

  // 管理者専用ページ（Admin.tsx）
  const updateFormalin = async (id: number, data: Partial<Formalin>, updatedBy?: string) => {
    try {
      const oldData = formalinList.find((f) => f.id === id);
      if (!oldData) return;

      const historyEntry = {
        updatedBy: updatedBy || 'anonymous',
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
