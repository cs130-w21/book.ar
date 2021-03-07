/**
 * @namespace Firebase
 */

import firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

/**
 * @typedef {Object} FirebaseConfig - An object which defines the options to be used in camera processing.
 * @property {string}  apiKey - The private API key to authenticate requests.
 * @property {string}  authDomain - The endpoint for authenticating users.
 * @property {string}  projectId - The Firebase ID for the project.
 * @property {string}  storageBucket - The endpoint for the Firestore database.
 * @property {string}  messagingSenderId
 * @property {string}  appId
 * @property {string}  measurementId
 */


/**
 * @constant
 * @type {FirebaseConfig}
 * @memberof Firebase
 */
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
