const folders = [];

// Funktion, um neuen Hauptordner zu erstellen
function createFolder() {
    const folderName = prompt("Name des Hauptordners:");
    if (folderName) {
        const folder = {
            name: folderName,
            categories: []
        };
        folders.push(folder);
        displayFolders();
    }
}

// Funktion, um die Ordner anzuzeigen
function displayFolders() {
    const folderSection = document.getElementById("folders");
    folderSection.innerHTML = "";
    folders.forEach((folder, index) => {
        const folderDiv = document.createElement("div");
        folderDiv.classList.add("folder");
        folderDiv.innerHTML = `
            <h3>${folder.name}</h3>
            <button onclick="createCategory(${index})">Kategorie hinzufügen</button>
            <button onclick="learnFolder(${index})">Lernen</button>
            <div id="categories-${index}"></div>
        `;
        folderSection.appendChild(folderDiv);
        displayCategories(index);
    });
}

// Funktion, um eine neue Kategorie hinzuzufügen
function createCategory(folderIndex) {
    const categoryName = prompt("Name der Kategorie:");
    if (categoryName) {
        const category = {
            name: categoryName,
            flashcards: [],
            stage: 1
        };
        folders[folderIndex].categories.push(category);
        displayFolders();
    }
}

// Funktion, um Kategorien anzuzeigen
function displayCategories(folderIndex) {
    const categorySection = document.getElementById(`categories-${folderIndex}`);
    categorySection.innerHTML = "";
    folders[folderIndex].categories.forEach((category, catIndex) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category");
        categoryDiv.innerHTML = `
            <h4>${category.name}</h4>
            <button onclick="addFlashcard(${folderIndex}, ${catIndex})">Karte hinzufügen</button>
            <button onclick="learnCategory(${folderIndex}, ${catIndex})">Lernen</button>
        `;
        categorySection.appendChild(categoryDiv);
    });
}

// Funktion, um neue Karteikarten hinzuzufügen
function addFlashcard(folderIndex, catIndex) {
    const question = prompt("Frage:");
    const answer = prompt("Antwort:");
    if (question && answer) {
        folders[folderIndex].categories[catIndex].flashcards.push({ question, answer, stage: 1 });
    }
}

// Funktion, um den Lernmodus für einen Hauptordner oder eine Kategorie zu starten
function learnFolder(folderIndex) {
    const folder = folders[folderIndex];
    document.getElementById("learning-title").textContent = `Lernen: ${folder.name}`;
    document.getElementById("learning-section").classList.remove("hidden");
    document.getElementById("folder-section").classList.add("hidden");
    loadFlashcards(folder.categories.flatMap(category => category.flashcards));
}

function learnCategory(folderIndex, catIndex) {
    const category = folders[folderIndex].categories[catIndex];
    document.getElementById("learning-title").textContent = `Lernen: ${category.name}`;
    document.getElementById("learning-section").classList.remove("hidden");
    document.getElementById("folder-section").classList.add("hidden");
    loadFlashcards(category.flashcards);
}

function loadFlashcards(flashcards) {
    const flashcardSection = document.getElementById("flashcards");
    flashcardSection.innerHTML = "";

    flashcards.forEach((flashcard, index) => {
        const flashcardDiv = document.createElement("div");
        flashcardDiv.classList.add("flashcard");

        if (flashcard.stage === 1) {
            flashcardDiv.innerHTML = `
                <p>${flashcard.question}</p>
                <button onclick="answerQuestion(${index}, 'richtig')">Richtig</button>
                <button onclick="answerQuestion(${index}, 'falsch')">Falsch</button>
            `;
        } else if (flashcard.stage === 2) {
            flashcardDiv.innerHTML = `
                <p>${flashcard.question}</p>
                <button onclick="showAnswer(${index})">Antwort anzeigen</button>
            `;
        } else if (flashcard.stage === 3) {
            flashcardDiv.innerHTML = `
                <p>${flashcard.question}</p>
                <input type="text" id="userAnswer-${index}" placeholder="Deine Antwort">
                <button onclick="checkAnswer(${index})">Antwort prüfen</button>
            `;
        }
        
        flashcardSection.appendChild(flashcardDiv);
    });
}

// Weitere Funktionen für Lernfortschritt, Antworten prüfen etc.
function answerQuestion(index, result) {
    if (result === 'richtig') {
        flashcards[index].stage++;
    }
    loadFlashcards(flashcards);
}

function showAnswer(index) {
    alert(`Antwort: ${flashcards[index].answer}`);
}

function checkAnswer(index) {
    const userAnswer = document.getElementById(`userAnswer-${index}`).value;
    if (userAnswer.toLowerCase() === flashcards[index].answer.toLowerCase()) {
        alert("Richtig!");
        flashcards[index].stage++;
    } else {
        alert("Falsch!");
    }
    loadFlashcards(flashcards);
}

function backToFolders() {
    document.getElementById("learning-section").classList.add("hidden");
    document.getElementById("folder-section").classList.remove("hidden");
    displayFolders();
}