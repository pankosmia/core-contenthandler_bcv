import { useContext } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Typography,
} from "@mui/material";
import { doI18n } from "pithekos-lib";
import {
  i18nContext,
  PanVersificationPicker,
  PanBookPicker,
} from "pankosmia-rcl";
export default function ContentDocument({
  open,
  contentOption,
  setContentOption,
  versification,
  setVersification,
  bookCode,
  setBookCode,
  bookAbbr,
  setBookAbbr,
  bookCodes,
  bookTitle,
  setBookTitle,
}) {
  const { i18nRef } = useContext(i18nContext);

  return (
    <>
      <PanVersificationPicker
        versification={versification}
        setVersification={setVersification}
        isOpen={open}
      />
      <FormControl>
        <FormLabel id="book-create-options">
          {doI18n("pages:core-contenthandler_bcv:add_content", i18nRef.current)}
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="book-create-options"
          name="book-create-options-radio-group"
          value={contentOption}
          onChange={(event) => setContentOption(event.target.value)}
        >
          <FormControlLabel
            value="none"
            control={<Radio />}
            label={doI18n(
              "pages:core-contenthandler_bcv:no_content_radio",
              i18nRef.current,
            )}
          />
          <FormControlLabel
            value="book"
            control={<Radio />}
            label={doI18n(
              "pages:core-contenthandler_bcv:book_content_radio",
              i18nRef.current,
            )}
          />
        </RadioGroup>
      </FormControl>
      <Typography sx={{ padding: 1 }}>
        {contentOption === "book" &&
          `${doI18n("pages:core-contenthandler_bcv:helper_book", i18nRef.current)}`}
      </Typography>
      {contentOption === "book" && (
        <>
          <PanBookPicker
            bookCode={bookCode}
            setBookCode={setBookCode}
            bookAbbr={bookAbbr}
            setBookAbbr={setBookAbbr}
            bookCodes={bookCodes}
            bookTitle={bookTitle}
            setBookTitle={setBookTitle}
            addVerses={false}
          />
        </>
      )}
    </>
  );
}
