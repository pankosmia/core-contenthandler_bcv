import { useState } from "react";
import MenuFields from "./MenuFields";
import BookPicker from "./BookPicker";
import NavigationRef from "./NavigationRef";
import {
  BCVNavigationProvider,
  useBCVNavigation,
} from "./BCVNavigationContext";
import { Box } from "@mui/material";

function Navigation({ bcvRef, i18nRef, currentProjectRef, debugRef }) {
  const {
    ingredient,
    setIngredient,
    hiddenFields,
    setHiddenFields,
    currentReference,
    setCurrentReference,
    pendingRef,
  } = useBCVNavigation();
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

export default function BCVNavigation(props) {
  const navigation = useBCVNavigation();
  if (navigation) return <Navigation {...props} />;
  return (
    <BCVNavigationProvider {...props}>
      <Navigation {...props} />
    </BCVNavigationProvider>
  );
}
