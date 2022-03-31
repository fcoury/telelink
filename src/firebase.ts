import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

dotenv.config();

const firebaseConfig = {
  apiKey: 'AIzaSyB8HZsav9zVqvXuezN6YbujFOfoqkfMoJU',
  authDomain: 'telelinkx.firebaseapp.com',
  projectId: 'telelinkx',
  storageBucket: 'telelinkx.appspot.com',
  messagingSenderId: '57609696298',
  appId: '1:57609696298:web:1500e2e5e931f133023f53',
  measurementId: 'G-J4286NYFMJ',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
