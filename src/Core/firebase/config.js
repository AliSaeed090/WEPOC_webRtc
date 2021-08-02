import { decode, encode } from 'base-64';
import './timerConfig';
global.addEventListener = (x) => x;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB4v4iqJqPktLvHz3YylpfANJ9t8vHRZFg',
  authDomain: 'wepoc-446d9.firebaseapp.com',
  databaseURL: 'https://wepoc-446d9-default-rtdb.firebaseio.com/',
  projectId: 'wepoc-446d9',
  storageBucket: 'wepoc-446d9.appspot.com',
  messagingSenderId: '34309224117',
  appId: '1:34309224117:web:9fa87d4ebf9f27eb9430fc',
  measurementId: 'G-C03PGK870P',
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export { firebase };
