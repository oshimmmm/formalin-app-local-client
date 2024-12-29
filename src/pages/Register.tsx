// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin]   = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleRegister = async () => {
    try {
      // /api/register に { username, password, isAdmin } を送信
      const response = await axios.post('http://localhost:3001/api/register', {
        username,
        password,
        isAdmin,
      });

      const data = response.data;
      if (!data.success) {
        // 重複などのエラーメッセージ
        setError(data.message || '登録に失敗しました。');
      } else {
        // 登録成功後にリダイレクト
        navigate('/');
      }
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
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <label className="block mb-2">ユーザー種別</label>
        <select
          value={isAdmin ? 'true' : 'false'}
          onChange={(e) => setIsAdmin(e.target.value === 'true')}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="false">一般ユーザー</option>
          <option value="true">管理者</option>
        </select>
      <button onClick={handleRegister} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">登録</button>
    </div>
    </div>
  );
};

export default Register;
