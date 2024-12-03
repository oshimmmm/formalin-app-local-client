import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FormalinProvider } from './context/FormalinContext';
import Header from './components/Header';
import Home from './pages/Home';
import Ingress from './pages/Ingress';
import Egress from './pages/Egress';
import Submission from './pages/Submission';
import List from './pages/List';
import { auth } from './firebase';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  // 管理者の判定（例としてメールアドレスで判定）
  const isAdmin = user?.email === 'admin@example.com'; // 管理者のメールアドレスに置き換えてください
  
  return (
    // エントリポイントであるApp.tsxで、全てのコンポーネントをラッピング
    // ラッピングされた子コンポーネントは、コンテキストのホルマリンリスト情報やデータ追加、更新の機能が使える
    <FormalinProvider>
      <Router>
        <Header />
        <Routes>
          {/* ログインしていない場合はログイン画面にリダイレクト */}
          <Route path="/login" element={<Login />} />

          {/* 管理者のみがアクセスできるルート */}
          <Route
            path="/register"
            element={
              user && isAdmin ? <Register /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin"
            element={
              user && isAdmin ? <Admin /> : <Navigate to="/login" />
            }
          />
          
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/ingress" element={user ? <Ingress /> : <Navigate to="/login" />} />
          <Route path="/egress" element={user ? <Egress /> : <Navigate to="/login" />} />
          <Route path="/submission" element={user ? <Submission /> : <Navigate to="/login" />} />
          <Route path="/list" element={user ? <List /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </FormalinProvider>
  );
};

export default App;
