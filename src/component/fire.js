import firebase from 'firebase/app';
import 'firebase/firebase-firestore'


var firebaseConfig = {
    apiKey: "AIzaSyBdnceUvvskDWMjQFT7PQsdZY36h7LpCWw",
    authDomain: "avisos-63ce9.firebaseapp.com",
    databaseURL: "https://avisos-63ce9-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "avisos-63ce9",
    storageBucket: "avisos-63ce9.appspot.com",
    messagingSenderId: "175293354782",
    appId: "1:175293354782:web:0eb16515f1273651b0af0f",
    measurementId: "G-8XM8SR6BG0"
};

const fire=firebase.initializeApp(firebaseConfig);
const db=fire.firestore()

export { 
    fire,
    db
}