// src/pages/Admin.tsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const Admin: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);

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
      await deleteDoc(doc(db, 'posts', id));
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const handleUpdate = async (id: string, updatedData: any) => {
    await updateDoc(doc(db, 'posts', id), updatedData);
    setPosts(
      posts.map((post) => (post.id === id ? { ...post, ...updatedData } : post))
    );
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
                <input
                  type="text"
                  value={post.place}
                  className="w-full p-1 border border-gray-300 rounded"
                  onChange={(e) =>
                    handleUpdate(post.id, { place: e.target.value })
                  }
                />
              </td>
              <td className="border border-gray-300 p-2.5">
                <input
                  type="text"
                  value={post.status}
                  className="w-full p-1 border border-gray-300 rounded"
                  onChange={(e) =>
                    handleUpdate(post.id, { status: e.target.value })
                  }
                />
              </td>
              <td className="border border-gray-300 p-2.5">
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
