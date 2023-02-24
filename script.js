const clearConsol = document.getElementById("clear-consol");
const instead = document.getElementById("instead");
const copy = document.getElementById("copy");
const copied1 = document.getElementById("copied1");
const copy2 = document.getElementById("copy2");
const copied2 = document.getElementById("copied2");
const voice = document.getElementById("voice");
const voice2 = document.getElementById("voice2");
const writeArea = document.getElementById("left-side-textarea");
const displayArea = document.getElementById("right-side-textarea");
const selectFrom = document.getElementById("select-from");
const selectTo = document.getElementById("select-to");
const translate = document.getElementById("translate");
const copybutton = document.getElementById("copybutton");
const spinner = document.getElementById("spinner");
let currentFromValue;
let currentToValue;
let currentText;
clearConsol.addEventListener("click", () => {
    writeArea.value = "";
    displayArea.value = "";
    writeArea.focus();
});
writeArea.addEventListener("input", (e) => {
    currentText = writeArea.value
    if(writeArea.value == ""){
        displayArea.value = "";
    };
});
window.addEventListener("load", () => {
    for (let lang in languages) {
        if (lang == "tr") {
            selectFrom.innerHTML = `<option class="from-option" value="${lang}">${languages[lang]}</option>`
            currentFromValue = lang
        };
    };
    for (let lang in languages) {
        if (lang == "en") {
            selectTo.innerHTML = `<option class="from-option" value="${lang}">${languages[lang]}</option>`
            currentToValue = lang
        };
    };
    let html;
    for (const lang in languages) {
        html += `
            <option class="from-option" value="${lang}">${languages[lang]}</option>
        `;
    };
    selectFrom.innerHTML += html;
    selectTo.innerHTML += html;
});
document.addEventListener("keypress", (e) => {
    if(e.key == "Enter"){
        e.preventDefault();
        if(writeArea.value == ""){
            writeArea.focus();
        }else{
            translate.click();
            spinner.style.display = "block";
        };
    };
});
instead.addEventListener("click", () => {
    spinner.style.display = "block";
    let textArea = writeArea.value;
    writeArea.value = displayArea.value;
    displayArea.value = textArea;
    let selectFr = selectFrom.value;
    selectFrom.value = selectTo.value;
    selectTo.value = selectFr;
    currentFromValue = selectFrom.value;
    currentToValue = selectTo.value;
    setTranslate(currentText, currentFromValue, currentToValue);
});
let utterThis;
voice.addEventListener("click", () => {
    const utterThis = new SpeechSynthesisUtterance(writeArea.value);
    utterThis.lang = selectFrom.value;
    speechSynthesis.speak(utterThis);
});
voice2.addEventListener("click", () => {
    const utterThis2 = new SpeechSynthesisUtterance(displayArea.value);
    utterThis2.lang = selectTo.value;
    speechSynthesis.speak(utterThis2);
});
copy.addEventListener("click", () => {
    let copiedText = writeArea.value;
    navigator.clipboard.writeText(copiedText);
    copied1.style.display = "block";
    setTimeout(() => {
        copied1.style.display = "none";
    }, 1000)
});
copy2.addEventListener("click", () => {
    let copiedText = displayArea.value;
    navigator.clipboard.writeText(copiedText);
    copied2.style.display = "block";
    setTimeout(() => {
        copied2.style.display = "none";
    }, 1000)
});
translate.addEventListener("click", () => {
    spinner.style.display = "block";
    if(writeArea.value == ""){
        writeArea.focus();
    }else{
        setTranslate(currentText, currentFromValue, currentToValue);
    };
});
selectFrom.addEventListener("change", () => {
    currentFromValue = selectFrom.options[selectFrom.selectedIndex].value;
    selectFrom.size = 0;
    writeArea.value = "";
    displayArea.value = "";
})
selectTo.addEventListener("change", () => {
    currentToValue = selectTo.options[selectTo.selectedIndex].value;
    selectTo.size = 0;
    selectTo.classList.remove("move");
    if(writeArea.value.length > 0){
        setTranslate(currentText, currentFromValue, currentToValue);
    }
});
selectFrom.onfocus = () => {
    selectFrom.size = 15;
}
selectFrom.onblur = () => {
    selectFrom.size = 0;
}
selectTo.onfocus = () => {
    selectTo.classList.add("move");
    selectTo.size = 15;
}
selectTo.onblur = () => {
    selectTo.classList.remove("move");
    selectTo.size = 0;
}
const setTranslate = (text, from, to) => {
    fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${from}|${to}`)
        .then(response => response.json())
        .then(data => {
            displayArea.value = data.responseData.translatedText;
            spinner.style.display = "none";
        })
        .catch(err => console.log(err))
};