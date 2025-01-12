import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";  
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";  

// Firebase Configuration  
const firebaseConfig = {  
    apiKey: "AIzaSyCZMuQBnw-q4OF1BGwPcTZ2FCsla3UFZ_4",  
    authDomain: "e-studenthub.firebaseapp.com",  
    projectId: "e-studenthub",  
    storageBucket: "e-studenthub.firebasestorage.app",  
    messagingSenderId: "166779772457",  
    appId: "1:166779772457:web:4bc3c3b88a84fde2390638"  
};  

const app = initializeApp(firebaseConfig);  
const auth = getAuth(app);  

// User Authentication Handling  
onAuthStateChanged(auth, (user) => {  
    if (user) {  
        const email = document.getElementById('userEmail');  
        const username = document.getElementById('userName');  
        const profile = document.getElementById('profileImage');  
        const pointsValue = document.getElementById('pointsValue');  

        email.innerText = user.email;  
        username.innerText = user.displayName;  
        profile.src = "https://lh3.googleusercontent.com/a/ACg8ocLKnJjfskBaCFPsLm8YN2vuXzWCE8iyF0WiKA5XoAqC2w=s96-c";  

        const userPoints = 100; // Replace with actual points from your database  
        pointsValue.innerText = userPoints;  

        startWebcam();  
    } else {  
        alert("logged out...");  
        window.location.href = "index.html";  
    }  
});  

// Logout Function  
const logout = document.getElementById("logout");  
logout.addEventListener("click", function() {  
    signOut(auth).then(() => {  
        alert("logging out...");  
        window.location.href = "index.html";  
    }).catch((error) => {  
        console.error("Sign out error:", error);  
    });  
});  

// Emotion and Mood Functions  
const video = document.getElementById("webcam");  
const emotionDisplay = document.getElementById("emotionDisplay");  
const songTitle = document.getElementById("songTitle");  
const moodDisplay = document.getElementById("moodDisplay");  
const musicPlayer = document.getElementById("musicPlayer");  
const musicSource = document.getElementById("musicSource");  
const musicPlayerSection = document.getElementById("music-player-section");  
const canvas = document.getElementById("faceCanvas");  
const context = canvas.getContext("2d");  

let isPlaying = false;  
let songPlayed = false;  

// Start Webcam  
function startWebcam() {  
    console.log("Attempting to access webcam...");  
    navigator.mediaDevices.getUserMedia({ video: true })  
        .then((stream) => {  
            video.srcObject = stream;  
            video.addEventListener('loadedmetadata', () => {  
                canvas.width = video.videoWidth;  
                canvas.height = video.videoHeight;  
            });  
            setInterval(captureAndSendFrame, 1000);  
        })  
        .catch((error) => {  
            console.error("Webcam Error:", error);  
            emotionDisplay.textContent = "Error: Unable to access webcam.";  
        });  
}  

// Capture Frame  
function captureAndSendFrame() {  
    const canvasCapture = document.createElement("canvas");  
    const contextCapture = canvasCapture.getContext("2d");  
    canvasCapture.width = video.videoWidth;  
    canvasCapture.height = video.videoHeight;  
    contextCapture.drawImage(video, 0, 0, canvasCapture.width, canvasCapture.height);  

    const base64Image = canvasCapture.toDataURL("image/jpeg").split(",")[1];  
    fetchEmotion(base64Image);  
}  

// Fetch Emotion and potentially Play Music  
function fetchEmotion(imageData) {  
    fetch("https://concrete-conversely-parakeet.ngrok.app/predict", {  
        method: "POST",  
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify({ image: imageData }),  
    })  
    .then((response) => {  
        if (!response.ok) {  
            throw new Error(`HTTP error! Status: ${response.status}`);  
        }   
        return response.json();  
    })  
    .then((data) => {  
        const detectedEmotion = data.emotion || "None";  
        console.log('Emotion:', detectedEmotion);  
        console.log('Song Data:', data.song); // Debug info for song data  
        emotionDisplay.textContent = `Detected Emotion: ${detectedEmotion}`;  

        context.clearRect(0, 0, canvas.width, canvas.height);  

        if (data.song && !songPlayed) {  
            playSong(detectedEmotion, data.song);  
            songPlayed = true;  
        } else if (!data.song) {  
            if (!isPlaying) {  
                songTitle.textContent = "Song: None";  
            }  
        }  
    })  
    .catch((error) => {  
        console.error("API Error:", error);  
        emotionDisplay.textContent = "Error: Could not detect emotion.";  
    });  
}  

// Play Song Function  
function playSong(emotion, song) {  
    songTitle.textContent = `Song: ${song}`;  
    moodDisplay.textContent = `Mood: ${emotion}`;  
    musicSource.src = `https://concrete-conversely-parakeet.ngrok.app/music/${emotion}/${song}`;  
    musicPlayer.load();  
    musicPlayer.play();  
    musicPlayerSection.style.display = "block"; // Ensure the music player section is visible  
    isPlaying = true;  

    musicPlayer.onended = () => {  
        isPlaying = false;  
        songTitle.textContent = "Song: None";  
    };  
}  

// Initialize webcam and Emotion detection  
onAuthStateChanged(auth, (user) => {  
    if (user) {  
        startWebcam();  
    }  
});