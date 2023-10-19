import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4wS1Y69L5NBiMUZlFhRD9f6ID-oToZ9M",
  authDomain: "animeden-b53a9.firebaseapp.com",
  projectId: "animeden-b53a9",
  storageBucket: "animeden-b53a9.appspot.com",
  messagingSenderId: "458354648024",
  appId: "1:458354648024:web:b33e128a1a5ca7a4ad48ad"
};

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth, db };