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
      <h1>管理者ページ</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Place</th>
            <th>Status</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>
                <input
                  type="text"
                  value={post.place}
                  onChange={(e) =>
                    handleUpdate(post.id, { place: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={post.status}
                  onChange={(e) =>
                    handleUpdate(post.id, { status: e.target.value })
                  }
                />
              </td>
              <td>
                <button onClick={() => handleDelete(post.id)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
