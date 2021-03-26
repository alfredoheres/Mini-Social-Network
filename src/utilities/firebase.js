import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB7oyrLhStqYGpweG--3ZNU3FA6lKcwjYQ",
    authDomain: "mini-social-network-855ff.firebaseapp.com",
    projectId: "mini-social-network-855ff",
    storageBucket: "mini-social-network-855ff.appspot.com",
    messagingSenderId: "701784044555",
    appId: "1:701784044555:web:530a7de6e69875b06f830e"
  };

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase



