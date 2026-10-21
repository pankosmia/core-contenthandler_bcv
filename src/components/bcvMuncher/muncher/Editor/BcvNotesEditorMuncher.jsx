import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Stack,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
  Accordion,
  Button,
  Icon,
} from "@mui/material";
import { postEmptyJson, getText } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import SaveTsvButton from "./EditorTools/SaveTsvButton";
import md5 from "md5";
import BookPicker from "./EditorTools/BookPicker";
import LayoutIcon from "../layouts/LayoutIcon";
import AccordionTsv from "./EditorTools/AccordionTsv";
import NavigationRef from "./EditorTools/NavigationRef";
import MenuFields from "./EditorTools/MenuFields";
import { IconSettingSmall } from "./EditorTools/IconSetting";
function BcvNotesEditorMuncher({
  metadata,
  debugRef,
  systemBcv,
  i18nRef,
  bcvRef,
  currentProjectRef,
}) {
  const [ingredient, setIngredient] = useState([]);
  const [md5Ingredient, setMd5Ingredient] = useState([]);
  const [md5CurrentIngredient, setMd5CurrentIngredient] = useState([]);
  const [currentChapter, setCurrentChapter] = useState("1");
  const [resourceType, setResourceType] = useState("new_bcv_note");
  const [showAllFields, setShowAllFields] = useState(true);
  const [currentReference, setCurrentReference] = useState(
    `${bcvRef?.current.chapterNum}:${bcvRef?.current.verseNum}`,
  );
  const [firstChapter, setFirstChapter] = useState("1");
  const [hiddenFields, setHiddenFields] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = (event) => {
    setIsOpen(true);
    setAnchorEl(event.currentTarget);
  };
  // Récupération des données du tsv
  const getAllData = async () => {
    const ingredientLink = `/api/burrito/ingredient/raw/${metadata.local_path}?ipath=${systemBcv.bookCode}.tsv`;
    let response = await getText(ingredientLink, debugRef.current);
    if (response.ok) {
      const newIngredient = response.text
        .split("\n")
        .map((l) => l.split("\t").map((f) => f.replace(/(\\n){2,}/g, "\n\n")));
      setIngredient(newIngredient);
      const hash = md5(JSON.stringify(newIngredient));
      setMd5Ingredient(hash);
    }
  };
  // utilisation de la fonction getAllData
  useEffect(() => {
    getAllData().then();
  }, [systemBcv?.bookCode]);

  const updateBcv = (rowN) => {
    const newCurrentRow = ingredient[rowN][0];
    const newCurrentRowCV = newCurrentRow.split(":");
    const chapter = newCurrentRowCV[0];
    const verseRange = newCurrentRowCV[1];
    const startVerse = verseRange.split("-")[0];
    const endVerseNum = verseRange.includes("-")
      ? verseRange.split("-")[1]
      : startVerse;
    //const rowData = ingredient[rowN];
    //const alignment = rowData[6] || "";
    if (newCurrentRow[0]) {
      if (newCurrentRowCV.length === 2) {
        postEmptyJson(
          `/api/navigation/bcv/${systemBcv["bookCode"]}/${chapter}/${startVerse}/${endVerseNum}`,
          debugRef.current /* ,
          alignment ? { alignment } : undefined */,
        );
      }
    }
  };

  const isModified = useCallback(() => {
    const originalChecksum = md5Ingredient;
    if (!originalChecksum) {
      return false;
    }
    const currentChecksum = md5(JSON.stringify(ingredient));
    return originalChecksum !== currentChecksum;
  }, [ingredient, md5Ingredient]);
  useEffect(() => {
    const isElectron = !!window.electronAPI;
    if (isElectron) {
      if (isModified()) {
        window.electronAPI.setCanClose(false);
      } else {
        window.electronAPI.setCanClose(true);
      }
    }
  }, [isModified]);

  const notesExist = currentChapter
    ? ingredient.filter((l) => l[0].startsWith(`${currentChapter}:`))
    : [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          position: "fixed",
          top: "48px",
          left: 0,
          right: 0,
          display: "flex",
          padding: 2,
          flexDirection: "row",
          gap: 1,
        }}
      >
        <SaveTsvButton
          metadata={metadata}
          ingredient={ingredient}
          setIngredient={setIngredient}
          md5Ingredient={md5Ingredient}
          setMd5Ingredient={setMd5Ingredient}
          i18nRef={i18nRef}
          systemBcv={systemBcv}
        />
        <Tooltip
          title={doI18n(
            "pages:core-contenthandler_bcv:button_edit_layout",
            i18nRef.current,
            debugRef.current,
          )}
        >
          <IconButton
            disabled={md5(JSON.stringify(ingredient)) !== md5Ingredient}
            onClick={() =>
              navigate({
                pathname: "/",
                search: "return-page=workspace",
              })
            }
          >
            <LayoutIcon />
          </IconButton>
        </Tooltip>
        <MenuFields
          ingredient={ingredient}
          setHiddenFields={setHiddenFields}
          hiddenFields={hiddenFields}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          anchorEl={anchorEl}
          handleOpen={handleOpen}
        />
        <BookPicker
          bcvRef={bcvRef}
          i18nRef={i18nRef}
          systemBcv={systemBcv}
          currentProjectRef={currentProjectRef}
          debugRef={debugRef}
        />
        <NavigationRef
          ingredient={ingredient}
          setIngredient={setIngredient}
          i18nRef={i18nRef}
          currentReference={currentReference}
          setCurrentReference={setCurrentReference}
          bcvRef={bcvRef}
          debugRef={debugRef}
        />
      </Box>
      {hiddenFields.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
            paddingLeft: 2,
          }}
        >
          <IconSettingSmall />
          <Typography variant="caption">
            {" "}
            {hiddenFields.length}{" "}
            {doI18n(
              `pages:core-contenthandler_bcv:hidden_fields`,
              i18nRef.current,
            )}
          </Typography>
        </Box>
      )}
      <AccordionTsv
        ingredient={ingredient}
        setIngredient={setIngredient}
        metadata={metadata}
        i18nRef={i18nRef}
        debugRef={debugRef}
        currentReference={currentReference}
        setCurrentReference={setCurrentReference}
        hiddenFields={hiddenFields}
      />
    </Box>
  );
}

export default BcvNotesEditorMuncher;
