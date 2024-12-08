import React, { useContext, useState } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import Modal from '../components/Modal';

const List: React.FC = () => {
  const { formalinList } = useContext(FormalinContext);
  const [selectedHistoryKey, setSelectedHistoryKey] = useState<string | null>(null);

  // 履歴ボタンがクリックされた時のハンドラ
  const handleHistoryClick = (key: string) => {
    setSelectedHistoryKey(key);
  };

  // showHistoryForKeyがnullでなければ、そのキーに対応するfを取得
  const selectedFormalin = selectedHistoryKey ? formalinList.find(f => f.key === selectedHistoryKey) : null;
  const history = (selectedFormalin && (selectedFormalin as any).history) || [];

  return (
    <div>
      <h1 className='text-3xl font-bold mt-4 mb-10 ml-10'>詳細一覧ページ</h1>
      <div className='ml-10'>
      <FormalinTable formalinList={formalinList} showLotNumber={true} showHistoryButton={true} onHistoryClick={handleHistoryClick} />
      </div>
      {/* モーダルやポップアップで履歴表示 */}
      {selectedHistoryKey && (
        <Modal onClose={() => setSelectedHistoryKey(null)}>
          <h2 className='text-xl mb-4'>更新履歴: {selectedHistoryKey}</h2>
          {Array.isArray(history) && history.length > 0 ? (
            <ul className='list-disc list-inside'>
              {history.map((h: any, index: number) => (
                <li key={index}>
                  <div>更新者: {h.updatedBy}</div>
                  <div>更新日時: {h.updatedAt ? h.updatedAt.toDate().toLocaleString() : '不明'}</div>
                  <div>旧ステータス: {h.oldStatus}</div>
                  <div>新ステータス: {h.newStatus}</div>
                  <div>旧場所: {h.oldPlace}</div>
                  <div>新場所: {h.newPlace}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p>履歴はありません</p>
          )}
        </Modal>
      )}
    </div>
  );
};

export default List;
