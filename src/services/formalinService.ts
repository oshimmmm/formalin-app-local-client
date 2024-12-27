// services/formalinService.ts
import axios from 'axios';
import { Formalin, HistoryEntry } from '../types/Formalin';

const API_BASE_URL = 'http://localhost:3001/api';

export const getFormalinData = async (): Promise<Formalin[]> => {
  // サーバーのエンドポイント /api/formalin に GET
  const response = await axios.get(`${API_BASE_URL}/formalin`);

  // response.data はサーバーの rows[] 。
  // サーバーからは timestamp, expired, history.updatedAt が文字列で返るので、Dateに変換。
  const list = response.data.map((item: any) => {
    return {
      ...item,
      timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
      expired: item.expired ? new Date(item.expired) : new Date(),
      history: item.history.map((h: any) => ({
        ...h,
        updatedAt: h.updatedAt ? new Date(h.updatedAt) : new Date(),
      })),
    } as Formalin;
  });
  return list;
};

export const addFormalinData = async (
  formalin: Omit<Formalin, 'id' | 'history'>,
  initialHistoryEntry?: Omit<HistoryEntry, 'history_id'>
): Promise<void> => {
  // サーバーに渡すリクエストボディ
  // initialHistoryEntry があれば、サーバー側で履歴INSERTしてもらう
  const body = {
    key: formalin.key,
    place: formalin.place,
    status: formalin.status,
    timestamp: formalin.timestamp,
    size: formalin.size,
    expired: formalin.expired,
    lotNumber: formalin.lotNumber,
    updatedBy: initialHistoryEntry?.updatedBy || undefined,
    oldStatus: initialHistoryEntry?.oldStatus || undefined,
    newStatus: initialHistoryEntry?.newStatus || undefined,
    oldPlace: initialHistoryEntry?.oldPlace || undefined,
    newPlace: initialHistoryEntry?.newPlace || undefined,
  };

  await axios.post(`${API_BASE_URL}/formalin`, body);
};

export const updateFormalinData = async (
  id: number,
  data: Partial<Formalin>,
  historyEntry?: Omit<HistoryEntry, 'history_id'>
): Promise<void> => {
  const body = {
    // 更新したいフィールドのみ送る
    key: data.key,
    place: data.place,
    status: data.status,
    timestamp: data.timestamp,
    size: data.size,
    expired: data.expired,
    lotNumber: data.lotNumber,
    // 履歴用
    updatedBy: historyEntry?.updatedBy,
    oldStatus: historyEntry?.oldStatus,
    newStatus: historyEntry?.newStatus,
    oldPlace: historyEntry?.oldPlace,
    newPlace: historyEntry?.newPlace,
  };
  await axios.put(`${API_BASE_URL}/formalin/${id}`, body);
};

export const deleteFormalinData = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/formalin/${id}`);
};
