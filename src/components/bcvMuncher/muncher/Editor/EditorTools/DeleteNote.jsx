import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

import { doI18n } from "pankosmia-lib/i18n";
function DeleteNote({
  open,
  closeModal,
  ingredient,
  setIngredient,
  rowData,
  currentRowN,
  i18nRef,
}) {
  const handleClose = () => {
    closeModal();
  };

  const handleDeleteRow = (rowN) => {
    const newIngredient = [...ingredient];
    newIngredient.splice(rowN, 1);
    setIngredient(newIngredient);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
        },
      }}
    >
      <DialogTitle>
        <b>
          Référence de la note : {rowData[0]} - {rowData[1]}
        </b>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="h6">
            {doI18n(
              "pages:core-contenthandler_bcv:delete_note_bcv",
              i18nRef.current,
            )}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {doI18n("pages:core-contenthandler_bcv:cancel", i18nRef.current)}
        </Button>
        <Button
          color="warning"
          onClick={() => {
            handleDeleteRow(currentRowN);
            handleClose();
          }}
        >
          {doI18n(
            "pages:core-contenthandler_bcv:do_delete_button",
            i18nRef.current,
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default DeleteNote;
