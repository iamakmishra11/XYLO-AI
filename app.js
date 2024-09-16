const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const outputContainer = document.querySelector('#output-container');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss Anuj...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master Anuj...");
    } else {
        speak("Good Evening Anuj Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing XYLO...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.value = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.value = "Listening...";
    recognition.start();
});

async function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Anuj Sir, My lord How May I Help You?");
    } else if (message.includes("who am i?")) {
        speak("Anuj Kumar Mishra, also known as the revolutionary man");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google Sir Anuj...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube Sir Anuj...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook Sir Anuj...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet Sir Anuj regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia Sir Anuj regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else if (message.includes('play song')) {
        const songName = message.replace('play song', '').trim();
        const videoId = await getYouTubeVideoId(songName);
        if (videoId) {
            const finalText = `Playing ${songName} on YouTube`;
            speak(finalText);
            outputContainer.innerHTML = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
            speak("Sorry, I couldn't find the song.");
        }
    } else if (message.includes('show image')) {
        const query = message.replace('show image', '').trim();
        const imageUrl = await getImageUrl(query);
        if (imageUrl) {
            const finalText = `Showing image of ${query}`;
            speak(finalText);
            outputContainer.innerHTML = `<img src="${imageUrl}" alt="${query}">`;
        } else {
            speak("Sorry, I couldn't find the image.");
        }
    } else {
        const response = await getAIResponse(message);
        speak(response);
    }
}

async function getYouTubeVideoId(query) {
    const apiKey = 'YOUR_YOUTUBE_API_KEY';
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}`);
    const data = await response.json();
    if (data.items.length > 0) {
        return data.items[0].id.videoId;
    }
    return null;
}

async function getImageUrl(query) {
    const apiKey = 'YOUR_UNSPLASH_API_KEY';
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${apiKey}`);
    const data = await response.json();
    return data.urls.regular;
}

async function getAIResponse(message) {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_HUGGING_FACE_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: message })
    });
    const data = await response.json();
    return data.generated_text;
}
