document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");

  // Navigation Buttons
  const allVocabBtn = document.getElementById("all-vocab-btn");
  const addBtn = document.getElementById("add-btn");
  const learnBtn = document.getElementById("learn-btn");
  const foldersBtn = document.getElementById("folders-btn");
  const deleteBtn = document.getElementById("delete-btn");

  // Mock Data
  let folders = [];
  let categories = {}; // Kategorien in den Ordnern
  let vocabData = []; // Vokabeln mit Referenzen zu Ordnern und Kategorien

  // Event Listener: Alle Vokabeln anzeigen
  allVocabBtn.addEventListener("click", () => {
    mainContent.innerHTML = `
      <h2>Alle Vokabeln</h2>
      <p>Hier erscheinen die Vokabelkarten.</p>
      <ul id="vocab-list"></ul>
    `;
    displayVocabList();
  });

  // Funktion zur Anzeige aller Vokabeln
  function displayVocabList() {
    const vocabList = document.getElementById("vocab-list");
    vocabList.innerHTML = "";

    vocabData.forEach((vocab) => {
      const vocabItem = document.createElement("li");
      vocabItem.innerHTML = `${vocab.word} - ${vocab.translation} (Ordner: ${vocab.folder}, Kategorie: ${vocab.category})`;
      vocabList.appendChild(vocabItem);
    });
  }

  // Event Listener: Hinzufügen
  addBtn.addEventListener("click", () => {
    mainContent.innerHTML = `
      <h2>Neuen Ordner erstellen</h2>
      <form id="add-folder-form">
        <input type="text" id="folder-name" placeholder="Ordnername" required>
        <button type="submit">Ordner erstellen</button>
      </form>
    `;

    const folderForm = document.getElementById("add-folder-form");
    folderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const folderName = document.getElementById("folder-name").value.trim();

      if (!folders.includes(folderName)) {
        folders.push(folderName);
        categories[folderName] = [];
        alert(`Ordner "${folderName}" erstellt!`);
        addCategory(folderName);
      } else {
        alert("Ordner existiert bereits.");
      }
    });
  });

  // Funktion zum Hinzufügen einer Kategorie
  function addCategory(folderName) {
    mainContent.innerHTML = `
      <h2>Kategorie zu "${folderName}" hinzufügen</h2>
      <form id="add-category-form">
        <input type="text" id="category-name" placeholder="Kategoriename" required>
        <button type="submit">Kategorie hinzufügen</button>
      </form>
    `;

    const categoryForm = document.getElementById("add-category-form");
    categoryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const categoryName = document.getElementById("category-name").value.trim();

      if (!categories[folderName].includes(categoryName)) {
        categories[folderName].push(categoryName);
        alert(`Kategorie "${categoryName}" in Ordner "${folderName}" hinzugefügt!`);
        addFlashcard(folderName, categoryName);
      } else {
        alert("Kategorie existiert bereits.");
      }
    });
  }

  // Funktion zum Hinzufügen von Vokabelkarten
  function addFlashcard(folderName, categoryName) {
    mainContent.innerHTML = `
      <h2>Neue Karteikarte hinzufügen</h2>
      <p>Ordner: ${folderName}, Kategorie: ${categoryName}</p>
      <form id="add-flashcard-form">
        <input type="text" id="vocab-word" placeholder="Vokabel" required>
        <input type="text" id="vocab-translation" placeholder="Übersetzung" required>
        <button type="submit">Karteikarte hinzufügen</button>
      </form>
    `;

    const flashcardForm = document.getElementById("add-flashcard-form");
    flashcardForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const vocabWord = document.getElementById("vocab-word").value.trim();
      const vocabTranslation = document.getElementById("vocab-translation").value.trim();

      vocabData.push({ word: vocabWord, translation: vocabTranslation, folder: folderName, category: categoryName });
      alert(`Karteikarte "${vocabWord} - ${vocabTranslation}" hinzugefügt!`);
      mainContent.innerHTML = `<h2>Karteikarte erfolgreich hinzugefügt!</h2>`;
    });
  }

  // Event Listener: Ordner anzeigen
  foldersBtn.addEventListener("click", () => {
    mainContent.innerHTML = `
      <h2>Alle Ordner und Kategorien</h2>
      <div id="folders-container"></div>
    `;
    displayFoldersAndCategories();
  });

  // Funktion zur Anzeige aller Ordner und deren Kategorien
  function displayFoldersAndCategories() {
    const foldersContainer = document.getElementById("folders-container");
    foldersContainer.innerHTML = "";

    folders.forEach(folder => {
      const folderSection = document.createElement("div");
      folderSection.classList.add("folder-section");

      folderSection.innerHTML = `
        <h3>${folder}</h3>
        <ul id="category-list-${folder}" class="category-list"></ul>
      `;

      foldersContainer.appendChild(folderSection);

      const categoryList = document.getElementById(`category-list-${folder}`);
      categories[folder].forEach(category => {
        const categoryItem = document.createElement("li");
        categoryItem.innerHTML = `
          <strong>${category}</strong>
          <ul id="vocab-list-${folder}-${category}" class="vocab-list"></ul>
        `;
        categoryList.appendChild(categoryItem);

        // Vokabeln in der Kategorie anzeigen
        const vocabList = document.getElementById(`vocab-list-${folder}-${category}`);
        const vocabInCategory = vocabData.filter(vocab => vocab.folder === folder && vocab.category === category);

        if (vocabInCategory.length > 0) {
          vocabInCategory.forEach(vocab => {
            const vocabItem = document.createElement("li");
            vocabItem.textContent = `${vocab.word} - ${vocab.translation}`;
            vocabList.appendChild(vocabItem);
          });
        } else {
          vocabList.innerHTML = "<li>Keine Vokabeln vorhanden.</li>";
        }
      });
    });
  }

  // Event Listener: Lernen
  learnBtn.addEventListener("click", () => {
    let categoryList = "<h2>Wähle eine Kategorie und einen Lernmodus:</h2><div class='category-container'>";
    for (let folder in categories) {
      categories[folder].forEach((category) => {
        categoryList += `
          <div class="category-section">
            <h3>${category} (Ordner: ${folder})</h3>
            <button class="learn-button" data-category="${category}" data-folder="${folder}" data-mode="correct-or-wrong">Falsch oder Richtig</button>
            <button class="learn-button" data-category="${category}" data-folder="${folder}" data-mode="multiple-choice">Auswählen</button>
            <button class="learn-button" data-category="${category}" data-folder="${folder}" data-mode="write-answer">Schreiben</button>
          </div>
        `;
      });
    }
    categoryList += "</div>";
    mainContent.innerHTML = categoryList;

    document.querySelectorAll(".learn-button").forEach((button) => {
      button.addEventListener("click", function () {
        const selectedCategory = this.getAttribute("data-category");
        const selectedFolder = this.getAttribute("data-folder");
        const selectedMode = this.getAttribute("data-mode");

        if (selectedMode === "correct-or-wrong") {
          startTrueFalse(selectedFolder, selectedCategory);
        } else if (selectedMode === "multiple-choice") {
          startMultipleChoice(selectedFolder, selectedCategory);
        } else if (selectedMode === "write-answer") {
          startWriting(selectedFolder, selectedCategory);
        }
      });
    });
  });
});
