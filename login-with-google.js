// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


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
const provider = new GoogleAuthProvider();
auth.languageCode = 'it';



const login = document.getElementById("google-login")
login.addEventListener("click", function () {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            alert("Login Successful :)" + user.email);
            window.location.href = "dashboard.html";

        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;

            const email = error.customData.email;

            const credential = GoogleAuthProvider.credentialFromError(error)

            alert(errorMessage)

        });
})