// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { UserProvider, useUserContext } from './context/UserContext';
import { FormalinProvider } from './context/FormalinContext';

import Header from './components/Header';
import Home from './pages/Home';
import Ingress from './pages/Ingress';
import Egress from './pages/Egress';
import Submission from './pages/Submission';
import List from './pages/List';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';

/**
 * ルートガード用コンポーネント:
 *  - ログインが必要なページに使う (userがいないとリダイレクト)
 *  - Admin権限が必要な場合は isAdmin もチェック
 */
const PrivateRoute: React.FC<{ children: JSX.Element; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { user } = useUserContext();

  // 未ログインの場合は /login へリダイレクト
  if (!user) {
    return <Navigate to="/login" />;
  }
  // adminOnly = true のルートなら isAdmin もチェック
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <FormalinProvider>
        <Router>
          <Header />
          <Routes>
            {/* ログインしていない場合のみ Login を表示 */}
            <Route
              path="/login"
              element={
                <AuthCheckReverse>
                  <Login />
                </AuthCheckReverse>
              }
            />
            {/* 管理者のみがアクセスできるルート: adminOnly=true */}
            <Route
              path="/register"
              element={
                <PrivateRoute adminOnly={true}>
                  <Register />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <Admin />
                </PrivateRoute>
              }
            />
            {/* ログイン必須のルート */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/ingress"
              element={
                <PrivateRoute>
                  <Ingress />
                </PrivateRoute>
              }
            />
            <Route
              path="/egress"
              element={
                <PrivateRoute>
                  <Egress />
                </PrivateRoute>
              }
            />
            <Route
              path="/submission"
              element={
                <PrivateRoute>
                  <Submission />
                </PrivateRoute>
              }
            />
            <Route
              path="/list"
              element={
                <PrivateRoute>
                  <List />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </FormalinProvider>
    </UserProvider>
  );
};

/**
 * ログインしている場合は / へリダイレクトするラッパコンポーネント
 *  - 例: /login ページで「すでにログイン済み」ならホームへ
 */
const AuthCheckReverse: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useUserContext();
  if (user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default App;
