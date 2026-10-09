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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { postEmptyJson, getText } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import SearchWithVerses from "./EditorTools/SearchWithVerses";
import Editor from "./EditorTools/Editor";
import AddFab from "./EditorTools/AddFab";
import SaveTsvButton from "./EditorTools/SaveTsvButton";
import md5 from "md5";
import BookPicker from "./EditorTools/BookPicker";
import NotesChapterPicker from "./EditorTools/NotesChapterPicker";
import { getFirstChapterBCVNotes } from "../utils/findFirstChapter";
import LayoutIcon from "../layouts/LayoutIcon";
import AccordionTsv from "./EditorTools/AccordionTsv";

function BcvNotesEditorMuncher({
  metadata,
  debugRef,
  systemBcv,
  i18nRef,
  bcvRef,
  currentProjectRef,
}) {
  const [ingredient, setIngredient] = useState([]);
  const [currentRowN, setCurrentRowN] = useState(1);
  const [md5Ingredient, setMd5Ingredient] = useState([]);
  const [cellValueChanged, setCellValueChanged] = useState(false);
  const [currentChapter, setCurrentChapter] = useState("1");
  const [refDisabled, setRefDisabled] = useState(false);
  const [resourceType, setResourceType] = useState("new_bcv_note");
  const [showAllFields, setShowAllFields] = useState(true);

  const navigate = useNavigate();

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
    <>
      <AccordionTsv
        ingredient={ingredient}
        setIngredient={setIngredient}
        metadata={metadata}
        md5Ingredient={md5Ingredient}
        setMd5Ingredient={setMd5Ingredient}
      />
      <SaveTsvButton
        metadata={metadata}
        ingredient={ingredient}
        setIngredient={setIngredient}
        md5Ingredient={md5Ingredient}
        setMd5Ingredient={setMd5Ingredient}
        i18nRef={i18nRef}
        systemBcv={systemBcv}
      />
    </>
  );
}

export default BcvNotesEditorMuncher;
