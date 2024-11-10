import React from 'react';
import { Link } from 'react-router-dom';


const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">ホーム</Link></li>
          <li><Link to="/ingress">入庫</Link></li>
          <li><Link to="/egress">出庫</Link></li>
          <li><Link to="/submission">提出</Link></li>
          <li><Link to="/list">一覧</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
