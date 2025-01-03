import React, { useContext, useRef, useEffect, KeyboardEvent, useState } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import FormalinTable from '../components/FormalinTable';
import { Formalin } from '../types/Formalin';
import { parseFormalinCode } from '../utils/parseFormalinCode';
import { useUserContext } from '../context/UserContext';

const Ingress: React.FC = () => {
  const { formalinList, addFormalin } = useContext(FormalinContext);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserContext(); // ログイン中ユーザー

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const ingressedList = formalinList.filter((f: Formalin) => f.status === '入庫済み');

  const handleScan = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const code = target.value.trim();
      if (!code) return;

      const parsed = parseFormalinCode(code);
      if (!parsed) {
        setErrorMessage('無効なコードです。');
        target.value = '';
        return;
      }

      const { serialNumber, size, expirationDate, lotNumber } = parsed;

      // 既存のホルマリンを検索
      const existingFormalin = formalinList.find((f) => f.key === serialNumber);
      if (existingFormalin) {
        setErrorMessage('このホルマリンは既に入庫済です。');
        target.value = '';
        return;
      }

      // 「現在日時」を文字列で持ちたい場合
      // ここでは "YYYY-MM-DD HH:mm:ss" の形にするか、あるいは ISO 文字列にするかはお好みです。
      // 例) JSで手軽にやるなら:
      const now = new Date();
      const nowString = now.toISOString(); 
      // もし DB に「TIMESTAMP WITHOUT TIME ZONE」＋日本時間で保存なら、String で `YYYY-MM-DD HH:mm:ss` に整形してもOK

      // 新規データを追加 (timestamp_str プロパティに文字列を入れる)
      await addFormalin(
        {
          key: serialNumber,
          place: '病理',
          status: '入庫済み',
          // ここで型は { timestamp_str: string } などにしておく
          // 例) もし formalin.timestamp_str という文字列項目を想定しているなら:
          timestamp_str: nowString,    // フロントで文字列にして渡す
          size: size,
          // expired は相変わらず Date なら  -> そのままでもよい or expired_str にする
          expired: expirationDate,
          lotNumber: lotNumber,
        },
        user?.username || 'anonymous'
      );
      setErrorMessage('');

      console.log('formalinList is: ', formalinList);
      // 参考: 現在時刻をコンソールに出す例
      console.log('toString:', now.toString());
      console.log(
        'toLocaleString (ja-JP):',
        now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      );

      target.value = '';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mt-4 mb-10 ml-10">入庫する</h1>
      {/* バーコード入力フィールド */}
      <input
        type="text"
        ref={inputRef}
        onKeyPress={handleScan}
        placeholder="二次元バーコードを読み込んでください"
        className="text-2xl border border-gray-300 rounded p-2 w-1/3 ml-10"
      />

      {errorMessage && <p className="text-red-500 ml-10">{errorMessage}</p>}

      <h2 className="text-xl mx-10 mt-8 mb-2">入庫済みホルマリン一覧</h2>
      <div className="ml-10">
        <FormalinTable formalinList={ingressedList} />
      </div>
    </div>
  );
};

export default Ingress;
