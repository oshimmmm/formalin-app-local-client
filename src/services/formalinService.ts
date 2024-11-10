import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { Formalin } from '../types/Formalin';
import db from '../firebase';

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
    } as Formalin;
  });
  return formalinList;
};

// データの追加
export const addFormalinData = async (formalin: Omit<Formalin, 'id'>): Promise<void> => {
    const formalinCollection = collection(db, 'posts');
    await addDoc(formalinCollection, formalin);
};

// データの更新
export const updateFormalinData = async (id: string, data: Partial<Formalin>): Promise<void> => {
    const formalinDoc = doc(db, 'posts', id);
    await updateDoc(formalinDoc, data);
};