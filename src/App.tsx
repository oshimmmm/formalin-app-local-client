import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FormalinProvider } from './context/FormalinContext';
import Header from './components/Header';
import Home from './pages/Home';
import Ingress from './pages/Ingress';
import Egress from './pages/Egress';
import Submission from './pages/Submission';
import List from './pages/List';

const App: React.FC = () => {
  return (
    // エントリポイントであるApp.tsxで、全てのコンポーネントをラッピング
    // ラッピングされた子コンポーネントは、コンテキストのホルマリンリスト情報やデータ追加、更新の機能が使える
    <FormalinProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ingress" element={<Ingress />} />
          <Route path="/egress" element={<Egress />} />
          <Route path="/submission" element={<Submission />} />
          <Route path="/list" element={<List />} />
        </Routes>
      </Router>
    </FormalinProvider>
  );
};

export default App;
