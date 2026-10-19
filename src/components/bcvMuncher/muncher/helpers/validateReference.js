const CHAPTER = /^(front|intro|back|[0-9]+)$/;
const VERSE = /^(front|intro|back|[0-9]+(-[0-9]+)?)$/;

// Validates a reference string of the form "x:y" (e.g. "1:2", "1:1-4", "front:intro").
export function validateReference(reference) {
  if (typeof reference !== "string") return false;
  const parts = reference.split(":");
  if (parts.length !== 2) return false;
  return CHAPTER.test(parts[0]) && VERSE.test(parts[1]);
}

export default validateReference;
