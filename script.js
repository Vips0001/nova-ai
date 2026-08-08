const messages = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const newChatBtn = document.getElementById("newChatBtn");
const darkBtn = document.getElementById("darkBtn");
const clearBtn = document.getElementById("clearBtn");
const voiceBtn = document.getElementById("voiceBtn");
const typing = document.getElementById("typing");

let chatHistory =
    JSON.parse(localStorage.getItem("novaChat")) || [];


/* SAVE MEMORY */

function saveMemory() {
    localStorage.setItem(
        "novaChat",
        JSON.stringify(chatHistory)
    );
}


/* ADD MESSAGE */

function addMessage(text, type, save = true) {

    const message = document.createElement("div");

    message.className = `message ${type}`;

    const avatar = document.createElement("div");

    avatar.className = "avatar";

    avatar.textContent =
        type === "user" ? "👤" : "🤖";

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = text;

    message.appendChild(avatar);
    message.appendChild(bubble);

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;

    if (save) {

        chatHistory.push({
            text: text,
            type: type
        });

        saveMemory();
    }
}


/* LOAD MEMORY */

function loadMemory() {

    if (chatHistory.length === 0) {

        addMessage(
            "Hello! 👋 I'm Nova, your personal AI assistant. How can I help you?",
            "assistant"
        );

        return;
    }

    chatHistory.forEach(item => {

        addMessage(
            item.text,
            item.type,
            false
        );

    });
}


/* DEMO AI */

function getAIResponse(question) {

    const text = question.toLowerCase();

    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {
        return "Hello! 👋 I'm Nova. What can I help you with?";
    }

    if (text.includes("your name")) {
        return "My name is Nova 🤖.";
    }

    if (text.includes("who are you")) {
        return "I'm Nova, your personal AI assistant.";
    }

    if (text.includes("how are you")) {
        return "I'm doing great! 😄 What would you like to do?";
    }

    if (text.includes("thank")) {
        return "You're welcome! 😊";
    }

    if (text.includes("time")) {
        return "Your computer's current time is " +
            new Date().toLocaleTimeString();
    }

    return "I understand your question: \"" +
        question +
        "\"\n\nI'm currently running in demo mode. Connect me to a real AI model and I'll be able to answer questions properly.";
}


/* SPEAK */

function speak(text) {

    if (!("speechSynthesis" in window)) {
        alert("Voice output is not supported in this browser.");
        return;
    }

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 1;
    speech.pitch = 1;

    speechSynthesis.speak(speech);
}


/* SEND */

function sendMessage() {

    const text = userInput.value.trim();

    if (!text) return;

    addMessage(text, "user");

    userInput.value = "";

    typing.style.display = "block";

    setTimeout(() => {

        const response = getAIResponse(text);

        typing.style.display = "none";

        addMessage(response, "assistant");

        speak(response);

    }, 700);
}


/* SEND BUTTON */

sendBtn.addEventListener(
    "click",
    sendMessage
);


/* ENTER */

userInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }
    }
);


/* NEW CHAT */

newChatBtn.addEventListener(
    "click",
    function() {

        chatHistory = [];

        saveMemory();

        messages.innerHTML = "";

        addMessage(
            "New chat started! 👋",
            "assistant"
        );
    }
);


/* CLEAR MEMORY */

clearBtn.addEventListener(
    "click",
    function() {

        localStorage.removeItem("novaChat");

        chatHistory = [];

        messages.innerHTML = "";

        addMessage(
            "Memory cleared! 🧹",
            "assistant"
        );
    }
);


/* DARK MODE */

darkBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle("dark");

        const dark =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "novaDark",
            dark
        );
    }
);


/* LOAD DARK MODE */

if (
    localStorage.getItem("novaDark") === "true"
) {
    document.body.classList.add("dark");
}


/* VOICE INPUT */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.onstart = function() {

        micBtn.textContent = "🔴";
    };

    recognition.onend = function() {

        micBtn.textContent = "🎤";
    };

    recognition.onresult = function(event) {

        const text =
            event.results[0][0].transcript;

        userInput.value = text;

        sendMessage();
    };

} else {

    micBtn.disabled = true;

    micBtn.title =
        "Voice input is not supported.";
}


/* MICROPHONE */

micBtn.addEventListener(
    "click",
    function() {

        if (!recognition) {

            alert(
                "Voice input is not supported in this browser."
            );

            return;
        }

        recognition.start();
    }
);


/* VOICE SIDEBAR BUTTON */

voiceBtn.addEventListener(
    "click",
    function() {

        if (recognition) {
            recognition.start();
        }
    }
);


/* LOAD CHAT */

loadMemory();