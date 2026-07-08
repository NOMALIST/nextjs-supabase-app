function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateEventSlug(title: string): string {
  const base = slugify(title) || "event";
  const suffix = crypto.randomUUID().slice(0, 8);
  return `${base}-${suffix}`;
}
