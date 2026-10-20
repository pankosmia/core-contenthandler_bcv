import React, { useState, useEffect } from "react";
import { Box, MenuItem, TextField } from "@mui/material";
import { getJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import { getFirstChapterBCVNotes } from "../../utils/findFirstChapter";
function BookPicker({ bcvRef, debugRef, i18nRef, currentProjectRef }) {
  const [contentBooks, setContentBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(bcvRef.current.bookCode);

  useEffect(() => {
    const getProjectBooks = async () => {
      if (currentProjectRef.current) {
        const projectPath = `${currentProjectRef.current.source}/${currentProjectRef.current.organization}/${currentProjectRef.current.project}`;
        const fullMetadataResponse = await getJson(
          `/api/burrito/metadata/summary/${projectPath}`,
          debugRef.current,
        );
        if (fullMetadataResponse.ok) {
          setContentBooks(fullMetadataResponse.json.book_codes);
        }
      }
    };
    getProjectBooks().then();
  }, [currentProjectRef]);

  useEffect(() => {
    if (currentBook && bcvRef.current.bookCode !== currentBook) {
      getFirstChapterBCVNotes(
        currentProjectRef.current,
        debugRef.current,
        currentBook,
      );
    }
  }, [currentBook]);

  return (
    <>
      <TextField
        label={`${doI18n("pages:core-contenthandler_bcv:book", i18nRef.current)}`}
        id="book-button"
        size="small"
        select
        value={bcvRef.current.bookCode}
      >
        {contentBooks.map((b, n) => (
          <MenuItem
            sx={{ maxHeight: "3rem", height: "2rem" }}
            value={b}
            key={n}
            onClick={() => {
              setCurrentBook(b);
            }}
          >
            {doI18n(`scripture:books:${b}`, i18nRef.current)}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}

export default BookPicker;
