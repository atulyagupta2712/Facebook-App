import React from 'react'
import * as firebase from 'firebase'

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDkZV4iI2m5PJB2XbhnpGhC6IM5wKeF6xs",
    authDomain: "projectplan-b3232.firebaseapp.com",
    databaseURL: "https://projectplan-b3232.firebaseio.com",
    projectId: "projectplan-b3232",
    storageBucket: "projectplan-b3232.appspot.com",
    messagingSenderId: "102438603555",
    appId: "1:102438603555:web:d8b1afd9ee5356a2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase