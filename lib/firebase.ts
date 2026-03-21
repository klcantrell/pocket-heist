import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBXENd-OTUd16jDYouLit1Y3CU2Ld4Yh18",
  authDomain: "kal-pocket-heist-website.firebaseapp.com",
  projectId: "kal-pocket-heist-website",
  storageBucket: "kal-pocket-heist-website.firebasestorage.app",
  messagingSenderId: "566962573333",
  appId: "1:566962573333:web:86d3dcb889921f61337e1c",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
