import firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const config = {
  apiKey: 'AIzaSyBCt8TmDRe02feK4eoz9PfT2-pRTmi6ytk',
  authDomain: 'bookar-7798d.firebaseapp.com',
  projectId: 'bookar-7798d',
  storageBucket: 'bookar-7798d.appspot.com',
  messagingSenderId: '85677281157',
  appId: '1:85677281157:web:9ad6882012e739ab2f3eec',
  measurementId: 'G-689KZNF9VV',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
  firebase.firestore().settings({ experimentalForceLongPolling: true })
}

export {firebase};
