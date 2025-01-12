// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyCZMuQBnw-q4OF1BGwPcTZ2FCsla3UFZ_4",
    authDomain: "e-studenthub.firebaseapp.com",
    projectId: "e-studenthub",
    storageBucket: "e-studenthub.firebasestorage.app",
    messagingSenderId: "166779772457",
    appId: "1:166779772457:web:4bc3c3b88a84fde2390638"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


//get the email and password values
const register = document.getElementById("submit-button");
//create account
register.addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check if both email and password are not empty
    if (email.trim() === "" || password.trim() === "") {
        alert("Please fill in both email and password fields.");
        return; // Do not proceed with registration if fields are empty
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Registering...");
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
});


