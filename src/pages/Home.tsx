import React, { useContext, useState } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import { parseFormalinCode } from '../utils/parseFormalinCode';

const Home: React.FC = () => {
  const { formalinList } = useContext(FormalinContext);
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

  // "提出済み"のステータスを持つデータを表示しない
  const filteredListWithoutSubmitted = filteredList.filter((f) => f.status !== '提出済み');

  return (
    <div>
      <h1 className='text-3xl font-bold my-4 ml-10'>ホーム</h1>
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

      <FormalinTable formalinList={filteredListWithoutSubmitted} />
      </div>
      
    </div>
  );
};

export default Home;
