export type Profile = { name: string; initials: string; bio: string };
export type MyLink = { id: string; title: string; url: string };
export type Library = { version: 1; profile: Profile; links: MyLink[] };

export function normalizeUrl(input: string): string | null {
  const value = input.trim();
  if (!value || value.length > 2048 || /\s/.test(value)) return null;
  // Explicitly permit only web links, including when reading browser storage.
  if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

function isText(value: unknown, max: number, required = true): value is string {
  return typeof value === 'string' && value.length <= max && (!required || value.trim().length > 0);
}

export function parseLibrary(value: unknown): Library | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Partial<Library>;
  if (data.version !== 1 || !data.profile || !Array.isArray(data.links) || data.links.length > 100) return null;
  const profile = data.profile;
  if (!isText(profile.name, 40) || !isText(profile.initials, 5) || !isText(profile.bio, 160, false)) return null;
  const seen = new Set<string>();
  const links: MyLink[] = [];
  for (const link of data.links) {
    if (!link || !isText(link.id, 100) || seen.has(link.id) || !isText(link.title, 60) || !isText(link.url, 2048)) return null;
    const url = normalizeUrl(link.url);
    if (!url) return null;
    seen.add(link.id);
    links.push({ id: link.id, title: link.title, url });
  }
  return { version: 1, profile: { name: profile.name, initials: profile.initials, bio: profile.bio }, links };
}

export function linkHost(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return ''; }
}
