import { useState } from "react";
import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddLineDialog from "./AddLineDialog";
import { doI18n } from "pankosmia-lib/i18n";

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
  i18nRef,
}) {
  const [openedModal, setOpenedModal] = useState(null);

  const handleCreateForm = () => {
    setRefDisabled(false);
    setOpenedModal("add");
  };

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
      <AddLineDialog
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
      />
    </Box>
  );
}

export default AddFab;
