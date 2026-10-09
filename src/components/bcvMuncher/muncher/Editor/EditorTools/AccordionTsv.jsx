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
import { useState, useContext, useEffect } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Markdown from "react-markdown";
import { getJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import { i18nContext, debugContext, Header } from "pankosmia-rcl";
import MarkdownField from "./MarkdownField";

export default function AccordionTsv({ ingredient, metadata, setIngredient }) {
  console.log("🚀 ~ AccordionTsv ~ ingredient:", ingredient);
  const i18nRef = useContext(i18nContext);
  const debugRef = useContext(debugContext);
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
          `${doI18n("pages:core-contenthandler-generic:error_data", i18nRef.current)}`,
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
    setIngredient((prev) =>
      prev.map((row, r) =>
        r === rowIndex
          ? row.map((cell, c) => (c === cellIndex ? newValue : cell))
          : row,
      ),
    );
  };
  const handleDeleteRow = (rowN) => {
    const newIngredient = [...ingredient];
    newIngredient.splice(rowN, 1);
    setIngredient(newIngredient);
  };

  return (
    <Box>
      {ingredient?.map((row, index) => (
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
              color="secondary"
              component="span"
              sx={{ width: "33%", flexShrink: 0 }}
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
              {repoFlavor && repoFlavor === "x-bcvquestions" ? row[5] : row[6]}
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
                  onChange={(newValue) => {
                    handleCellChange(index, cellIndex, newValue);
                  }}
                />
              ) : isOccurrenceColumn(cellIndex) ? (
                <TextField
                  size="small"
                  key={cellIndex}
                  value={cell}
                  label={header[cellIndex]}
                  variant="outlined"
                  fullWidth
                  multiline
                  type="number"
                  onChange={(newValue) => {
                    handleCellChange(index, cellIndex, newValue.target.value);
                  }}
                />
              ) : (
                <TextField
                  size="small"
                  key={cellIndex}
                  value={cell}
                  label={header[cellIndex]}
                  variant="outlined"
                  fullWidth
                  multiline
                  onChange={(newValue) => {
                    handleCellChange(index, cellIndex, newValue.target.value);
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
      ))}
    </Box>
  );
}
