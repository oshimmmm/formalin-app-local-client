// src/pages/Admin.tsx
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FormalinContext } from '../context/FormalinContext';

const Admin: React.FC = () => {
  const { removeFormalin, updateFormalin } = useContext(FormalinContext);
  const [posts, setPosts] = useState<any[]>([]);
  const places = ['病理', '内視鏡', '外科', '内科', '病棟']; // 選択可能な出庫先

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('本当に削除しますか？')) {
        // removeFormalinを呼び出すと、Context内で削除＆再取得が行われる
        await removeFormalin(id);
        // postsはAdmin用のローカル状態だが、最新の状態を取得し直すか、またはposts自体の管理をやめContextと揃える
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const updatedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      setPosts(updatedPosts);
    }
  };

  // place変更時
  const handlePlaceChange = (id: string, newPlace: string) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, place: newPlace } : post))
    );
  };

  // status変更時
  const handleStatusChange = (id: string, newStatus: string) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status: newStatus } : post))
    );
  };

  // 「更新」ボタンを押した時にFirestoreへ反映
  const handleUpdateData = async (id: string) => {
    const targetPost = posts.find((p) => p.id === id);
    if (!targetPost) return;

    // 削除と同様、更新時にも確認ダイアログを表示
    if (!window.confirm('本当に更新しますか？')) {
      return;
    }

    // Context内で更新処理を実行し、Dataを再取得
    await updateFormalin(id, {
      place: targetPost.place,
      status: targetPost.status,
    });

    // firestore上で更新後の最新データを取得
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const updatedPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(updatedPosts);
  };

  return (
    <div>
      <h1  className='text-3xl font-bold mt-4 mb-10 ml-10'>管理者専用ページ</h1>
      <table className="w-4/5 text-lg ml-2.5">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2.5 text-left">
              ID
            </th>
            <th className="border border-gray-300 p-2.5 text-left">
              Place
            </th>
            <th className="border border-gray-300 p-2.5 text-left">
              Status
            </th>
            <th className="border border-gray-300 p-2.5 text-left">
              操作
            </th>
          </tr>
        </thead>

        <tbody>
          {posts.map((post) => (
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
                  onChange={(e) =>
                    handleStatusChange(post.id, e.target.value)
                  }
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
