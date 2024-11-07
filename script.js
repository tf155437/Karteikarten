let folders = [];
let currentFolder = null;
let currentStage = 1;

function addFolder() {
    const folderName = prompt("Name des neuen Hauptordners:");
    if (folderName) {
        folders.push({ name: folderName, categories: [] });
        renderFolders();
    }
}

function addCategory() {
    if (!currentFolder) {
        alert("Bitte wählen Sie einen Hauptordner aus.");
        return;
    }
    const categoryName = prompt("Name der neuen Kategorie:");
    if (categoryName) {
        currentFolder.categories.push({ name: categoryName, stage: 1, cards: [] });
        renderStages();
    }
}

function renderFolders() {
    const folderList = document.getElementById("folders");
    folderList.innerHTML = "";
    folders.forEach((folder, index) => {
        const folderItem = document.createElement("li");
        folderItem.textContent = folder.name;
        folderItem.onclick = () => selectFolder(index);
        folderList.appendChild(folderItem);
    });
}

function selectFolder(index) {
    currentFolder = folders[index];
    renderStages();
}

function renderStages() {
    const stagesContainer = document.getElementById("stages");
    stagesContainer.innerHTML = "";
    
    if (!currentFolder) return;
    
    for (let i = 1; i <= 3; i++) {
        const stageDiv = document.createElement("div");
        stageDiv.className = "stage";
        
        const stageTitle = document.createElement("h3");
        stageTitle.textContent = `Stufe ${i}`;
        stageDiv.appendChild(stageTitle);

        currentFolder.categories.forEach(category => {
            if (category.stage === i) {
                const cardDiv = document.createElement("div");
                cardDiv.className = "card";
                const title = document.createElement("div");
                title.className = "card-title";
                title.textContent = category.name;
                const solution = document.createElement("div");
                solution.className = "card-solution";
                solution.textContent = "Lösung anzeigen";
                cardDiv.appendChild(title);
                cardDiv.appendChild(solution);
                stageDiv.appendChild(cardDiv);
            }
        });
        stagesContainer.appendChild(stageDiv);
    }
}

function startLearning() {
    if (!currentFolder) {
        alert("Bitte wählen Sie einen Hauptordner zum Lernen.");
        return;
    }
    alert("Lernen beginnt... (diese Funktion muss noch implementiert werden)");
}

renderFolders();