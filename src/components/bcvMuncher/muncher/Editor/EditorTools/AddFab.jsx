import { useState } from "react";
import {
  Box,
  DialogContent,
  Fab,
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddLineDialog from "./AddLineDialog";
import { doI18n } from "pankosmia-lib/i18n";
import { PanDialog, PanDialogActions } from "pankosmia-rcl";
import TsvLineForm from "./TsvLineForm";
import MarkdownField from "./MarkdownField";
import Markdown from "react-markdown";

function AddFab({
  currentRowN,
  setCurrentRowN,
  ingredient,
  setIngredient,
  cellValueChanged,
  setCellValueChanged,
  refDisabled,
  setRefDisabled,
  resourceType,
  showAllFields,
  setShowAllFields,
  i18nRef,
}) {
  const [openedModal, setOpenedModal] = useState(false);
  const handleCreateForm = () => {
    setRefDisabled(false);
    setOpenedModal(true);
  };
  const [newCurrentRow, setNewCurrentRow] = useState(Array(7).fill("", 0, 7));

  const handleSaveNewTsvRow = (rowN, newRow) => {
    const newIngredient = [...ingredient];
    newIngredient.splice(rowN, 0, newRow);
    setIngredient(newIngredient);
    closeModal();
  };
  const isQuestionsFlavor =
    resourceType === "new_bcv_question" ||
    resourceType === "new_bcv_study_question";

  return (
    <Box>
      <Fab
        variant="extended"
        color="primary"
        size="small"
        onClick={(event) => {
          handleCreateForm();
        }}
        sx={{ ml: 2 }}
      >
        <AddIcon sx={{ mr: 1 }} />
        {doI18n("pages:core-contenthandler_bcv:add", i18nRef.current)}
      </Fab>
      <PanDialog
        isOpen={openedModal}
        onClose={() => setOpenedModal(null)}
        titleLabel={doI18n(
          `pages:core-contenthandler_bcv:${!resourceType.includes("note") ? "new_bcv_question" : resourceType}`,
          i18nRef.current,
        )}
      >
        <DialogContent>
          {isQuestionsFlavor && (
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={showAllFields}
                    onChange={(event) => setShowAllFields(event.target.checked)}
                  />
                }
                label={doI18n(
                  "pages:core-contenthandler_bcv:show_all_fields",
                  i18nRef.current,
                )}
              />
            </FormGroup>
          )}
          <TextField
            fullWidth
            label={doI18n("pages:core-contenthandler_bcv:ref", i18nRef.current)}
            placeholder="1:1"
          />
          <TextField
            fullWidth
            disabled
            label={doI18n("pages:core-contenthandler_bcv:id", i18nRef.current)}
          >
            bonjour
          </TextField>
          {isQuestionsFlavor && showAllFields && (
            <>
              <TextField
                label={doI18n(
                  "pages:core-contenthandler_bcv:tags",
                  i18nRef.current,
                )}
              />
              <TextField
                label={doI18n(
                  "pages:core-contenthandler_bcv:quote",
                  i18nRef.current,
                )}
              />
            </>
          )}
          {!isQuestionsFlavor && (
            <>
              <TextField
                label={doI18n(
                  "pages:core-contenthandler_bcv:tags",
                  i18nRef.current,
                )}
              />
              <TextField
                fullWidth
                label={doI18n(
                  "pages:core-contenthandler_bcv:support",
                  i18nRef.current,
                )}
              />
              <TextField
                label={doI18n(
                  "pages:core-contenthandler_bcv:quote",
                  i18nRef.current,
                )}
              />
              <TextField
                label={doI18n(
                  "pages:core-contenthandler_bcv:occurrence_number",
                  i18nRef.current,
                )}
                type="number"
              />
              <TextField
                label={doI18n(
                  "pages:core-contenthandler_bcv:total_occurrences",
                  i18nRef.current,
                )}
                type="number"
              />
            </>
          )}
          {isQuestionsFlavor && (
            <TextField
              fullWidth
              label={doI18n(
                "pages:core-contenthandler_bcv:question",
                i18nRef.current,
              )}
            />
          )}
        </DialogContent>

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
          closeFn={() => setOpenedModal(false)}
          closeLabel={doI18n(
            "pages:core-contenthandler_bcv:close",
            i18nRef.current,
          )}
        />
      </PanDialog>
      {/* <AddLineDialog
        mode="add"
        open={openedModal === "add"}
        closeModal={() => setOpenedModal(null)}
        currentRowN={currentRowN}
        setCurrentRowN={setCurrentRowN}
        ingredient={ingredient}
        setIngredient={setIngredient}
        cellValueChanged={cellValueChanged}
        setCellValueChanged={setCellValueChanged}
        refDisabled={refDisabled}
        setRefDisabled={setRefDisabled}
        resourceType={resourceType}
        i18nRef={i18nRef}
        showAllFields={showAllFields}
        setShowAllFields={setShowAllFields}
      /> */}
    </Box>
  );
}

export default AddFab;
