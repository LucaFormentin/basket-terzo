import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyBE4JADmM7KTSFxYNkYot06tx6hspLYUB0',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: 'basket-terzo-913d8',
  storageBucket: 'basket-terzo-913d8.appspot.com',
  messagingSenderId: '245623452072',
  appId: '1:245623452072:web:fb2fe4127251d63137ed9d',
  measurementId: 'G-JK4EXBVKBN',
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export { database }
