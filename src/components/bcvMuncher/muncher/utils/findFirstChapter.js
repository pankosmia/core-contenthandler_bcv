import { getJson, postEmptyJson, getText } from "pankosmia-lib/http";
export async function getFirstChapterTextTranslation(
  currentProjectRefCurr,
  debugRefCurr,
  bookCode,
) {
  const projectPath = `${currentProjectRefCurr.source}/${currentProjectRefCurr.organization}/${currentProjectRefCurr.project}`;
  const response = await getText(
    `/api/burrito/ingredient/raw/${projectPath}?ipath=${bookCode}.usfm`,
  );
  if (response.ok) {
    const usfmString = response.text;
    const re = /\\c\s+(\d+)/;
    const match = usfmString.match(re);
    if (match) {
      const chapter = match[1];
      postEmptyJson(
        `/api/navigation/bcv/${bookCode}/${chapter}/1`,
        debugRefCurr,
      );
    }
  }
}

export async function getFirstChapterJuxta(
  currentProjectRefCurr,
  debugRefCurr,
  bookCode,
) {
  const projectPath = `${currentProjectRefCurr.source}/${currentProjectRefCurr.organization}/${currentProjectRefCurr.project}`;
  const response = await getJson(
    `/api/burrito/ingredient/raw/${projectPath}?ipath=${bookCode}.json`,
    debugRefCurr,
  );
  if (response.ok) {
    let [chapter, verse] = response.json[0].chunks[0].source[0].cv.split(":");
    postEmptyJson(
      `/api/navigation/bcv/${bookCode}/${chapter}/${verse}`,
      debugRefCurr,
    );
  }
}

export async function getFirstChapterBCVNotes(
  currentProjectRefCurr,
  debugRefCurr,
  bookCode,
) {
  const projectPath = `${currentProjectRefCurr.source}/${currentProjectRefCurr.organization}/${currentProjectRefCurr.project}`;
  const response = await getText(
    `/api/burrito/ingredient/raw/${projectPath}?ipath=${bookCode}.tsv`,
    debugRefCurr,
  );
  if (response.ok) {
    const firstCol = response.text
      .split("\n")
      .map((line) => line.split("\t")[0].trim()) // first column
      .filter((v) => /^\d+:\d+$/.test(v)) // only chapter:verse
      .map((v) => {
        const [c, vrs] = v.split(":").map(Number);
        return { raw: v, chapter: c, verse: vrs };
      });

    if (firstCol.length > 0) {
      const { chapter, verse } = firstCol[0]; // get the first valid chapter:verse
      postEmptyJson(
        `/api/navigation/bcv/${bookCode}/${chapter}/${verse}`,
        debugRefCurr,
      );
    } else {
      return postEmptyJson(`/api/navigation/bcv/${bookCode}/0/0`, debugRefCurr);
    }
  }
}
