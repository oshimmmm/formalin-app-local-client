import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const Header: React.FC = () => {

  const handleLogout = () => {
    signOut(auth);
  };

  // Firebase Authentication のユーザー状態を取得
  const [currentUser, loadingAuth, errorAuth] = useAuthState(auth);

  // ユーザー名を保持する状態変数
  const [username, setUsername] = useState<string | null>(null);
  const [loadingUsername, setLoadingUsername] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // ユーザー名を取得するための副作用フック
  useEffect(() => {
    const fetchUsername = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          console.log("currentUser is :", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          console.log("userDoc is :", userDoc);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("userData is :", userData);
            setUsername(userData?.username);
            setIsAdmin(userData?.isAdmin === true);
          } else {
            console.error('ユーザードキュメントが存在しません。');
            setUsername(null); // ユーザー名をリセット
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('ユーザー名の取得中にエラーが発生しました:', error);
          setUsername(null); // ユーザー名をリセット
          setIsAdmin(false);
        } finally {
          setLoadingUsername(false);
        }
      } else {
        // currentUser が null の場合、username と isAdmin をリセット
        setUsername(null);
        setIsAdmin(false);
        setLoadingUsername(false);
      }
    };

    fetchUsername();
  }, [currentUser]);

  // ローディング中は何も表示しない（またはローディングスピナーを表示）
  if (loadingAuth || loadingUsername) {
    return null;
  }

  // エラーが発生した場合の処理
  if (errorAuth) {
    console.error('認証エラー:', errorAuth);
  }

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
              // text-lg: フォントサイズを大きく設定。xs:極小, sm:小さい, base:ベース, lg:18px, xl:20px, 2xl:24px, 3xl:30px, 4xl:36px, 5xl:48px
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

          {/* 管理者のみ表示されるリンク */}
          {isAdmin && (
            <>
              <li className="mx-4">
                <Link
                  to="/register"
                  className="text-xl hover:text-yellow-400 transition duration-300"
                >
                  ユーザー登録
                </Link>
              </li>
              <li className="mx-4">
                <Link
                  to="/admin"
                  className="text-xl hover:text-yellow-400 transition duration-300"
                >
                  管理者ページ
                </Link>
              </li>
            </>
          )}
          
          <button onClick={handleLogout} className="text-lg hover:text-yellow-400 transition duration-300 ml-4">
            ログアウト
          </button>
          {/* ユーザー名の表示 */}
          {username && (
            <div className="ml-8 text-sm">
              {username} さん
            </div>
          )}
        </ul>      
      </nav>
    </header>
  );
};

export default Header;
