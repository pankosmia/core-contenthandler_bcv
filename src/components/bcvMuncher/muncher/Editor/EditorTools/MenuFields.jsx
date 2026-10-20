import { ListItemIcon, MenuItem, Checkbox, ListItemText } from "@mui/material";
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
          <MenuItem key={row} onClick={() => handleToggle(row)}>
            <ListItemIcon>
              <Checkbox checked={!hiddenFields.includes(row)} />
            </ListItemIcon>
            <ListItemText> {row} </ListItemText>
          </MenuItem>
        );
      })}
    </PanMenuWrapper>
  );
}
