import React, { useContext, useState } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import Modal from '../components/Modal';
import { parseFormalinCode } from '../utils/parseFormalinCode';

const List: React.FC = () => {
  const { formalinList } = useContext(FormalinContext);
  const [selectedHistoryKey, setSelectedHistoryKey] = useState<string | null>(null);
  const [searchCode, setSearchCode] = useState('');
  const [searchSerialNumber, setSearchSerialNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const code = (e.target as HTMLInputElement).value.trim();
      const parsed = parseFormalinCode(code);
      if (parsed) {
        setErrorMessage('');
        setSearchSerialNumber(parsed.serialNumber);
      } else {
        setErrorMessage('このホルマリンはリストにありません。');
        setSearchSerialNumber(null);
      }
    }
  };

  // searchSerialNumberがセットされていれば、そのkeyに合致するデータのみフィルタリング
  const filteredList = searchSerialNumber
    ? formalinList.filter((f) => f.key === searchSerialNumber)
    : formalinList;

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
      <input
          type="text"
          placeholder="バーコードを読み込んでください"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          onKeyPress={handleBarcodeInput}
          className="border border-gray-300 rounded p-2 mb-2 w-1/4"
        />
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

      <FormalinTable formalinList={filteredList} showLotNumber={true} showHistoryButton={true} onHistoryClick={handleHistoryClick} />
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
                  <div>更新日時: {h.updatedAt ? new Date(h.updatedAt).toLocaleString() : '不明'}</div>
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
