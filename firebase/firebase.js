
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1S3KSBB3dMbDHPkffRg3NuHu56myIZkY",
  authDomain: "vispitchstack.firebaseapp.com",
  projectId: "vispitchstack",
  storageBucket: "vispitchstack.appspot.com",
  messagingSenderId: "923420991694",
  appId: "1:923420991694:web:030118cd099a19f7ef309f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth }