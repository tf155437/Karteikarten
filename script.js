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

// Funktion, um die Ordner in der Sidebar anzuzeigen
function displayFolders() {
    const folderSection = document.getElementById("folders");
    folderSection.innerHTML = "";
    folders.forEach((folder, index) => {
        const folderDiv = document.createElement("div");
        folderDiv.classList.add("folder");
        folderDiv.innerHTML = `
            <h3>${folder.name}</h3>
            <button onclick="createCategory(${index})">Kategorie hinzufügen</button>
            <button onclick="displayCategories(${index})">Kategorien anzeigen</button>
        `;
        folderSection.appendChild(folderDiv);
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
    const categorySection = document.getElementById("flashcards");
    categorySection.innerHTML = "";
    folders[folderIndex].categories.forEach((category, catIndex) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("flashcard");
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

// Funktion zur Auswahl einer Stufe
function selectStage(stage) {
    alert(`Lernmodus für Stufe ${stage} wird gestartet`);
}

// Funktion zum Starten des Lernmodus für eine Kategorie
function learnCategory(folderIndex, catIndex) {
    alert(`Lernmodus für Kategorie: ${folders[folderIndex].categories[catIndex].name}`);
}