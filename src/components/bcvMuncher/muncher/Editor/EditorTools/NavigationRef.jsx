import { useState, useMemo, useContext, useRef } from "react";
import { postEmptyJson } from "pankosmia-lib/http";
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
  Popper,
  MenuList,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { PanDialog } from "pankosmia-rcl";
import { doI18n } from "pankosmia-lib/i18n";
import AddReference from "./AddReference";

export default function NavigationRef({
  ingredient,
  setIngredient,
  i18nRef,
  currentReference,
  setCurrentReference,
  bcvRef,
  debugRef,
}) {
  const [openMainMenu, setOpenMainMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [addReferenceOpen, setAddReferenceOpen] = useState(false);
  const open = Boolean(openMainMenu);
  const subOpen = Boolean(openSubMenu);
  const closeTimer = useRef(null);

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
  const parseRef = (ref) => ref.split(":").map((n) => parseInt(n, 10) || 0);

  groupedRows.sort((a, b) => {
    const [chA, vA] = parseRef(a[0][0]);
    const [chB, vB] = parseRef(b[0][0]);
    return chA - chB || vA - vB;
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

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleCloseSubMenu = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpenSubMenu(null);
      setCurrentGroup(null);
    }, 150);
  };
  const openGroup = (event, groupName) => {
    cancelClose();
    setOpenSubMenu(event.currentTarget);
    setCurrentGroup(groupName);
  };

  const closeAll = () => {
    cancelClose();
    setOpenMainMenu(null);
    setOpenSubMenu(null);
    setCurrentGroup(null);
  };

  const handleSelectReference = (reference) => {
    postEmptyJson(
      `/api/navigation/bcv/${bcvRef.current.bookCode}/${reference.split(":")[0]}/${reference.split(":")[1]}`,
      debugRef.current,
    );
    setCurrentReference(reference);
    closeAll();
  };
  const handleAddReference = () => {
    setAddReferenceOpen(true);
    closeAll();
  };

  return (
    <>
      <FormControl size="small" sx={{ minWidth: 110 }}>
        <InputLabel id="reference-label">
          {doI18n("pages:core-contenthandler_bcv:reference", i18nRef.current)}
        </InputLabel>

        <Select
          labelId="reference-label"
          label={doI18n(
            "pages:core-contenthandler_bcv:reference",
            i18nRef.current,
          )}
          displayEmpty
          value={currentReference ?? bcvRef.current.chapter}
          open={Boolean(openMainMenu)}
          onOpen={() => setOpenMainMenu(true)}
          onClose={(event) => {
            if (event?.target?.closest?.(".MuiMenuItem-root")) return;
            closeAll();
          }}
          renderValue={(value) => value || currentReference[0]}
        >
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {groupList.map(([groupName]) => {
              return (
                <MenuItem
                  key={groupName}
                  onClick={(e) => openGroup(e, groupName)}
                  onMouseEnter={(e) => openGroup(e, groupName)}
                  onMouseLeave={scheduleCloseSubMenu}
                >
                  <ListItemText>{groupName}</ListItemText>
                  <ArrowRightIcon fontSize="small" />
                </MenuItem>
              );
            })}
          </div>
          <MenuItem
            onClick={handleAddReference}
            onMouseEnter={(e) => openGroup(e, null)}
          >
            <AddIcon fontSize="small" sx={{ mr: 1 }} />
            {doI18n("pages:core-contenthandler_bcv:add", i18nRef.current)}
          </MenuItem>
        </Select>
      </FormControl>

      <Popper
        open={Boolean(openSubMenu)}
        anchorEl={openSubMenu}
        placement="right-start"
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <Paper
          sx={{ maxHeight: "50vh", overflowY: "auto" }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleCloseSubMenu}
        >
          <MenuList>
            {currentReferences.map((reference) => (
              <MenuItem
                key={reference}
                onClick={() => handleSelectReference(reference)}
              >
                {reference.split(":")[1]}
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </Popper>

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
