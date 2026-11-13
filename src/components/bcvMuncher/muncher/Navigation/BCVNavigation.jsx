import { useState } from "react";
import MenuFields from "./MenuFields";
import BookPicker from "./BookPicker";
import NavigationRef from "./NavigationRef";
import { Box } from "@mui/material";

export default function BCVNavigation({
  navigation,
  bcvRef,
  i18nRef,
  currentProjectRef,
  debugRef,
}) {
  const {
    ingredient,
    setIngredient,
    hiddenFields,
    setHiddenFields,
    currentReference,
    setCurrentReference,
    pendingRef,
  } = navigation;
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = (event) => {
    setIsOpen(true);
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ backgroundColor: "white" }}>
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
        pendingRef={pendingRef}
      />
    </Box>
  );
}
