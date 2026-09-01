import React, { useState, useContext, useEffect } from "react";
import { Box, MenuItem, TextField, Stack } from "@mui/material";
import { getJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import {
  bcvContext as BcvContext,
  i18nContext as I18nContext,
  currentProjectContext as CurrentProjectContext,
  debugContext as DebugContext,
} from "pankosmia-rcl";
import ButtonBcv from "./ButtonBcv";

export default function BcvPicker({ setFirstChapter, disable = false }) {
  const { bcvRef } = useContext(BcvContext);
  const { debugRef } = useContext(DebugContext);
  const { i18nRef } = useContext(I18nContext);
  const { currentProjectRef } = useContext(CurrentProjectContext);
  const [contentBooks, setContentBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(bcvRef.current.bookCode || "");
  const [chapter, setChapter] = useState(
    Math.max(1, bcvRef.current.chapterNum),
  );
  const [verseStart, setVerseStart] = useState(
    Math.max(1, bcvRef.current.verseNum),
  );
  const [verseEnd, setVerseEnd] = useState(
    Math.max(1, bcvRef.current.endVerseNum),
  );

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
          setCurrentBook(fullMetadataResponse.json.book_codes[0]);
        } else {
          enqueueSnackbar(
            `${doI18n("pages:core-contenthandler_translation_plan:error", i18nRef.current)}: ${fullMetadataResponse.status}`,
            { variant: "error" },
          );
        }
      }
    };
    getProjectBooks().then();
  }, [currentProjectRef.current]);

  useEffect(() => {
    if (bcvRef.current) {
      setCurrentBook(bcvRef.current.bookCode);
      setChapter(bcvRef.current.chapterNum ?? 1);
      setVerseStart(bcvRef.current.verseNum ?? 1);
      setVerseEnd(bcvRef.current.endVerseNum ?? 1);
    }
  }, [bcvRef.current]);
  const pickerSx = {
    width: 100,
    "& .MuiInputBase-root": {
      height: 40,
    },
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <TextField
        disabled={disable}
        label={`${doI18n("pages:core-local-workspace:book", i18nRef.current)}`}
        id="book-button"
        size="small"
        select
        value={currentBook}
      >
        {contentBooks.map((b, n) => (
          <MenuItem
            sx={{ maxHeight: "3rem", height: "2rem" }}
            value={b}
            key={n}
            onClick={() => setCurrentBook(b)}
          >
            {doI18n(`scripture:books:${b}`, i18nRef.current)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        sx={pickerSx}
        size="small"
        label="Chapter"
        type="number"
        value={chapter}
        inputProps={{ min: 1 }}
        onChange={(e) => {
          setChapter(Math.max(1, Number(e.target.value)));
        }}
      />

      <TextField
        sx={pickerSx}
        size="small"
        label="Start"
        type="number"
        value={verseStart}
        inputProps={{ min: 1 }}
        onChange={(e) => {
          const value = Math.max(1, Number(e.target.value));

          setVerseStart(value);
          if (value > verseEnd) {
            setVerseEnd(value);
          }
        }}
      />
      <TextField
        sx={pickerSx}
        size="small"
        label="End"
        type="number"
        value={verseEnd}
        inputProps={{ min: verseStart }}
        onChange={(e) => {
          const value = Math.max(verseStart, Number(e.target.value));
          setVerseEnd(value);
        }}
      />
      <ButtonBcv
        bookCode={currentBook}
        chapter={chapter}
        verseStart={verseStart}
        verseEnd={verseEnd}
      />
    </Stack>
  );
}
