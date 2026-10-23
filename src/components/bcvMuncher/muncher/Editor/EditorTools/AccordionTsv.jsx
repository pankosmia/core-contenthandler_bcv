import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  AccordionActions,
  IconButton,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, useEffect, useMemo, useCallback } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { getJson, postEmptyJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import MarkdownField from "./MarkdownField";
import NumberField from "./NumberField";
import ReferenceField from "./ReferenceField";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DragIndicator } from "@mui/icons-material";
export default function AccordionTsv({
  ingredient,
  metadata,
  setIngredient,
  i18nRef,
  debugRef,
  currentReference,
  setCurrentReference,
  hiddenFields,
}) {
  const [expanded, setExpanded] = useState(false);
  const [repoFlavor, setRepoFlavor] = useState("");
  const [dragVersion, setDragVersion] = useState(0);

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

  const HEADER = ingredient?.[0];
  const hidden = (cellIndex) => {
    return hiddenFields.includes(HEADER[cellIndex]);
  };

  const REFERENCE_COLUMN = ["reference", "ref"];
  const MARKDOWN_COLUMNS = ["note", "question", "href", "answer", "response"];
  const OCCURRENCE_COLUMNS = ["occurrence", "ocurrence", "occurence"];

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

  const quoteIndex = useMemo(
    () => (HEADER ?? []).findIndex((c) => c?.toLowerCase().includes("quote")),
    [HEADER],
  );
  const postSnippet = useCallback((snippet) => {
    const trimmed = snippet?.trim();
    if (!trimmed) return;
    postEmptyJson(
      `/api/app-state/snippet/${encodeURIComponent(trimmed)}`,
      debugRef.current,
    );
  }, []);

  const visibleIndexes = (ingredient ?? [])
    .map((_, i) => i)
    .filter((i) => i !== 0 && ingredient[i][0] === currentReference);

  const handleDragEnd = ({ source, destination }) => {
    if (!destination) return;
    const from = visibleIndexes[source.index];
    const to = visibleIndexes[destination.index];

    const newIngredient = [...ingredient];
    const [moved] = newIngredient.splice(from, 1);
    newIngredient.splice(to, 0, moved);
    setIngredient(newIngredient);
  };

  return (
    <Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {ingredient?.map((row, index) => {
                if (index === 0) return null;
                if (row[0] !== currentReference) return null;
                return (
                  <Draggable
                    key={`${dragVersion}-${index}`}
                    draggableId={`draggable-${index}`}
                    index={visibleIndexes.indexOf(index)}
                  >
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Accordion
                          key={index}
                          expanded={expanded === `panel${index}`}
                          onChange={handleChange(`panel${index}`)}
                          sx={{ mb: "1px" }}
                        >
                          <AccordionSummary
                            aria-controls={`panel${index}d-content`}
                            id={`panel${index}d-header`}
                            expandIcon={<ExpandMoreIcon />}
                          >
                            <Box
                              {...provided.dragHandleProps}
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                padding: "0px 8px",
                                cursor: "grab",
                                color: "text.secondary",
                              }}
                            >
                              <DragIndicator />
                            </Box>

                            <Typography
                              component="span"
                              color="textSecondary"
                              sx={{
                                width: "12ch",
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
                              {["x-bcvquestions", "x-questions"].includes(
                                repoFlavor,
                              )
                                ? row[5]
                                : row[6]}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            {row.map((cell, cellIndex) =>
                              REFERENCE_COLUMN.includes(
                                HEADER[cellIndex]?.toLowerCase(),
                              ) ? (
                                <ReferenceField
                                  key={cellIndex}
                                  i18nRef={i18nRef}
                                  value={cell}
                                  label={HEADER[cellIndex]}
                                  onBlur={(newValue) => {
                                    handleCellChange(
                                      index,
                                      cellIndex,
                                      newValue,
                                    );
                                    setCurrentReference(newValue);
                                  }}
                                  hidden={hidden(cellIndex)}
                                />
                              ) : MARKDOWN_COLUMNS.includes(
                                  HEADER[cellIndex]?.toLowerCase(),
                                ) ? (
                                <MarkdownField
                                  key={cellIndex}
                                  value={cell}
                                  label={HEADER[cellIndex]}
                                  onBlur={(newValue) => {
                                    handleCellChange(
                                      index,
                                      cellIndex,
                                      newValue,
                                    );
                                  }}
                                  hidden={hidden(cellIndex)}
                                />
                              ) : OCCURRENCE_COLUMNS.includes(
                                  HEADER[cellIndex]?.toLowerCase(),
                                ) ? (
                                <NumberField
                                  key={cellIndex}
                                  size="small"
                                  value={
                                    cell === "" || cell == null
                                      ? null
                                      : Number(cell)
                                  }
                                  label={HEADER[cellIndex]}
                                  min={0}
                                  onValueChange={(newValue) => {
                                    handleCellChange(
                                      index,
                                      cellIndex,
                                      newValue,
                                    );
                                  }}
                                  hidden={hidden(cellIndex)}
                                />
                              ) : (
                                <TextField
                                  size="small"
                                  key={cellIndex}
                                  defaultValue={cell}
                                  disabled={cellIndex === 1}
                                  label={HEADER[cellIndex]}
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                  onFocus={(e) => {
                                    if (cellIndex === quoteIndex) {
                                      postSnippet(e.target.value);
                                    }
                                  }}
                                  onBlur={(newValue) => {
                                    handleCellChange(
                                      index,
                                      cellIndex,
                                      newValue.target.value,
                                    );
                                  }}
                                  sx={{
                                    display: hidden(cellIndex)
                                      ? "none"
                                      : undefined,
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
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
}
