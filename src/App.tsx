import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FormalinProvider } from './context/FormalinContext';
import Header from './components/Header';
import Home from './pages/Home';
import Ingress from './pages/Ingress';
import Egress from './pages/Egress';
import Submission from './pages/Submission';
import List from './pages/List';
import { auth, db } from './firebase';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import { doc, getDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchIsAdmin = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data()?.isAdmin === true);
          } else {
            console.error('ユーザードキュメントが存在しません。');
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('isAdmin の取得中にエラーが発生しました:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    fetchIsAdmin();
  }, [user]);

  
  return (
    // エントリポイントであるApp.tsxで、全てのコンポーネントをラッピング
    // ラッピングされた子コンポーネントは、コンテキストのホルマリンリスト情報やデータ追加、更新の機能が使える
    <FormalinProvider>
      <Router>
        <Header />
        <Routes>
          {/* ログインしていない場合はログイン画面にリダイレクト */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

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
