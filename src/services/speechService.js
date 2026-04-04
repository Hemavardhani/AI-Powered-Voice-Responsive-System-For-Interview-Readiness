// Speech Recognition Setup
export const startSpeechRecognition = (onResult, onError) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Speech recognition not supported in this browser. Please use Chrome.",
    );
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    onError(event.error);
  };

  recognition.start();
  return recognition;
};

// Text-to-Speech
export const speakText = (text, onEnd) => {
  if (!window.speechSynthesis) {
    alert("Text-to-speech not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  window.speechSynthesis.cancel();
};
