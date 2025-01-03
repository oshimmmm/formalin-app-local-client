// src/pages/Admin.tsx

import React, { useContext, useEffect, useState } from 'react';
import { FormalinContext } from '../context/FormalinContext';
import { parseFormalinCode } from '../utils/parseFormalinCode';
import { Formalin } from '../types/Formalin';
import { useUserContext } from '../context/UserContext';

const Admin: React.FC = () => {
  const { formalinList, removeFormalin, updateFormalin } = useContext(FormalinContext);
  const [posts, setPosts] = useState<Formalin[]>([]);
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { user } = useUserContext(); // ログイン中ユーザー

  const places = ['病理', '内視鏡', '外科', '内科', '病棟'];

  useEffect(() => {
    setPosts(formalinList);
  }, [formalinList]);

  // バーコード読み取り
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

  // serialNumber があればフィルタリング
  const filteredPosts = serialNumber
    ? posts.filter((post) => post.key === serialNumber)
    : posts;

  // 削除ボタン
  const handleDelete = async (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      await removeFormalin(id);
    }
  };

  // Place変更（ローカルstateを更新）
  const handlePlaceChange = (id: number, newPlace: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, place: newPlace } : post
      )
    );
  };

  // Status変更（ローカルstateを更新）
  const handleStatusChange = (id: number, newStatus: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, status: newStatus } : post
      )
    );
  };

  // 「更新」ボタンでDB更新
  const handleUpdateData = async (id: number) => {
    const targetPost = posts.find((p) => p.id === id);
    if (!targetPost) return;

    if (!window.confirm('本当に更新しますか？')) {
      return;
    }

    // ここで Date を文字列化して渡す
    const now = new Date();
    const isoString = now.toISOString();

    await updateFormalin(
      id,
      {
        // Partial<Formalin>
        place: targetPost.place,
        status: targetPost.status,
        // timestamp_str: string
        timestamp_str: isoString,
      },
      user?.username || 'anonymous'
    );
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
            >
              <td className="border border-gray-300 p-2.5">
                {post.key}
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
