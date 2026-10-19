import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  AccordionActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, useEffect } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Markdown from "react-markdown";
import { getJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import MarkdownField from "./MarkdownField";
import md5 from "md5";
import NumberField from "./NumberField";

export default function AccordionTsv({
  ingredient,
  metadata,
  setIngredient,
  md5Ingredient,
  setMd5Ingredient,
  i18nRef,
  debugRef,
  currentReference,
  setCurrentReference,
}) {
  const [expanded, setExpanded] = useState(false);
  const [repoFlavor, setRepoFlavor] = useState("");

  useEffect(() => {
    const getProjectSummaries = async () => {
      const summariesResponse = await getJson(
        `/api/burrito/metadata/summary/${metadata?.local_path}`,
        debugRef.current,
      );
      if (summariesResponse.ok) {
        const data = await summariesResponse.json;
        setRepoFlavor(data.flavor);
      } else {
        console.error(
          `${doI18n("pages:core-contenthandler_bcv:error_data", i18nRef.current)}`,
        );
      }
    };
    getProjectSummaries();
  }, []);

  const header = ingredient?.[0];

  const markdownColumns = ["note", "question", "response"];
  const isMarkdownColumn = (cellIndex) =>
    markdownColumns.includes(header[cellIndex]?.trim().toLowerCase());

  const isOccurrenceColumn = (cellIndex) =>
    header[cellIndex]?.trim().toLowerCase() === "occurrence";

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCellChange = (rowIndex, cellIndex, newValue) => {
    const next = ingredient.map((row, r) =>
      r === rowIndex
        ? row.map((cell, c) => (c === cellIndex ? newValue : cell))
        : row,
    );
    setIngredient(next);
  };

  const handleDeleteRow = (rowN) => {
    const newIngredient = [...ingredient];
    newIngredient.splice(rowN, 1);
    setIngredient(newIngredient);
  };
  const RegexChapter = /^(front|intro|back|[0-9]+)$/;
  const RegexVerse = /^(front|intro|back|[0-9]+|[0-9]+\s*-\s*[0-9]+)$/;
  return (
    <Box>
      {ingredient?.map((row, index) => {
        if (index === 0) return null;
        if (row[0] !== currentReference) return null;
        return (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              aria-controls={`panel${index}d-content`}
              id={`panel${index}d-header`}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography
                component="span"
                color="textSecondary"
                sx={{
                  width: "33%",
                  flexShrink: 0,
                }}
              >
                {row[1]}
              </Typography>

              <Typography
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  whiteSpace: "pre-line",
                }}
              >
                {["x-bcvquestions", "x-questions"].includes(repoFlavor)
                  ? row[5]
                  : row[6]}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {row.map((cell, cellIndex) =>
                isMarkdownColumn(cellIndex) ? (
                  <MarkdownField
                    key={cellIndex}
                    value={cell}
                    label={header[cellIndex]}
                    onBlur={(newValue) => {
                      handleCellChange(index, cellIndex, newValue);
                    }}
                  />
                ) : isOccurrenceColumn(cellIndex) ? (
                  <NumberField
                    key={cellIndex}
                    size="small"
                    value={cell === "" || cell == null ? null : Number(cell)}
                    label={header[cellIndex]}
                    min={0}
                    onValueChange={(newValue) => {
                      handleCellChange(index, cellIndex, newValue);
                    }}
                  />
                ) : (
                  <TextField
                    size="small"
                    key={cellIndex}
                    defaultValue={cell}
                    disabled={cellIndex === 1}
                    label={header[cellIndex]}
                    variant="outlined"
                    fullWidth
                    multiline
                    onBlur={(newValue) => {
                      if (row[0]) {
                        setCurrentReference(newValue.target.value);
                        handleCellChange(
                          index,
                          cellIndex,
                          newValue.target.value,
                        );
                      } else {
                        handleCellChange(
                          index,
                          cellIndex,
                          newValue.target.value,
                        );
                      }
                    }}
                  />
                ),
              )}
            </AccordionDetails>
            <AccordionActions>
              <IconButton onClick={() => handleDeleteRow(index)}>
                <DeleteOutlinedIcon />
              </IconButton>
            </AccordionActions>
          </Accordion>
        );
      })}
    </Box>
  );
}
