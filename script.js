// Beispiel-Daten für die Ordner und Kategorien
const folders = [
    {
        name: "Economics",
        categories: [
            { name: "Recession", cards: [{ question: "Abwertung", answer: "devaluation", stage: 1 }] },
            { name: "Stock Markets", cards: [{ question: "Anleger", answer: "investors", stage: 1 }] }
        ]
    },
    {
        name: "Mathematik",
        categories: [
            { name: "Algebra", cards: [{ question: "Was ist 2+2?", answer: "4", stage: 1 }] }
        ]
    }
];

// Lädt die Hauptordner in die Seitenleiste
function loadFolders() {
    const folderContainer = document.getElementById("folders");
    folderContainer.innerHTML = "";
    folders.forEach((folder, index) => {
        const folderItem = document.createElement("li");
        folderItem.textContent = folder.name;
        folderItem.onclick = () => loadCategories(index);
        folderContainer.appendChild(folderItem);
    });
}

// Lädt die Kategorien und Karten für einen ausgewählten Hauptordner
function loadCategories(folderIndex) {
    const categoriesContainer = document.getElementById("categories-container");
    categoriesContainer.innerHTML = "";

    const folder = folders[folderIndex];
    document.getElementById("category-title").textContent = folder.name;

    folder.categories.forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category";
        const categoryHeader = document.createElement("h3");
        categoryHeader.textContent = category.name;
        categoryDiv.appendChild(categoryHeader);

        const cardGrid = document.createElement("div");
        cardGrid.className = "card-grid";

        // Karten in einer grid-basierten Ansicht anzeigen
        category.cards.forEach(card => {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card";
            cardDiv.innerHTML = `<strong>${card.question}</strong><br><em>${card.answer}</em>`;
            cardGrid.appendChild(cardDiv);
        });

        categoryDiv.appendChild(cardGrid);
        categoriesContainer.appendChild(categoryDiv);
    });
}

// Event für den Lernbutton
document.getElementById("learn-button").addEventListener("click", () => {
    alert("Lernmodus starten!");
});

// Initialisiert die Ordneranzeige beim Laden der Seite
loadFolders();