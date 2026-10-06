import { useState, useEffect } from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Modal,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TsvLineForm from "./TsvLineForm";
import { doI18n } from "pankosmia-lib/i18n";
import { PanDialog, PanDialogActions } from "pankosmia-rcl";
function AddLineDialog({
  open,
  closeModal,
  ingredient,
  setIngredient,
  currentRowN,
  cellValueChanged,
  setCellValueChanged,
  refDisabled,
  setRefDisabled,
  resourceType,
  i18nRef,
  showAllFields,
  setShowAllFields,
}) {
  const [newCurrentRow, setNewCurrentRow] = useState(Array(7).fill("", 0, 7));

  // Permet de fermer la modal principale
  const handleCloseModalNewNote = () => {
    closeModal();
  };

  // Permet de sauvegarder la nouvelle note
  const handleSaveNewTsvRow = (rowN, newRow) => {
    const newIngredient = [...ingredient];
    newIngredient.splice(rowN, 0, newRow);
    setIngredient(newIngredient);
    closeModal();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxHeight: "80vh",
        maxWidth: "80vw",
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: 2,
        overflow: "auto",
      }}
    >
      <PanDialog
        titleLabel={doI18n(
          `pages:core-contenthandler_bcv:${!resourceType.includes("note") ? "new_bcv_question" : resourceType}`,
          i18nRef.current,
        )}
        isOpen={open}
        closeFn={() => handleCloseModalNewNote()}
      >
        <TsvLineForm
          mode="add"
          currentRow={newCurrentRow}
          setCurrentRow={setNewCurrentRow}
          currentRowN={currentRowN}
          ingredient={ingredient}
          setIngredient={setIngredient}
          saveFunction={handleSaveNewTsvRow}
          handleCloseModalNewNote={handleCloseModalNewNote}
          cellValueChanged={cellValueChanged}
          setCellValueChanged={setCellValueChanged}
          resourceType={resourceType}
          refDisabled={refDisabled}
          setRefDisabled={setRefDisabled}
          i18nRef={i18nRef}
          showAllFields={showAllFields}
          setShowAllFields={setShowAllFields}
        />
        <PanDialogActions
          actionLabel={doI18n(
            "pages:core-contenthandler_bcv:create",
            i18nRef.current,
          )}
          actionFn={() => {
            handleSaveNewTsvRow(currentRowN, newCurrentRow);
            setCellValueChanged(false);
          }}
          isDisabled={!cellValueChanged}
          closeFn={() => handleCloseModalNewNote()}
          closeLabel={doI18n(
            "pages:core-contenthandler_bcv:close",
            i18nRef.current,
          )}
        />
      </PanDialog>
    </Box>
  );
}

export default AddLineDialog;
