import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database'
import 'firebase/storage'

const config={
    apiKey: "AIzaSyALU49meWqWK_Pg1Ogo8ETCuppu9TXOZAc",
    authDomain: "chat-app-a51c6.firebaseapp.com",
    projectId: "chat-app-a51c6",
    storageBucket: "chat-app-a51c6.appspot.com",
    messagingSenderId: "750963329006",
    appId: "1:750963329006:web:3ac955a73ed3c12c3570ff"
  };

  const app=firebase.initializeApp(config);
  export const auth=app.auth();
  export const database=app.database();
  export const storage=app.storage();