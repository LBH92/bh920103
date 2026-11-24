export function dedupeByKey<T>(
  items: T[],
  getKey: (item: T) => string | undefined | null
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (!item) continue;
    const key = getKey(item);
    if (key !== undefined && key !== null && key !== '') {
      if (seen.has(key)) continue;
      seen.add(key);
    }
    result.push(item);
  }
  return result;
}

export function dedupeById<T extends { id?: string }>(items: T[]): T[] {
  return dedupeByKey(items, item => item?.id);
}
