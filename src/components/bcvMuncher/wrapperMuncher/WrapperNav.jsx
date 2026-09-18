import { useState } from "react";
import { BurritoSelect } from "./BurritoSelect";

import { Box } from "@mui/material";
import BcvPicker from "./BcvPicker";

export default function WrapperNav({ flavor }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
      <BurritoSelect flavor={flavor} />
      <BcvPicker />
    </Box>
  );
}
