const themeStorageKey = "libreria-theme";
const root = document.documentElement;

function readSavedTheme() {
  try {
    const savedTheme = localStorage.getItem(themeStorageKey);
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
  } catch {
    return "light";
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // The theme still works for this visit when storage is unavailable.
  }
}

const themeToggle = document.createElement("button");
themeToggle.className = "theme-toggle";
themeToggle.type = "button";
themeToggle.setAttribute("aria-pressed", "false");
themeToggle.innerHTML = `
  <span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
  </span>
  <span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M20.4 15.2A8.6 8.6 0 0 1 8.8 3.6 8.8 8.8 0 1 0 20.4 15.2Z" /></svg>
  </span>
`;

function applyTheme(theme) {
  const isDark = theme === "dark";
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
  themeToggle.title = isDark ? "Activar modo claro" : "Activar modo oscuro";
}

applyTheme(readSavedTheme());
document.body.append(themeToggle);

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  saveTheme(nextTheme);
});
