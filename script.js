document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    
    // Navigation Buttons
    const allVocabBtn = document.getElementById("all-vocab-btn");
    const addBtn = document.getElementById("add-btn");
    const learnBtn = document.getElementById("learn-btn");
    const foldersBtn = document.getElementById("folders-btn");
    const categoriesBtn = document.getElementById("categories-btn");
  
    // Mock Data
    let folders = [];
    let categories = {};
  
    // Event Listener: Alle Vokabeln anzeigen
    allVocabBtn.addEventListener("click", () => {
      mainContent.innerHTML = `
        <h2>Alle Vokabeln</h2>
        <p>Hier erscheinen die Vokabelkarten sortiert nach Kategorien.</p>
      `;
    });
  
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
        } else {
          alert("Ordner existiert bereits.");
        }
  
        // Nächster Schritt: Kategorie auswählen
        chooseCategory(folderName);
      });
    });
  
    function chooseCategory(folderName) {
      mainContent.innerHTML = `
        <h2>Kategorie für den Ordner "${folderName}" hinzufügen</h2>
        <form id="add-category-form">
          <input type="text" id="category-name" placeholder="Kategoriename" required>
          <button type="submit">Kategorie erstellen</button>
        </form>
      `;
  
      const categoryForm = document.getElementById("add-category-form");
      categoryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const categoryName = document.getElementById("category-name").value.trim();
  
        if (!categories[folderName].includes(categoryName)) {
          categories[folderName].push(categoryName);
          alert(`Kategorie "${categoryName}" in Ordner "${folderName}" erstellt!`);
        } else {
          alert("Kategorie existiert bereits.");
        }
  
        // Nächster Schritt: Karteikarte hinzufügen
        addFlashcard(folderName, categoryName);
      });
    }
  
    function addFlashcard(folderName, categoryName) {
      mainContent.innerHTML = `
        <h2>Neue Karteikarte hinzufügen</h2>
        <p>Ordner: ${folderName}, Kategorie: ${categoryName}</p>
        <form id="add-flashcard-form">
          <input type="text" id="vocab-word" placeholder="Vokabel" required>
          <input type="text" id="vocab-translation" placeholder="Übersetzung" required>
          <button type="submit">Karteikarte erstellen</button>
        </form>
      `;
  
      const flashcardForm = document.getElementById("add-flashcard-form");
      flashcardForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const vocabWord = document.getElementById("vocab-word").value.trim();
        const vocabTranslation = document.getElementById("vocab-translation").value.trim();
  
        alert(`Karteikarte "${vocabWord} - ${vocabTranslation}" hinzugefügt!`);
        // Wieder zur Startseite zurückkehren
        mainContent.innerHTML = `<h2>Vokabelkarte erfolgreich erstellt!</h2>`;
      });
    }
  
    // Event Listener: Lernen
    learnBtn.addEventListener("click", () => {
      mainContent.innerHTML = `
        <h2>Lernen</h2>
        <div class="learn-modes">
          <button class="learn-button" id="correct-or-wrong">Falsch oder Richtig</button>
          <button class="learn-button" id="multiple-choice">Auswählen</button>
          <button class="learn-button" id="write-answer">Schreiben</button>
        </div>
      `;
  
      document.getElementById("correct-or-wrong").addEventListener("click", () => {
        mainContent.innerHTML = `
          <h2>Falsch oder Richtig</h2>
          <p>Hier kommt der Lernmodus "Falsch oder Richtig".</p>
        `;
      });
  
      document.getElementById("multiple-choice").addEventListener("click", () => {
        mainContent.innerHTML = `
          <h2>Auswählen</h2>
          <p>Hier kommt der Lernmodus "Auswählen".</p>
        `;
      });
  
      document.getElementById("write-answer").addEventListener("click", () => {
        mainContent.innerHTML = `
          <h2>Schreiben</h2>
          <p>Hier kommt der Lernmodus "Schreiben".</p>
        `;
      });
    });
  });
  