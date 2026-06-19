// firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'xxxxxx',
  authDomain: 'mysite-dfe65.firebaseapp.com',
  projectId: 'mysite-dfe65',
  storageBucket: 'mysite-dfe65.firebasestorage.app',
  messagingSenderId: '1026898945291',
  appId: '1:1026898945291:web:3f9d23c25f20afb4922e0e',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
