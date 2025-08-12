// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDP_2n0eOXZHBXzRLLlWdJpjUa4fRPT_kI",
  authDomain: "quiz-hunt-c9732.firebaseapp.com",
  projectId: "quiz-hunt-c9732",
  storageBucket: "quiz-hunt-c9732.firebasestorage.app",
  messagingSenderId: "464063562366",
  appId: "1:464063562366:web:f278317b0bebcf4ad3ce2f",
  measurementId: "G-37JRR85JXJ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };


// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const analytics = getAnalytics(app);
// export { db, storage };






