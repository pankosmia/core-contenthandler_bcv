import { ListItemIcon, MenuItem, ListItemText } from "@mui/material";
import Check from "@mui/icons-material/Check";
import { PanMenuWrapper } from "pankosmia-rcl";
import { useState } from "react";

export default function MenuFields({
  ingredient,
  setHiddenFields,
  hiddenFields,
  isOpen,
  setIsOpen,
  anchorEl,
}) {
  const HEADER = ingredient?.[0];

  const handleToggle = (row) => {
    setHiddenFields((prev) =>
      prev.includes(row) ? prev.filter((item) => item !== row) : [...prev, row],
    );
  };
  return (
    <PanMenuWrapper anchorEl={anchorEl} setIsOpen={setIsOpen} isOpen={isOpen}>
      {HEADER?.map((row) => {
        return (
          <MenuItem
            key={row}
            onClick={() => handleToggle(row)}
            selected={Boolean(!hiddenFields.includes(row))}
          >
            <ListItemIcon>
              {!hiddenFields.includes(row) ? <Check fontSize="small" /> : null}
            </ListItemIcon>
            <ListItemText> {row} </ListItemText>
          </MenuItem>
        );
      })}
    </PanMenuWrapper>
  );
}
