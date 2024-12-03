import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  // 認証状態の永続化をセッション単位に設定
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error('認証状態の永続化設定中にエラーが発生しました:', error);
});

  export {db, auth};