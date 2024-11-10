export interface Formalin {
    id: string; // FirestoreのドキュメントID
    key: string; // ホルマリンのキー（バーコードから取得）
    place: string; // 場所（入庫、出庫時に設定）
    status: '入庫済み' | '出庫済み' | '提出済み';
    timestamp: Date; // 最終更新日時
  }
  