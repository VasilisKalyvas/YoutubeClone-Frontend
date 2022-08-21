import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {

    apiKey: "AIzaSyDhbjwGow-qQvLYJhpE28nQhaHzI1OXT3s",
  
    authDomain: "clonetube-d8d80.firebaseapp.com",
  
    projectId: "clonetube-d8d80",
  
    storageBucket: "clonetube-d8d80.appspot.com",
  
    messagingSenderId: "6064208723",
  
    appId: "1:6064208723:web:65329e070f731736337fa6"
  
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
