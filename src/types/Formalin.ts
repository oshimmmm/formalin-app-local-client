export interface Formalin {
  id: number;                // PostgreSQLのSERIALが入る
  key: string;
  place: string;
  status: string;
  timestamp: Date;
  size: string;
  expired: Date;
  lotNumber: string;
  history: HistoryEntry[];   // 複数の履歴を保持
}

export interface HistoryEntry {
  history_id?: number;       // PostgreSQL で自動採番される場合もあるので任意
  updatedBy: string;
  updatedAt: Date;
  oldStatus: string;
  newStatus: string;
  oldPlace: string;
  newPlace: string;
}


// export interface Formalin {
//   id: string; // FirestoreのドキュメントID
//   key: string; // ホルマリンのキー（シリアルナンバー）
//   place: string; // 場所（入庫、出庫時に設定）
//   status: '入庫済み' | '出庫済み' | '提出済み';
//   timestamp: Date; // 最終更新日時
//   size: string; // ホルマリンの規格（25ml、40mlなど）
//   expired: Date; // 有効期限
//   lotNumber: string;
// }


  