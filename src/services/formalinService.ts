import { addDoc, arrayUnion, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { Formalin } from '../types/Formalin';
import { db } from '../firebase';

interface HistoryEntry {
  updatedBy: string;
  updatedAt: Date;
  oldStatus?: string;
  newStatus?: string;
  oldPlace?: string;
  newPlace?: string;
}

// データの取得
export const getFormalinData = async (): Promise<Formalin[]> => {
  const formalinCollection = collection(db, 'posts');
  const formalinSnapshot = await getDocs(formalinCollection);
  const formalinList = formalinSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      key: data.key,
      place: data.place,
      status: data.status,
      timestamp: data.timestamp.toDate(),
      size: data.size || '不明',
      expired: data.expired ? data.expired.toDate() : new Date(),
      lotNumber: data.lotNumber || '',
      history: data.history || []
    } as Formalin & { history?: HistoryEntry[] };
  });
  return formalinList;
};

// データの追加
export const addFormalinData = async (formalin: Omit<Formalin, 'id'>, initialHistoryEntry?: HistoryEntry): Promise<void> => {
    const formalinCollection = collection(db, 'posts');
    const docRef = await addDoc(formalinCollection, formalin);

    if (initialHistoryEntry) {
      await updateDoc(docRef, {
        history: arrayUnion(initialHistoryEntry)
      });
    }
};

// データの更新
export const updateFormalinData = async (id: string, data: Partial<Formalin>, historyEntry?: HistoryEntry): Promise<void> => {
  const formalinDoc = doc(db, 'posts', id);

  const updateData: any = { ...data };
  if (historyEntry) {
    // arrayUnionを使ってhistory配列に新たな更新ログを追加
    updateData.history = arrayUnion(historyEntry);
  }

  await updateDoc(formalinDoc, updateData);
};