import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import { postEmpty, getText } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import SaveTsvButton from "./EditorTools/SaveTsvButton";
import md5 from "md5";
import BCVNavigation from "../Navigation/BCVNavigation";
import sortIngredient from "../helpers/sortIngredient";
import LayoutIcon from "../layouts/LayoutIcon";
import AccordionTsv from "./EditorTools/AccordionTsv";
import { IconSettingSmall } from "../Navigation/IconSetting";

function BcvNotesEditorMuncher({
  metadata,
  debugRef,
  systemBcv,
  i18nRef,
  bcvRef,
  currentProjectRef,
  navigation,
  showNavigation = true,
}) {
  const navigate = useNavigate();

  const {
    ingredient,
    setIngredient,
    md5Ingredient,
    setMd5Ingredient,
    currentReference,
    setCurrentReference,
    hiddenFields,
    setHiddenFields,
    pendingRef,
  } = navigation;
  const [currentChapter, setCurrentChapter] = useState("1");

  useEffect(() => {
    if (!metadata?.local_path || !systemBcv?.bookCode) return;
    let active = true;
    const getAllData = async () => {
      const ingredientLink = `/api/burrito/ingredient/raw/${metadata.local_path}?ipath=${systemBcv.bookCode}.tsv`;
      const response = await getText(ingredientLink, debugRef.current);
      if (active && response.ok) {
        const allRows = response.text
          .split(/\r?\n+/g)
          .map((row) =>
            row.split("\t").map((field) => field.replace(/(\\n){2,}/g, "\n\n")),
          );
        const newIngredient = sortIngredient(allRows);
        setIngredient(newIngredient);
        setMd5Ingredient(md5(JSON.stringify(newIngredient)));
      }
    };
    getAllData();
    return () => {
      active = false;
    };
  }, [metadata?.local_path, systemBcv?.bookCode, debugRef]);

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
        postEmpty(
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
      {showNavigation && (
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
          <BCVNavigation
            navigation={navigation}
            bcvRef={bcvRef}
            i18nRef={i18nRef}
            currentProjectRef={currentProjectRef}
            debugRef={debugRef}
          />
        </Box>
      )}
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
        pendingRef={pendingRef}
        BookCurrent={bcvRef.current.bookCode}
      />
    </Box>
  );
}

export default BcvNotesEditorMuncher;
