document.addEventListener("DOMContentLoaded", () => {
  const range = new URLSearchParams(window.location.search).get("lines");
  if (!range) return;

  const [startText, endText] = range.split("-");
  const start = Number.parseInt(startText, 10);
  const end = Number.parseInt(endText || startText, 10);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return;

  for (let line = Math.min(start, end); line <= Math.max(start, end); line += 1) {
    document.getElementById(`mod-file-L${line}`)?.classList.add("cmp-src-line-selected");
  }

  document.getElementById(`mod-file-L${start}`)?.scrollIntoView({ block: "center" });
});
