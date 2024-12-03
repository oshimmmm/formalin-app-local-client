// pages/Login.tsx
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォームのデフォルトの送信を防止
    try {
       // 1. ユーザー名から UID を取得
       const usernameDocRef = doc(db, 'usernames', username);
       const usernameDoc    = await getDoc(usernameDocRef);

      if (!usernameDoc.exists()) {
        setError('ユーザー名またはパスワードが正しくありません。');
        return;
      }

      const uid = usernameDoc.data()?.uid;

      // 2. UID からメールアドレスを取得
      const userDocRef = doc(db, 'users', uid);
      const userDoc    = await getDoc(userDocRef);

      const email = userDoc.data()?.email;

      if (!email) {
        setError('ユーザー情報の取得に失敗しました。');
        return;
      }

      // 3. ログイン処理
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('ログインに失敗しました。');
      console.error('ログインエラー:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4">ログイン</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="ユーザー名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
