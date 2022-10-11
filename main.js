const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const recognition = new SpeechRecognition();
recognition.continuous = true;

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
let voices;
const langs = new Set();


synth.addEventListener("voiceschanged", () => {
    getVoicesList();
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
    if (recognitionOn) {
        stopRecognition()
    }
    fillVoices()
});

function getVoicesList() {
    voices = synth.getVoices();
    langs.clear();
    for (const v of voices) {
        langs.add(v.lang);
    }
    console.log(langs);
}

function fillLang() {
    selLanguage.innerHTML = ""
    let languages = Array.from(langs);
    languages.push("- All -")
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

function fillVoices() {
    selVoice.innerHTML = "";
    for (const v of voices) {
        if (selLanguage.value === v.lang || selLanguage.value === "- All -") {
            console.log("lang: " + selLanguage.value + " - v.lang: " + v.lang)
            const option = document.createElement("option");
            option.textContent = v.name + " (" + v.lang + ")"
            option.setAttribute('data-name', v.name)
            option.setAttribute('data-lang', v.lang)
            if (v.default) {
                option.textContent += " - Default"
                option.setAttribute('selected', '')
                voice = v.name;
            }
            selVoice.appendChild(option);
        }
    }
}
// function setLang() {
    
//     // lang = selLanguage.value;
//     // recognition.lang = lang;
//     // console.log("New lang set: " + lang);
// }

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
    recognition.lang = selVoice.selectedOptions[0].getAttribute('data-lang')
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
    stopRecognition();
    const utterThis = new SpeechSynthesisUtterance(txtOutput.value);
    const voice = selVoice.selectedOptions[0].getAttribute('data-name')
    for (const v of voices) {
        if (v.name === voice) {
            utterThis.voice = v;
            console.log(voice);
        }
    }
    utterThis.pitch = rngPitch.value;
    utterThis.rate = rngRate.value;
    synth.speak(utterThis);

    txtOutput.blur()
}
