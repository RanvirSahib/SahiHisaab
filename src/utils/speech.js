// Speech Synthesis utility for rural/vernacular voice readout

export const speakText = (text, lang = 'hi', onStart, onEnd) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Web Speech API not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Map languages to BCP 47 locale codes
  const localeMap = {
    hi: 'hi-IN',
    pa: 'pa-IN',
    en: 'en-IN'
  };

  utterance.lang = localeMap[lang] || 'hi-IN';
  utterance.rate = 0.88; // Slightly slower, clear cadence for elderly/rural clarity
  utterance.pitch = 1.0;

  // Try to pick an Indian accent or native voice if available in the browser
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.lang === utterance.lang || 
    (utterance.lang.startsWith('hi') && (v.name.includes('Hindi') || v.lang.includes('hi'))) ||
    (utterance.lang.startsWith('pa') && (v.name.includes('Punjabi') || v.lang.includes('pa'))) ||
    (utterance.lang.startsWith('en') && (v.name.includes('India') || v.lang.includes('IN')))
  );

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
