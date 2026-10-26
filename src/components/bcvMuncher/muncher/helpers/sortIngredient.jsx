const toNumber = (cv) => {
  if (cv === "back") return 999999;
  return parseInt(cv, 10) || 0;
};

export const compareRefs = (refA, refB) => {
  const [chA, vA = "0"] = refA.split(":");
  const [chB, vB = "0"] = refB.split(":");
  if (toNumber(chA) !== toNumber(chB)) {
    return toNumber(chA) - toNumber(chB);
  }
  return toNumber(vA) - toNumber(vB);
};

export function sortIngredient(ingredient) {
  const header = ingredient[0];
  const rows = ingredient.slice(1).filter((row) => row[0]);
  rows.sort((a, b) => compareRefs(a[0], b[0]));
  return [header, ...rows];
}

export default sortIngredient;
