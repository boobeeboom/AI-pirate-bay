const completionStorageKey = "ai-native-code-completion-v1";

function readCompletion() {
  try {
    const value = JSON.parse(localStorage.getItem(completionStorageKey) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let completion = readCompletion();
  const checkboxes = [...document.querySelectorAll("[data-completion-route]")];

  function renderCompletion() {
    let currentMarked = false;
    for (const checkbox of checkboxes) {
      const completed = completion[checkbox.dataset.completionRoute] === true;
      checkbox.checked = completed;
      const row = checkbox.closest(".cmp-index-item");
      const label = checkbox.closest("label");
      const title = row.querySelector(".cmp-index-title").textContent;
      checkbox.setAttribute("aria-label", `${completed ? "Mark incomplete" : "Mark complete"}: ${title}`);
      label.lastChild.textContent = completed ? " Completed" : " Mark complete";
      row.removeAttribute("aria-current");
      if (!completed && !currentMarked) {
        row.setAttribute("aria-current", "step");
        currentMarked = true;
      }
    }
  }

  for (const checkbox of checkboxes) {
    checkbox.addEventListener("change", () => {
      completion = { ...readCompletion(), ...completion, [checkbox.dataset.completionRoute]: checkbox.checked };
      try {
        localStorage.setItem(completionStorageKey, JSON.stringify(completion));
      } catch {
        // Keep the current page usable when browser storage is unavailable.
      }
      renderCompletion();
    });
  }
  window.addEventListener("storage", (event) => {
    if (event.key === completionStorageKey || event.key === null) {
      completion = readCompletion();
      renderCompletion();
    }
  });
  renderCompletion();

  const range = new URLSearchParams(window.location.search).get("lines");
  if (!range || !/^\d+(?:-\d+)?$/.test(range)) return;
  const [startText, endText = startText] = range.split("-");
  const start = Number(startText);
  const end = Number(endText);
  const count = document.querySelectorAll(".cmp-src-line").length;
  for (let line = Math.max(1, Math.min(start, end)); line <= Math.min(count, Math.max(start, end)); line += 1) {
    document.getElementById(`mod-file-L${line}`)?.classList.add("cmp-src-line-selected");
  }
  document.getElementById(`mod-file-L${start}`)?.scrollIntoView({ block: "center" });
});
