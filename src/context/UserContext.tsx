// src/context/UserContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from 'react';
  
  /**
   * user: ログイン中のユーザー情報 (username, isAdmin)
   * ログインしていない場合は null
   */
  type User = {
    username: string;
    isAdmin: boolean;
  };
  
  /**
   * Context が提供する機能
   */
  interface UserContextType {
    user: User | null;                                 // ログインユーザー情報
    setUser: React.Dispatch<React.SetStateAction<User | null>>;  
    logout: () => void;                                // ログアウト関数
  }
  
  /**
   * Context本体
   * 初期値は undefined とする。Provider外で使うとエラーになる。
   */
  const UserContext = createContext<UserContextType | undefined>(undefined);
  
  /**
   * Providerコンポーネント
   * アプリ全体を <UserProvider> で囲むことで、user状態を全コンポーネントで共有可能にする。
   */
  export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // user状態 (null = 未ログイン)
    const [user, setUser] = useState<User | null>(null);
  
    // 1) 初回マウント時に localStorage からデータを読み込む
    useEffect(() => {
      const savedUsername = localStorage.getItem('username');
      const savedIsAdmin  = localStorage.getItem('isAdmin');
      if (savedUsername) {
        setUser({
          username: savedUsername,
          isAdmin: savedIsAdmin === 'true',
        });
      }
    }, []);
  
    // 2) userが変化するたび localStorage に保存 or クリア
    useEffect(() => {
      if (user) {
        localStorage.setItem('username', user.username);
        localStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('isAdmin');
      }
    }, [user]);
  
    // ログアウト処理: userをnullに
    const logout = () => {
      setUser(null);

      localStorage.removeItem('username');
      localStorage.removeItem('isAdmin');
    };
  
    return (
      <UserContext.Provider value={{ user, setUser, logout }}>
        {children}
      </UserContext.Provider>
    );
  };
  
  /**
   * 使いやすいように専用のフックを作成
   * これで、useContext(UserContext) の代わりに useUserContext() と書ける
   */
  export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUserContext must be used within a UserProvider.');
    }
    return context;
  };
  