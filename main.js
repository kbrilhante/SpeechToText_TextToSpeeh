const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
// const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const synth = window.speechSynthesis;

const selLanguage = document.getElementById("language");
const selVoice = document.getElementById("voice");
const rngRate = document.getElementById("rate");
const rngPitch = document.getElementById("pitch");
const btnMIc = document.getElementById("btnMic");

const micOff = '<i class="fa-solid fa-microphone-lines"></i>'
const micOn = '<i class="fa-solid fa-microphone-lines-slash"></i>'

const txtOutput = document.getElementById("txtOutput");

let recognitionOn = false;
let lang;
let voices;
const langs = new Set();

const recognition = new SpeechRecognition();
recognition.continuous = true;

synth.addEventListener("voiceschanged", () => {
    getVoicesList();
    setLang();
    fillLang();
    fillVoices();
});

rngRate.addEventListener("input", () => {
    document.getElementById("rate-value").innerHTML = rngRate.value
});

rngPitch.addEventListener("input", () => {
    document.getElementById("pitch-value").innerHTML = rngPitch.value
});

selLanguage.addEventListener("change", () =>{
    setLang();
    fillVoices();
});

function setLang() {
    if (recognitionOn) {
        stopRecognition()
    }
    lang = selLanguage.value
    recognition.lang = lang;
    console.log("New lang set: " + lang);
}

function fillLang() {
    selLanguage.innerHTML = ""
    let languages = Array.from(langs);
    languages.sort();
    for (const l of languages) {
        const option = document.createElement("option");
        option.textContent = l;
        option.setAttribute('value', l)
        if (navigator.language === l) {
            option.setAttribute('selected', '')
        }
        selLanguage.appendChild(option)
    }
}

function getVoicesList() {
    voices = synth.getVoices();
    langs.clear();
    console.log(voices);
    for (const v of voices) {
        langs.add(v.lang);
    }
    console.log(langs);
}

function fillVoices() {
    selVoice.innerHTML = "";
    for (const v of voices) {
        // if (lang === v.lang) {
            const option = document.createElement("option");
            option.textContent = v.name + " (" + v.lang + ")"
            console.log(v);
            if (v.default) {
                option.setAttribute('selected', '')
            }
            selVoice.appendChild(option);
        // }
    }
}

function speechToText() {
    if (recognitionOn) {
        stopRecognition()
    } else {
        startRecognition()
    }
}

function stopRecognition() {
    recognition.stop();
    recognitionOn = false;
    console.log("Recognition Stopped");
    btnMIc.innerHTML = micOff;
}

function startRecognition() {
    txtOutput.value = "";
    recognition.start();
    recognitionOn = true;
    console.log("Recognition Started");
    btnMIc.innerHTML = micOn;
}

recognition.onresult = (e) => {
    txtOutput.value += e.results[e.resultIndex][0].transcript
    console.log(txtOutput.value);
}

function textToSpeech() {

}
