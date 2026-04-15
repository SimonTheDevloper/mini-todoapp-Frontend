import { handlelogoutUser } from "./login/userServices.js";
import { renderAllTodos, updateEmptyStates } from "./todos/todoManager.js";
import { fetchAllTodos, handleDeleteAllTasks, localTodos, postTodo, updateLocalTodos } from "./todos/todoService.js";
const THEMES = [
    { id: "light", label: "Light", icon: "fa-sun", },
    { id: "dark", label: "Dark", icon: "fa-moon" },
    { id: "cyberpunk", label: "Cyberpunk", icon: "fa-robot" },
    { id: "meadow", label: "Meadow", icon: "fa-seedling" },
    { id: "silk", label: "Silk", icon: "fa-disease" },
    { id: "coffee", label: "Coffee", icon: "fa-mug-saucer" },
    { id: "lavendel", label: "Lavender", icon: "fa-spa" },
];

let currentTheme = (localStorage.getItem("theme") || "light").toLowerCase();
applyTheme(currentTheme);

function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Nur rendern, wenn das Grid überhaupt da ist (Modal offen)
    const grid = document.getElementById("themeGrid");
    if (grid) renderThemeGrid();
}

function renderThemeGrid() {
    const grid = document.getElementById("themeGrid");
    if (!grid) return;
    if (grid.children.length === 0) {
        THEMES.forEach((theme) => {
            const card = document.createElement("button");
            card.setAttribute("data-theme-id", theme.id);
            card.addEventListener("click", () => applyTheme(theme.id));
            grid.appendChild(card);
        });
    }
    Array.from(grid.children).forEach((card) => {
        const themeId = card.getAttribute("data-theme-id");
        const themeData = THEMES.find(item => item.id === themeId);
        const isActive = themeData.id === currentTheme;

        let activeColorClass = "text-white";
        if (currentTheme === 'light') {
            activeColorClass = "text-primary";
        }
        card.className = `relative flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-300
            ${isActive
                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                : "border-base-300 hover:border-primary/50 hover:bg-base-200"
            }`;
        card.innerHTML = `
            <div class="flex gap-1 shrink-0">
                <i class="fa-solid ${themeData.icon} ${isActive ? activeColorClass : 'text-base-content/60'} transition-colors duration-300"></i>
            </div>
            <span class="text-sm font-medium ${isActive ? activeColorClass : 'text-base-content'}">${themeData.label}</span>
            ${isActive ? `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ${activeColorClass} ml-auto shrink-0 animate-in fade-in zoom-in duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>` : ''}
        `;
    });
}

const settingsModal = document.getElementById("settingsModal");
const settingsPanel = document.getElementById("settingsPanel");

function openSettings() {
    settingsModal.classList.remove("hidden");
    renderThemeGrid();
    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            settingsPanel.classList.remove("scale-95", "opacity-0");
            settingsPanel.classList.add("scale-100", "opacity-100");
        });
    });
}

function closeSettings() {
    settingsPanel.classList.remove("scale-100", "opacity-100");
    settingsPanel.classList.add("scale-95", "opacity-0");
    setTimeout(() => settingsModal.classList.add("hidden"), 200);
}

document.getElementById("openSettings").addEventListener("click", openSettings);
document
    .getElementById("closeSettings")
    .addEventListener("click", closeSettings);
document
    .getElementById("closeSettingsFooter")
    .addEventListener("click", closeSettings);

settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) closeSettings();
});

document.addEventListener("keydown", (e) => {
    // damit es sich mit escape schließen lässt
    if (e.key === "Escape" && !settingsModal.classList.contains("hidden"))
        closeSettings();
});

document.querySelectorAll(".settings-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".settings-tab").forEach((b) => {
            b.classList.remove("border-primary", "text-primary", "font-semibold");
            b.classList.add(
                "border-transparent",
                "text-base-content/50",
                "font-medium",
            );
        });
        btn.classList.add("border-primary", "text-primary", "font-semibold");
        btn.classList.remove(
            "border-transparent",
            "text-base-content/50",
            "font-medium",
        );

        document
            .querySelectorAll(".settings-tab-content")
            .forEach((c) => c.classList.add("hidden"));
        document
            .getElementById("tab-" + btn.dataset.tab)
            .classList.remove("hidden");
    });
});

const fontRange = document.getElementById("fontSizeRange");
const fontLabel = document.getElementById("fontSizeLabel");
const savedFontSize = localStorage.getItem("fontSize") || "16";
fontRange.value = savedFontSize;
fontLabel.textContent = savedFontSize + " px";
document.documentElement.style.fontSize = savedFontSize + "px";

fontRange.addEventListener("input", () => {
    const val = fontRange.value;
    fontLabel.textContent = val + " px";
    document.documentElement.style.fontSize = val + "px";
    localStorage.setItem("fontSize", val);
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    const message = "Are you sure you want to log out?\n" +
        "(Your data will be retained after you log out)";

    if (confirm(message)) {
        handlelogoutUser();
    }
});
// export todos
document.getElementById('exportJsonBtn').addEventListener('click', () => {
    const openTodos = localTodos.filter(t => t.completed === false)
    const exportData = openTodos.map(t => ({ text: t.text }))
    const prettyData = JSON.stringify(exportData, null, 2) //damit schöne einrückungen entstehen
    const blob = new Blob([prettyData], { type: "application/json" }); // erstellung einer Virtuellen Datei

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickivo-todos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url) // damit der Speicher wieder freigegeben wird.
});
// import todos
document.getElementById('importJsonInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const importLoader = document.getElementById('importLoader');
    importLoader.classList.remove('hidden');


    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const importedData = JSON.parse(event.target.result);
            for (const item of importedData) {
                if (item.text && typeof item.text === 'string') {
                    await postTodo(item.text);
                }
            }
            await fetchAllTodos();
            renderAllTodos();       // mit Argumenten über die exportierte Funktion
            updateEmptyStates();
            closeSettings();
        } catch (err) {
            console.error("Format fehlerhaft", err);
            alert("Import failed: invalid format.");
        } finally {
            importLoader.classList.add('hidden');
            e.target.value = ""; // Input zurücksetzen, damit dieselbe Datei nochmal importierbar ist
        }
    };
    reader.readAsText(file);
});

// Clear Data
document.getElementById('clearAllTodosBtn').addEventListener('click', async () => {
    const random4Digit = Math.floor(1000 + Math.random() * 9000);
    if (!confirm('Delete all todos? This cannot be undone.')) return

    const userInput = prompt(`Type this number to continue: ${random4Digit}`)
    if (userInput === String(random4Digit)) {
        console.log("Deleting todos");
        try {
            await handleDeleteAllTasks();
            renderAllTodos();
            updateEmptyStates();
        } catch (error) {
            console.error("Deletion failed:", error.message);
        }

    }
    else {
        alert("Incorrect number entered. Operation canceled.")
    }
})
document.getElementById("deleteAccountBtn").addEventListener("click", async () => {
    if (!confirm("Delete your account and ALL data permanently? This cannot be undone.")) return;

    const userInput = prompt('Type "DELETE" to confirm account deletion:');
    if (userInput !== "DELETE") {
        alert("Account deletion cancelled.");
        return;
    }

    try {
        const res = await fetch("/api/user", {
            method: "DELETE",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Server error");

        // Nach erfolgreichem Löschen ausloggen / zur Login-Seite
        localStorage.clear();
        window.location.href = "/login";
    } catch (err) {
        console.error("Fehler beim Löschen des Accounts:", err);
        alert("Could not delete account. Please try again.");
    }
});