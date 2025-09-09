export function generateSlug(title: string, date: string): string {
  const dateFormatted = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `${dateFormatted}-${titleSlug}`;
}

export function createUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  
  return uniqueSlug;
}

export function getCanonicalUrl(slug: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/devotional/${slug}`;
}