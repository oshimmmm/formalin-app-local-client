import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    // bg-gray-800: 背景色を暗いグレーに設定。
    // py-4: 上下のパディングを設定
    <header className="bg-gray-800 text-white py-4">

      {/* justify-between: 子要素（左側の文言と右側のナビゲーション）を左右の端に配置 */}
      {/* items-center: 子要素を垂直方向に中央揃えにします */}
      <nav className="flex justify-between items-center px-10">
        <div className='text-xl font-bold'>ホルマリン管理システム</div>

        {/* flex: 子要素を横並びにするためのフレックスボックスを適用 */}
        {/* justify-around: 子要素間の余白を均等に配置。 */}
        {/* justyfy-end: 子要素を右へ寄せる */}
        {/* items-center: 子要素を上下方向で中央揃え。 */}
        <ul className="flex justify-end items-center">

        {/* mx-4: 各リストアイテムの左右にマージンを設定 */}
          <li className="mx-4">
            <Link 
              to="/" 
              // text-lg: フォントサイズを大きく設定。lg:18px, xl:20px, 2xl:24px, 3xl:30px, 4xl:36px, 5xl:48px
              // hover:text-yellow-400: ホバー時にリンクの色を黄色に変更。
              // transition duration-300: ホバー効果を滑らかに
              className="text-xl hover:text-yellow-400 transition duration-300"
            >
              ホーム
            </Link>
          </li>
          <li className="mx-4">
            <Link 
              to="/ingress" 
              className="text-xl hover:text-yellow-400 transition duration-300"
            >
              入庫
            </Link>
          </li>
          <li className="mx-4">
            <Link 
              to="/egress" 
              className="text-xl hover:text-yellow-400 transition duration-300"
            >
              出庫
            </Link>
          </li>
          <li className="mx-4">
            <Link 
              to="/submission" 
              className="text-xl hover:text-yellow-400 transition duration-300"
            >
              提出
            </Link>
          </li>
          <li className="mx-4">
            <Link 
              to="/list" 
              className="text-xl hover:text-yellow-400 transition duration-300"
            >
              一覧
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
