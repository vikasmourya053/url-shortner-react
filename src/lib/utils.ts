export function saveRecentLink(link: string) {
  try {
    const key = "recent-links";
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    const updated = [link, ...existing.filter((l) => l !== link)].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {}
}

export function getRecentLinks(): string[] {
  try {
    return JSON.parse(localStorage.getItem("recent-links") || "[]");
  } catch {
    return [];
  }
}


