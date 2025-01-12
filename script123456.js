// particles.js configuration remains unchanged  
particlesJS("particles-js", {  
    particles: {  
        number: { value: 180, density: { enable: true, value_area: 800 } },  
        color: { value: "#ff6600" },  
        shape: {  
            type: "circle",  
            stroke: { width: 5, color: "#FFFF" },  
            polygon: { nb_sides: 5 },  
        },  
        opacity: { value: 0.5, anim: { enable: false } },  
        size: { value: 3, random: true, anim: { enable: false } },  
        line_linked: { enable: true, distance: 150, color: "#ff6600", opacity: 0.4, width: 2 },  
        move: { enable: true, speed: 6, out_mode: "out" },  
    },  
    interactivity: {  
        detect_on: "canvas",  
        events: { onhover: { enable: true, mode: "repulse" } },  
        modes: { repulse: { distance: 200, duration: 0.4 } },  
    },  
    retina_detect: true,  
});  

// DOM Elements  
const video = document.getElementById("webcam");  
const emotionDisplay = document.getElementById("emotionDisplay");  
const songTitle = document.getElementById("songTitle");  
const moodDisplay = document.getElementById("moodDisplay"); // New element for mood display  
const musicPlayer = document.getElementById("musicPlayer");  
const musicSource = document.getElementById("musicSource");  
const musicPlayerSection = document.getElementById("music-player-section");  
const canvas = document.getElementById("faceCanvas"); // Reference to the new canvas  
const context = canvas.getContext("2d");  

let isPlaying = false; // Flag to check if music is currently playing  
let songPlayed = false; // Flag to check if a song has already been played  

// Start Webcam  
function startWebcam() {  
    navigator.mediaDevices.getUserMedia({ video: true })  
        .then((stream) => {  
            video.srcObject = stream;  
            video.addEventListener('loadedmetadata', () => {  
                canvas.width = video.videoWidth; // Set canvas width  
                canvas.height = video.videoHeight; // Set canvas height  
            });  
            setInterval(() => captureAndSendFrame(), 1000); // Capture frame every second  
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

// Fetch Emotion and Play Music  
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
            emotionDisplay.textContent = `Detected Emotion: ${detectedEmotion}`;  

            // Clear the canvas before drawing new rectangles  
            context.clearRect(0, 0, canvas.width, canvas.height);  

            // Log the face data received from the API  
            console.log("Face data received:", data.faces);  

            // Draw rectangles around detected faces (if needed, you can add visual feedback here)  
            if (data.faces) {  
                data.faces.forEach(face => {  
                    // Scale the coordinates based on the video dimensions  
                    const x = face.x;  
                    const y = face.y;  
                    const w = face.w;  
                    const h = face.h;  

                    // You can add visual feedback here if needed, but the red border is disabled  
                    // context.strokeStyle = "red"; // Set border color  
                    // context.lineWidth = 2; // Set border width  
                    // context.strokeRect(x, y, w, h); // Draw rectangle  
                });  
            } else {  
                console.log("No faces detected.");  
            }  

            // Check if a song should be played  
            if (data.song && !songPlayed) {  
                playSong(detectedEmotion, data.song);  // Pass the detected emotion and song  
                songPlayed = true; // Set the flag to true after playing the first song  
            } else if (!data.song) {  
                // If no song is specified, keep the current song title  
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
    moodDisplay.textContent = `Mood: ${emotion}`;  // Update mood display  
    musicSource.src = `https://concrete-conversely-parakeet.ngrok.app/music/${emotion}/${song}`;  
    musicPlayer.load();  
    musicPlayer.play();  
    musicPlayerSection.style.display = "block"; // Ensure the music player section is visible  
    isPlaying = true; // Set the flag to true  

    musicPlayer.onended = () => {  
        isPlaying = false; // Reset the flag when the song ends  
        songTitle.textContent = "Song: None"; // Reset song title when finished  
        // Do not reset songPlayed flag to allow only the first song to play  
    };  
}  

// Initialize Webcam and Emotion Detection  
startWebcam();