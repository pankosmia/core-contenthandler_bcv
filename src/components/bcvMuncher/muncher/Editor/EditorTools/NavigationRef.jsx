import { useState, useMemo, useContext } from "react";
import {
  TextField,
  Menu,
  MenuItem,
  Divider,
  InputAdornment,
  ListItemText,
  Paper,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { NestedMenuItem } from "mui-nested-menu";
import { PanDialog } from "pankosmia-rcl";
import { doI18n } from "pankosmia-lib/i18n";
import AddReference from "./AddReference";

export default function NavigationRef({
  ingredient,
  setIngredient,
  i18nRef,
  currentReference,
  setCurrentReference,
}) {
  const [openMainMenu, setOpenMainMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [addReferenceOpen, setAddReferenceOpen] = useState(false);
  const open = Boolean(openMainMenu);
  const subOpen = Boolean(openSubMenu);

  const rows = ingredient?.slice(1);
  const groupedRows = [];
  rows.forEach((row) => {
    const group = groupedRows.find((g) => g[0][0] === row[0]);
    if (group) {
      group.push(row);
    } else {
      groupedRows.push([row]);
    }
  });
  const allGroupNames = groupedRows.map((group) => group[0][0].split(":")[0]);

  const groupNames = allGroupNames.filter(
    (name, index) => allGroupNames.indexOf(name) === index,
  );

  const groupList = groupNames.map((groupName) => {
    const references = groupedRows
      .filter((group) => group[0][0].split(":")[0] === groupName)
      .map((group) => group[0][0]);

    return [groupName, references];
  });

  const currentReferences =
    groupList.find(([groupName]) => groupName === currentGroup)?.[1] ?? [];

  const openGroup = (event, groupName) => {
    setOpenSubMenu(event.currentTarget);
    setCurrentGroup(groupName);
  };

  const closeAll = () => {
    setOpenMainMenu(null);
    setOpenSubMenu(null);
    setCurrentGroup(null);
  };

  const handleSelectReference = (reference) => {
    setCurrentReference(reference);
    closeAll();
  };
  const handleAddReference = () => {
    setAddReferenceOpen(true);
    closeAll();
  };

  return (
    <>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="reference-label">
          {doI18n("pages:core-contenthandler_bcv:reference", i18nRef.current)}
        </InputLabel>

        <Select
          labelId="reference-label"
          label={doI18n(
            "pages:core-contenthandler_bcv:reference",
            i18nRef.current,
          )}
          value={currentReference}
          open={openMainMenu}
          onOpen={() => setOpenMainMenu(true)}
          onClose={(event) => {
            if (event?.target?.closest?.(".MuiMenuItem-root")) return;
            closeAll();
          }}
          renderValue={(value) => value}
        >
          {groupList.map(([groupName]) => {
            const selectedChapter =
              Boolean(openSubMenu) && groupName === currentGroup;
            return (
              <MenuItem
                key={groupName}
                onClick={(e) => openGroup(e, groupName)}
              >
                <ListItemText>{groupName}</ListItemText>
                <ArrowRightIcon fontSize="small" />
              </MenuItem>
            );
          })}

          <Divider />

          <MenuItem onClick={handleAddReference}>
            <AddIcon fontSize="small" sx={{ mr: 1 }} />
            {doI18n(
              "pages:core-contenthandler_bcv:add_reference",
              i18nRef.current,
            )}
          </MenuItem>
        </Select>
      </FormControl>

      <Menu
        anchorEl={openSubMenu}
        open={Boolean(openSubMenu)}
        onClose={closeAll}
        hideBackdrop
        disableEnforceFocus
        disableAutoFocus
        disableRestoreFocus
        disableScrollLock
        sx={{ pointerEvents: "none" }}
        slotProps={{ paper: { sx: { pointerEvents: "auto" } } }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {currentReferences.map((reference) => (
          <MenuItem
            key={reference}
            onClick={() => handleSelectReference(reference)}
          >
            {reference.split(":")[1]}
          </MenuItem>
        ))}
      </Menu>

      {addReferenceOpen && (
        <AddReference
          addReferenceOpen={addReferenceOpen}
          setAddReferenceOpen={setAddReferenceOpen}
          i18nRef={i18nRef}
          ingredient={ingredient}
          setIngredient={setIngredient}
          setCurrentReference={setCurrentReference}
        />
      )}
    </>
  );
}
