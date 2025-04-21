/**
 * Generates a stable key for items in a list based on their content
 * Used for optimizing rendering in lists with dynamic content
 *
 * @param item - The item to generate a key for
 * @param index - The index of the item in the list (used as fallback)
 * @returns A string key that's stable across renders for the same item
 */
function generateStableKey(item: unknown, index: number): string {
  if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
    return `${typeof item}-${item}-${index}`;
  }

  if (item && typeof item === "object") {
    if ("id" in item) {
      return String((item as Record<string, unknown>).id);
    }

    try {
      const stableProps = Object.entries(item)
        .filter(([_, v]) => typeof v !== "function")
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${String(v)}`)
        .join("|");

      return `obj-${stableProps}-${index}`;
    } catch (e) {}
  }

  return `idx-${index}`;
}
