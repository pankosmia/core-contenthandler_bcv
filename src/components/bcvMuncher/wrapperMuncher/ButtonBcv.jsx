import { bcvContext, debugContext } from "pankosmia-rcl";
import { useContext } from "react";
import { postEmptyJson } from "pankosmia-lib/http";
import { Button, Typography } from "@mui/material";

export default function ButtonBcv({ bookCode, chapter, verseStart, verseEnd }) {
  const { bcvRef } = useContext(bcvContext);
  const { debugRef } = useContext(debugContext);

  return (
    <>
      <Button
        sx={{ height: 40 }}
        variant="contained"
        onClick={() =>
          postEmptyJson(
            `/api/navigation/bcv/${bookCode}/${chapter}/${verseStart}/${verseEnd}`,
            debugRef.current,
          )
        }
      >
        Go to {bookCode} {chapter}:{verseStart}
        {verseEnd !== verseStart && verseEnd && `-${verseEnd}`}
      </Button>

      <Typography>
        Current BCV is : {bcvRef.current.bookCode} {bcvRef.current.chapterNum}:
        {bcvRef.current.verseNum}
        {bcvRef.current.verseNum !== bcvRef.current.endVerseNum &&
          bcvRef.current.endVerseNum &&
          `-${bcvRef.current.endVerseNum}`}{" "}
      </Typography>
    </>
  );
}
