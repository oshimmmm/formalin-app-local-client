// src/pages/Admin.tsx
import React, { useContext, useEffect, useState } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import { parseFormalinCode } from '../utils/parseFormalinCode';
import { Formalin } from '../types/Formalin';

const Admin: React.FC = () => {
  // PostgreSQL用に書き換え済みの context から取得
  const { formalinList, removeFormalin, updateFormalin } = useContext(FormalinContext);

  // ローカル state に posts を持ち、状況に応じて編集。
  // ※ 直接 formalinList を使ってもOKですが、「編集途中の値を持つために」あえてローカルを使う例。
  const [posts, setPosts] = useState<Formalin[]>([]);

  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 選択可能な出庫先（場所）
  const places = ['病理', '内視鏡', '外科', '内科', '病棟'];

  // ============ 1) ContextのformalnListをローカルpostsに反映 ============
  useEffect(() => {
    setPosts(formalinList);
  }, [formalinList]);

  // ============ 2) バーコード読取 → シリアル番号を state に保持 ============
  const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const code = (e.target as HTMLInputElement).value.trim();
      const parsed = parseFormalinCode(code);
      if (parsed) {
        setErrorMessage('');
        setSerialNumber(parsed.serialNumber);
      } else {
        setErrorMessage('このホルマリンはリストにありません。');
        setSerialNumber(null);
      }
    }
  };

  // ============ 3) serialNumber があれば、それにマッチする key だけ表示 ============
  const filteredPosts = serialNumber
    ? posts.filter((post) => post.key === serialNumber)
    : posts;

  // ============ 4) 削除ボタン → removeFormalin 呼び出し → 再同期 ============
  const handleDelete = async (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      await removeFormalin(id);
      // removeFormalin後、Context側がDB再取得し formalinList が更新されれば useEffectにより自動再同期
      // ここで手動同期するなら: setPosts(formalinList);
    }
  };

  // ============ 5) Place変更 (ローカルstateを更新) ============
  const handlePlaceChange = (id: number, newPlace: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, place: newPlace } : post
      )
    );
  };

  // ============ 6) Status変更 (ローカルstateを更新) ============
  const handleStatusChange = (id: number, newStatus: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, status: newStatus } : post
      )
    );
  };

  // ============ 7) 「更新」ボタンでDB更新 → 再同期 ============
  const handleUpdateData = async (id: number) => {
    const targetPost = posts.find((p) => p.id === id);
    if (!targetPost) return;

    if (!window.confirm('本当に更新しますか？')) {
      return;
    }

    // ここで Context の updateFormalin を呼び、DB更新
    await updateFormalin(id, {
      place: targetPost.place,
      status: targetPost.status,
    });

    // Context が DB を再取得して formalinList を更新 → useEffect => setPosts(formalinList)
    // もしすぐにローカル画面を最新化したいなら、手動で setPosts(formalinList) も可
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mt-4 mb-10 ml-10">管理者専用ページ</h1>

      <div className="ml-10 mb-4">
        <input
          type="text"
          placeholder="バーコードを読み込んでください"
          onKeyPress={handleBarcodeInput}
          className="border border-gray-300 rounded p-2 w-1/4"
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>

      <table className="w-4/5 text-lg ml-10">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2.5 text-left">ID</th>
            <th className="border border-gray-300 p-2.5 text-left">Place</th>
            <th className="border border-gray-300 p-2.5 text-left">Status</th>
            <th className="border border-gray-300 p-2.5 text-left">操作</th>
          </tr>
        </thead>

        <tbody>
          {filteredPosts.map((post) => (
            <tr
              key={post.id}
              className="bg-white hover:bg-gray-50"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9f9f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
              }}
            >
              <td className="border border-gray-300 p-2.5">
                {post.key /* PostgreSQLの"SERIAL ID"とは別に、試薬IDとしてのkey */}
              </td>

              <td className="border border-gray-300 p-2.5">
                <select
                  value={post.place}
                  onChange={(e) => handlePlaceChange(post.id, e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded"
                >
                  {places.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </td>

              <td className="border border-gray-300 p-2.5">
                <input
                  type="text"
                  value={post.status}
                  className="w-full p-1 border border-gray-300 rounded"
                  onChange={(e) => handleStatusChange(post.id, e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2.5">
                <button
                  onClick={() => handleUpdateData(post.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  更新
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white px-4 py-2 ml-4 rounded hover:bg-red-600"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
