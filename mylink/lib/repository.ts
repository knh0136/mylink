import { parseLibrary, type Library } from "@/lib/model";

export const STORAGE_KEY = "mylink:library:v1";

// Keep persistence separate from the UI so Firebase can replace it later.
export const libraryRepository = {
  load(): Library | null {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const data = parseLibrary(JSON.parse(raw));
    if (!data) throw new Error("Invalid saved library");
    return data;
  },
  save(data: Library) {
    const checked = parseLibrary(data);
    if (!checked) throw new Error("Invalid library");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  },
};
