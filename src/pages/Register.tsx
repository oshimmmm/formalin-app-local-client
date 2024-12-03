// src/pages/Register.tsx
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleRegister = async () => {
    try {
      // 1. ユーザー名の重複チェック
      const usernamesRef = collection(db, 'usernames');
      const q = query(usernamesRef, where('__name__', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('このユーザー名は既に使用されています。');
        return;
      }

      // 2. ユーザーの作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 3. ユーザー情報の保存
      // users コレクションにユーザー情報を保存
      await setDoc(doc(db, 'users', uid), {
        username: username,
        email: email,
        isAdmin: true, // 管理者であれば true、一般ユーザーは false または省略
      });

      // usernames コレクションにユーザー名とUIDを保存
      await setDoc(doc(db, 'usernames', username), {
        uid: uid,
      });

      // 登録後にホームページへリダイレクト
      navigate('/');
    } catch (err) {
      setError('登録に失敗しました。');
      console.error('登録エラー:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded shadow-md w-80">
      <h1 className='text-2xl font-bold mb-4'>ユーザー登録</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="ユーザー名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button onClick={handleRegister} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">登録</button>
    </div>
    </div>
  );
};

export default Register;
