import { useState, useMemo, useContext } from "react";
import {
  TextField,
  Menu,
  MenuItem,
  Divider,
  InputAdornment,
  ListItemText,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { NestedMenuItem } from "mui-nested-menu";
import { PanDialog } from "pankosmia-rcl";
import { doI18n } from "pankosmia-lib/i18n";
import AddReference from "./AddReference";

export default function NavigationRef({ ingredient, i18nRef }) {
  const [openMainMenu, setOpenMainMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [value, setValue] = useState("");
  const [addReferenceOpen, setAddReferenceOpen] = useState(false);
  const open = Boolean(openMainMenu);
  const subOpen = Boolean(openSubMenu);

  const rows = (ingredient ?? []).slice(1);

  const allGroupNames = rows.map((row) => row[0].split(":")[0]);

  const groupNames = allGroupNames.filter(
    (name, index) => allGroupNames.indexOf(name) === index,
  );

  const groupList = groupNames.map((groupName) => {
    const references = rows
      .filter((row) => row[0].split(":")[0] === groupName)
      .map((row) => row[0]);

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

  const select = (reference) => {
    setValue(reference);

    closeAll();
  };
  const handleAddReference = () => {
    setAddReferenceOpen(true);

    closeAll();
  };
  return (
    <>
      <TextField
        label={doI18n(
          "pages:core-contenthandler_bcv:reference",
          i18nRef.current,
        )}
        value={value}
        onClick={(e) => setOpenMainMenu(e.currentTarget)}
        slotProps={{
          input: {
            readOnly: true,
            sx: {
              cursor: "pointer",
              "& input": {
                cursor: "pointer",
                caretColor: "transparent",
              },
            },
            endAdornment: (
              <InputAdornment position="end">
                {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </InputAdornment>
            ),
          },
        }}
      />
      <Menu anchorEl={openMainMenu} open={open} onClose={closeAll}>
        {groupList.map(([groupName]) => (
          <MenuItem key={groupName} onClick={(e) => openGroup(e, groupName)}>
            <ListItemText>{groupName}</ListItemText>
            <ArrowRightIcon fontSize="small" />
          </MenuItem>
        ))}

        <Divider />

        <MenuItem onClick={handleAddReference}>
          <AddIcon fontSize="small" sx={{ mr: 1 }} /> Add
        </MenuItem>
      </Menu>
      {addReferenceOpen && (
        <AddReference
          addReferenceOpen={addReferenceOpen}
          setAddReferenceOpen={setAddReferenceOpen}
          i18nRef={i18nRef}
        />
      )}

      <Menu
        anchorEl={openSubMenu}
        open={subOpen}
        onClose={closeAll}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {currentReferences.map((reference) => (
          <MenuItem key={reference} onClick={() => select(reference)}>
            {reference}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
