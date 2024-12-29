// pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUserContext(); 

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault(); // フォームのデフォルトの送信を防止
    try {
      // POST /api/login に { username, password } を送る
      const response = await axios.post('http://localhost:3001/api/login', {
        username,
        password,
      });

      const data = response.data;
      if (data.success) {
        // ログイン成功 => Contextに user を格納
       setUser({
         username: data.username,
         isAdmin: data.isAdmin,
       });
        setError('');
        navigate('/');
      } else {
        setError(data.message || 'ログインに失敗しました。');
      }
    } catch (err) {
      console.error('ログインエラー:', err);
      setError('ログインに失敗しました。');
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
