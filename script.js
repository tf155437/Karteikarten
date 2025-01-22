document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");

  // Navigation Buttons
  const allVocabBtn = document.getElementById("all-vocab-btn");
  const addBtn = document.getElementById("add-btn");
  const learnBtn = document.getElementById("learn-btn");
  const foldersBtn = document.getElementById("folders-btn");
  const deleteBtn = document.getElementById("delete-btn");

  // Datenstrukturen
  let folders = JSON.parse(localStorage.getItem("folders")) || [];
  let categories = JSON.parse(localStorage.getItem("categories")) || {};
  let vocabData = JSON.parse(localStorage.getItem("vocabData")) || [];

  // Helper: Daten speichern
  function saveData() {
    localStorage.setItem("folders", JSON.stringify(folders));
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("vocabData", JSON.stringify(vocabData));
  }

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
      <h2>Neuen Ordner, Kategorien und Vokabeln hinzufügen</h2>
      <form id="add-folder-form">
        <h3>Ordner erstellen:</h3>
        <input type="text" id="folder-name" placeholder="Ordnername" required>
        <button type="submit" class="btn-add">Ordner erstellen</button>
      </form>
      <form id="add-category-form" style="display:none;">
        <h3>Kategorie hinzufügen:</h3>
        <input type="text" id="category-name" placeholder="Kategoriename" required>
        <button type="submit" class="btn-add">Kategorie hinzufügen</button>
        <button type="button" id="add-more-categories" class="btn-add">Weitere Kategorien hinzufügen</button>
      </form>
      <form id="add-vocab-form" style="display:none;">
        <h3>Vokabeln hinzufügen:</h3>
        <div id="vocab-list-inputs">
          <div class="vocab-input">
            <input type="text" class="vocab-word" placeholder="Vokabel" required>
            <input type="text" class="vocab-translation" placeholder="Übersetzung" required>
          </div>
        </div>
        <button type="submit" class="btn-add">Vokabeln hinzufügen</button>
        <button type="button" id="add-more-vocab" class="btn-add">Weitere Vokabeln hinzufügen</button>
      </form>
      <button id="add-vocab-btn" class="btn-add" style="display:none;">Vokabeln erstellen</button>
    `);

    const folderForm = document.getElementById("add-folder-form");
    const categoryForm = document.getElementById("add-category-form");
    const vocabForm = document.getElementById("add-vocab-form");
    const addVocabBtn = document.getElementById("add-vocab-btn");

    folderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const folderName = document.getElementById("folder-name").value.trim();
      if (!folders.includes(folderName)) {
        folders.push(folderName);
        categories[folderName] = [];
        saveData();
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
        saveData();
        alert(`Kategorie "${categoryName}" in Ordner "${folderName}" hinzugefügt!`);
        categoryForm.style.display = "none";
        addVocabBtn.style.display = "block";
      } else {
        alert("Kategorie existiert bereits.");
      }
    });

    document.getElementById("add-more-categories").addEventListener("click", () => {
      categoryForm.reset();
    });

    addVocabBtn.addEventListener("click", () => {
      vocabForm.style.display = "block";
    });

    vocabForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const folderName = document.getElementById("folder-name").value.trim();
      const categoryName = document.getElementById("category-name").value.trim();

      const vocabInputs = document.querySelectorAll(".vocab-input");
      vocabInputs.forEach((input) => {
        const vocabWord = input.querySelector(".vocab-word").value.trim();
        const vocabTranslation = input.querySelector(".vocab-translation").value.trim();

        if (vocabWord && vocabTranslation) {
          vocabData.push({
            word: vocabWord,
            translation: vocabTranslation,
            folder: folderName,
            category: categoryName,
          });
        }
      });

      saveData();
      alert(`Vokabeln hinzugefügt!`);
      vocabForm.reset();
      vocabForm.style.display = "none";
    });

    document.getElementById("add-more-vocab").addEventListener("click", () => {
      const vocabListInputs = document.getElementById("vocab-list-inputs");
      const vocabInput = document.createElement("div");
      vocabInput.classList.add("vocab-input");
      vocabInput.innerHTML = `
        <input type="text" class="vocab-word" placeholder="Vokabel" required>
        <input type="text" class="vocab-translation" placeholder="Übersetzung" required>
      `;
      vocabListInputs.appendChild(vocabInput);
    });
  });

  // Event Listener: Ordner anzeigen
  foldersBtn.addEventListener("click", () => {
    updateContent(`
      <h2>Alle Ordner und Kategorien</h2>
      <div id="folder-container"></div>
    `);
    displayFoldersAndCategories();
  });

  // Event Listener: Lernmodi starten
  learnBtn.addEventListener("click", () => {
    updateContent(`
      <h2>Wähle einen Lernmodus</h2>
      <button id="true-false-btn" class="btn-learn">Richtig/Falsch</button>
    `);

    document.getElementById("true-false-btn").addEventListener("click", () => {
      const folder = prompt("Ordnername:");
      const category = prompt("Kategoriename:");
      startTrueFalse(folder, category);
    });
  });

  // Event Listener: Löschen
  deleteBtn.addEventListener("click", () => {
    updateContent(`
      <h2>Element löschen</h2>
      <form id="delete-form">
        <label for="delete-type">Was möchtest du löschen?</label>
        <select id="delete-type">
          <option value="folder">Ordner</option>
          <option value="category">Kategorie</option>
          <option value="vocab">Vokabel</option>
        </select>
  
        <div id="delete-folder" class="delete-section" style="display:none;">
          <label for="folder-name-delete">Ordnername:</label>
          <input type="text" id="folder-name-delete" placeholder="Ordnername">
        </div>
  
        <div id="delete-category" class="delete-section" style="display:none;">
          <label for="folder-name-cat-delete">Ordnername:</label>
          <input type="text" id="folder-name-cat-delete" placeholder="Ordnername">
          <label for="category-name-delete">Kategoriename:</label>
          <input type="text" id="category-name-delete" placeholder="Kategoriename">
        </div>
  
        <div id="delete-vocab" class="delete-section" style="display:none;">
          <label for="folder-name-vocab-delete">Ordnername:</label>
          <input type="text" id="folder-name-vocab-delete" placeholder="Ordnername">
          <label for="category-name-vocab-delete">Kategoriename:</label>
          <input type="text" id="category-name-vocab-delete" placeholder="Kategoriename">
          <label for="vocab-name-delete">Vokabelname:</label>
          <input type="text" id="vocab-name-delete" placeholder="Vokabelname">
        </div>
  
        <button type="submit" class="btn-delete">Löschen</button>
      </form>
    `);

    const deleteType = document.getElementById("delete-type");
    const deleteFolder = document.getElementById("delete-folder");
    const deleteCategory = document.getElementById("delete-category");
    const deleteVocab = document.getElementById("delete-vocab");

    deleteType.addEventListener("change", () => {
      const deleteTypeValue = deleteType.value;
      if (deleteTypeValue === "folder") {
        deleteFolder.style.display = "block";
        deleteCategory.style.display = "none";
        deleteVocab.style.display = "none";
      } else if (deleteTypeValue === "category") {
        deleteFolder.style.display = "none";
        deleteCategory.style.display = "block";
        deleteVocab.style.display = "none";
      } else {
        deleteFolder.style.display = "none";
        deleteCategory.style.display = "none";
        deleteVocab.style.display = "block";
      }
    });

    // Löschen-Button
    document.getElementById("delete-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const deleteTypeValue = deleteType.value;
      if (deleteTypeValue === "folder") {
        const folderName = document.getElementById("folder-name-delete").value.trim();
        if (folders.includes(folderName)) {
          folders = folders.filter((folder) => folder !== folderName);
          delete categories[folderName];
          vocabData = vocabData.filter((vocab) => vocab.folder !== folderName);
          saveData();
          alert(`Ordner "${folderName}" gelöscht!`);
        } else {
          alert("Ordner nicht gefunden.");
        }
      } else if (deleteTypeValue === "category") {
        const folderName = document.getElementById("folder-name-cat-delete").value.trim();
        const categoryName = document.getElementById("category-name-delete").value.trim();
        if (categories[folderName] && categories[folderName].includes(categoryName)) {
          categories[folderName] = categories[folderName].filter((category) => category !== categoryName);
          vocabData = vocabData.filter((vocab) => vocab.folder !== folderName || vocab.category !== categoryName);
          saveData();
          alert(`Kategorie "${categoryName}" gelöscht!`);
        } else {
          alert("Kategorie nicht gefunden.");
        }
      } else {
        const folderName = document.getElementById("folder-name-vocab-delete").value.trim();
        const categoryName = document.getElementById("category-name-vocab-delete").value.trim();
        const vocabName = document.getElementById("vocab-name-delete").value.trim();
        const vocabIndex = vocabData.findIndex((vocab) => vocab.word === vocabName && vocab.folder === folderName && vocab.category === categoryName);
        if (vocabIndex !== -1) {
          vocabData.splice(vocabIndex, 1);
          saveData();
          alert(`Vokabel "${vocabName}" gelöscht!`);
        } else {
          alert("Vokabel nicht gefunden.");
        }
      }
    });
  });

  // Helper: Content aktualisieren
  function updateContent(content) {
    mainContent.innerHTML = content;
  }

  // Helper: Vokabeln anzeigen
  function displayVocabList() {
    const vocabList = document.getElementById("vocab-list");
    vocabList.innerHTML = "";
    vocabData.forEach((vocab) => {
      const vocabItem = document.createElement("li");
      vocabItem.textContent = `${vocab.word} - ${vocab.translation}`;
      vocabList.appendChild(vocabItem);
    });
  }

  // Helper: Ordner und Kategorien anzeigen
  function displayFoldersAndCategories() {
    const folderContainer = document.getElementById("folder-container");
    folderContainer.innerHTML = "";
    folders.forEach((folder) => {
      const folderDiv = document.createElement("div");
      folderDiv.innerHTML = `<strong>${folder}</strong>: ${categories[folder].join(", ")}`;
      folderContainer.appendChild(folderDiv);
    });
  }

  // Lernmodus starten (Richtig/Falsch)
  function startTrueFalse(folder, category) {
    const vocabList = vocabData.filter(vocab => vocab.folder === folder && vocab.category === category);
    let currentVocabIndex = 0;

    function showNextVocab() {
      if (currentVocabIndex < vocabList.length) {
        const vocab = vocabList[currentVocabIndex];
        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = `
          <h3>${vocab.word}</h3>
          <button class="answer-btn" data-answer="${vocab.translation}">Antwort 1: ${vocab.translation}</button>
          <button class="answer-btn" data-answer="${vocab.translation === "Antwort 1" ? "Antwort 2" : "Antwort 1"}">Antwort 2: ${(vocab.translation === "Antwort 1" ? "Antwort 2" : "Antwort 1")}</button>
        `;
        mainContent.appendChild(questionDiv);

        document.querySelectorAll(".answer-btn").forEach((button) => {
          button.addEventListener("click", (e) => {
            const correctAnswer = vocab.translation;
            const selectedAnswer = e.target.dataset.answer;
            const feedback = document.createElement("span");
            feedback.textContent = selectedAnswer === correctAnswer ? "✔️ Richtig!" : "❌ Falsch!";
            feedback.style.color = selectedAnswer === correctAnswer ? "green" : "red";
            questionDiv.appendChild(feedback);
            currentVocabIndex++;
            setTimeout(() => {
              questionDiv.remove();
              showNextVocab();
            }, 2000);
          });
        });
      } else {
        alert("Lernsession beendet!");
      }
    }

    showNextVocab();
  }
});