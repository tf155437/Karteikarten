document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");

  // Navigation Buttons
  const allVocabBtn = document.getElementById("all-vocab-btn");
  const addBtn = document.getElementById("add-btn");
  const learnBtn = document.getElementById("learn-btn");
  const foldersBtn = document.getElementById("folders-btn");

  // Datenstrukturen
  let folders = [];
  let categories = {}; // Kategorien nach Ordnern
  let vocabData = []; // Vokabeln mit Ordner- und Kategoriezusammenhang

  // Event Listener: Alle Vokabeln anzeigen
  allVocabBtn.addEventListener("click", () => {
    updateContent(`
      <h2>Alle Vokabeln</h2>
      <ul id="vocab-list"></ul>
    `);
    displayVocabList();
  });

  // Event Listener: Hinzufügen
  addBtn.addEventListener("click", () => {
    updateContent(`
      <h2>Neuen Ordner, Kategorie und Vokabeln hinzufügen</h2>
      <form id="add-folder-form">
        <h3>Ordner erstellen:</h3>
        <input type="text" id="folder-name" placeholder="Ordnername" required>
        <button type="submit">Ordner erstellen</button>
      </form>
      <form id="add-category-form" style="display:none;">
        <h3>Kategorie hinzufügen:</h3>
        <input type="text" id="category-name" placeholder="Kategoriename" required>
        <button type="submit">Kategorie hinzufügen</button>
      </form>
      <form id="add-vocab-form" style="display:none;">
        <h3>Vokabeln hinzufügen:</h3>
        <input type="text" id="vocab-word" placeholder="Vokabel" required>
        <input type="text" id="vocab-translation" placeholder="Übersetzung" required>
        <button type="submit">Karteikarte hinzufügen</button>
      </form>
    `);

    const folderForm = document.getElementById("add-folder-form");
    const categoryForm = document.getElementById("add-category-form");
    const vocabForm = document.getElementById("add-vocab-form");

    folderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const folderName = document.getElementById("folder-name").value.trim();
      if (!folders.includes(folderName)) {
        folders.push(folderName);
        categories[folderName] = [];
        alert(`Ordner "${folderName}" erstellt!`);
        folderForm.style.display = "none";
        categoryForm.style.display = "block";
      } else {
        alert("Ordner existiert bereits.");
      }
    });

    categoryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const categoryName = document.getElementById("category-name").value.trim();
      const folderName = document.getElementById("folder-name").value.trim();

      if (!categories[folderName].includes(categoryName)) {
        categories[folderName].push(categoryName);
        alert(`Kategorie "${categoryName}" in Ordner "${folderName}" hinzugefügt!`);
        categoryForm.style.display = "none";
        vocabForm.style.display = "block";
      } else {
        alert("Kategorie existiert bereits.");
      }
    });

    vocabForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const vocabWord = document.getElementById("vocab-word").value.trim();
      const vocabTranslation = document.getElementById("vocab-translation").value.trim();
      const folderName = document.getElementById("folder-name").value.trim();
      const categoryName = document.getElementById("category-name").value.trim();

      vocabData.push({
        word: vocabWord,
        translation: vocabTranslation,
        folder: folderName,
        category: categoryName,
      });

      alert(`Vokabel "${vocabWord} - ${vocabTranslation}" hinzugefügt!`);
    });
  });

  // Event Listener: Lernen
  learnBtn.addEventListener("click", () => {
    updateContent("<h2>Wähle einen Ordner und eine Kategorie zum Lernen</h2>");
    displayLearningOptions();
  });

  // Funktionen

  function updateContent(content) {
    mainContent.innerHTML = content;
  }

  function displayVocabList() {
    const vocabList = document.getElementById("vocab-list");
    vocabList.innerHTML = "";
    vocabData.forEach((vocab) => {
      const vocabItem = document.createElement("li");
      vocabItem.textContent = `${vocab.word} - ${vocab.translation} (Ordner: ${vocab.folder}, Kategorie: ${vocab.category})`;
      vocabList.appendChild(vocabItem);
    });
  }

  function displayLearningOptions() {
    const content = document.createElement("div");
    content.id = "learning-options";

    folders.forEach((folder) => {
      const folderDiv = document.createElement("div");
      folderDiv.innerHTML = `<h3>${folder}</h3>`;
      categories[folder].forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.innerHTML = `
          <p>${category}</p>
          <button class="learn-btn" data-folder="${folder}" data-category="${category}" data-mode="write-answer">Schreiben</button>
          <button class="learn-btn" data-folder="${folder}" data-category="${category}" data-mode="multiple-choice">Auswählen</button>
          <button class="learn-btn" data-folder="${folder}" data-category="${category}" data-mode="true-false">Richtig oder Falsch</button>
        `;
        folderDiv.appendChild(categoryDiv);
      });
      content.appendChild(folderDiv);
    });

    mainContent.appendChild(content);

    document.querySelectorAll(".learn-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const folder = button.getAttribute("data-folder");
        const category = button.getAttribute("data-category");
        const mode = button.getAttribute("data-mode");

        if (mode === "write-answer") startWriting(folder, category);
        if (mode === "multiple-choice") startMultipleChoice(folder, category);
        if (mode === "true-false") startTrueFalse(folder, category);
      });
    });
  }

  function startWriting(folder, category) {
    const vocabInCategory = vocabData.filter(
      (vocab) => vocab.folder === folder && vocab.category === category
    );
    if (vocabInCategory.length === 0) {
      alert("Keine Vokabeln in dieser Kategorie!");
      return;
    }

    let currentIndex = 0;

    function showNext() {
      const vocab = vocabInCategory[currentIndex];
      updateContent(`
        <h2>Schreibe die Übersetzung:</h2>
        <p>Vokabel: <strong>${vocab.word}</strong></p>
        <input type="text" id="answer" placeholder="Übersetzung">
        <button id="check-answer">Überprüfen</button>
      `);

      document.getElementById("check-answer").addEventListener("click", () => {
        const userAnswer = document.getElementById("answer").value.trim();
        const isCorrect = userAnswer.toLowerCase() === vocab.translation.toLowerCase();
        alert(isCorrect ? "Richtig!" : `Falsch! Richtig wäre: ${vocab.translation}`);
        currentIndex++;
        if (currentIndex < vocabInCategory.length) showNext();
      });
    }
    showNext();
  }

  function startMultipleChoice(folder, category) { /* Implementieren */ }
  function startTrueFalse(folder, category) { /*
