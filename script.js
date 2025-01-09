document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");
 
  // Navigation Buttons
  const allVocabBtn = document.getElementById("all-vocab-btn");
  const addBtn = document.getElementById("add-btn");
  const learnBtn = document.getElementById("learn-btn");
  const foldersBtn = document.getElementById("folders-btn");
 
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
      saveData();
      alert(`Vokabel "${vocabWord} - ${vocabTranslation}" hinzugefügt!`);
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
<button id="multiple-choice-btn">Multiple Choice</button>
<button id="true-false-btn">Richtig/Falsch</button>
    `);

    document.getElementById("multiple-choice-btn").addEventListener("click", () => {
      const folder = prompt("Ordnername:");
      const category = prompt("Kategoriename:");
      startMultipleChoice(folder, category);
    });

    document.getElementById("true-false-btn").addEventListener("click", () => {
      const folder = prompt("Ordnername:");
      const category = prompt("Kategoriename:");
      startTrueFalse(folder, category);
    });
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
 
  function displayFoldersAndCategories() {
    const folderContainer = document.getElementById("folder-container");
 
    if (folders.length === 0) {
      folderContainer.innerHTML = "<p>Es wurden noch keine Ordner erstellt.</p>";
      return;
    }
 
    folders.forEach((folder) => {
      const folderDiv = document.createElement("div");
      folderDiv.innerHTML = `<h3>${folder}</h3>`;
 
      if (categories[folder] && categories[folder].length > 0) {
        categories[folder].forEach((category) => {
          const categoryDiv = document.createElement("div");
          categoryDiv.innerHTML = `<h4>${category}</h4>`;
          const vocabList = vocabData.filter(
            (vocab) => vocab.folder === folder && vocab.category === category
          );
 
          if (vocabList.length > 0) {
            const vocabUl = document.createElement("ul");
            vocabList.forEach((vocab) => {
              const vocabLi = document.createElement("li");
              vocabLi.textContent = `${vocab.word} - ${vocab.translation}`;
              vocabUl.appendChild(vocabLi);
            });
            categoryDiv.appendChild(vocabUl);
          } else {
            categoryDiv.innerHTML += "<p>Keine Vokabeln in dieser Kategorie.</p>";
          }
 
          folderDiv.appendChild(categoryDiv);
        });
      } else {
        folderDiv.innerHTML += "<p>Keine Kategorien in diesem Ordner.</p>";
      }
 
      folderContainer.appendChild(folderDiv);
    });
  }

  // Multiple Choice Quiz
  function startMultipleChoice(folder, category) {
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
      const correctAnswer = vocab.translation;
  
      let randomOption;
      if (!isNaN(correctAnswer)) {
        randomOption = (Math.floor(Math.random() * 100)).toString();
      } else {
        randomOption = vocabData[Math.floor(Math.random() * vocabData.length)].translation;
      }
  
      const choices = [correctAnswer, randomOption].sort(() => Math.random() - 0.5);
  
      updateContent(`
  <h2>Wähle die richtige Antwort:</h2>
  <p>Vokabel: <strong>${vocab.word}</strong></p>
        ${choices
          .map(
            (choice) => `<button class="choice-btn" data-answer="${choice}">${choice}</button>`
          )
          .join("")}
      `);
  
      document.querySelectorAll(".choice-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const selectedAnswer = button.getAttribute("data-answer");
          const isCorrect = selectedAnswer === correctAnswer;
          alert(isCorrect ? "Richtig!" : `Falsch! Richtig wäre: ${correctAnswer}`);
          currentIndex++;
          if (currentIndex < vocabInCategory.length) {
            showNext();
          } else {
            alert("Du hast alle Vokabeln abgeschlossen!");
            displayLearningOptions();
          }
        });
      });
    }
  
    showNext();
  }

  // True/False Quiz
  function startTrueFalse(folder, category) {
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
      const showCorrect = Math.random() > 0.5;
      const displayedAnswer = showCorrect
        ? vocab.translation
        : vocabData[Math.floor(Math.random() * vocabData.length)].translation;
  
      updateContent(`
  <h2>Ist das richtig oder falsch?</h2>
  <p>Vokabel: <strong>${vocab.word}</strong></p>
  <p>Übersetzung: <strong>${displayedAnswer}</strong></p>
  <button id="true-btn">Richtig</button>
  <button id="false-btn">Falsch</button>
      `);
  
      document.getElementById("true-btn").addEventListener("click", () => {
        alert(showCorrect ? "Super!" : "Schade!");
        currentIndex++;
        if (currentIndex < vocabInCategory.length) {
          showNext();
        } else {
          alert("Du hast alle Vokabeln abgeschlossen!");
          displayLearningOptions();
        }
      });
  
      document.getElementById("false-btn").addEventListener("click", () => {
        alert(!showCorrect ? "Super!" : "Schade!");
        currentIndex++;
        if (currentIndex < vocabInCategory.length) {
          showNext();
        } else {
          alert("Du hast alle Vokabeln abgeschlossen!");
          displayLearningOptions();
        }
      });
    }
  
    showNext();
  }
});
