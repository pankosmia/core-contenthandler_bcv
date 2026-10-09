import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  AccordionActions,
  Button,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, useContext, useEffect } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Markdown from "react-markdown";
import { getJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import { i18nContext, debugContext, Header } from "pankosmia-rcl";

export default function AccordionTsv({ ingredient, metadata }) {
  const [expanded, setExpanded] = useState(false);
  const [repoFlavor, setRepoFlavor] = useState("");
  console.log("🚀 ~ AccordionTsv ~ repoFlavor:", repoFlavor);

  const i18nRef = useContext(i18nContext);
  const debugRef = useContext(debugContext);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const header = ingredient?.[0];

  const markdownColumns = ["notes", "questions", "response"];
  const isMarkdownColumn = (cellIndex) =>
    markdownColumns.includes(header[cellIndex]?.trim().toLowerCase());

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
  useEffect(() => {
    getProjectSummaries();
  }, []);
  return (
    <div>
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
            <Typography component="span" sx={{ width: "33%", flexShrink: 0 }}>
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
              {repoFlavor === "x-bcvquestions" ? row[5] : row[6]}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {row.map((cell, cellIndex) =>
              isMarkdownColumn(cellIndex) ? (
                <Markdown
                  size="small"
                  key={cellIndex}
                  value={cell}
                  label={header[cellIndex]}
                  variant="outlined"
                  fullWidth
                  multiline
                  sx={{ padding: 1 }}
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
                  sx={{ padding: 1 }}
                />
              ),
            )}
          </AccordionDetails>
          <AccordionActions>
            <IconButton>
              <DeleteOutlinedIcon />
            </IconButton>
          </AccordionActions>
        </Accordion>
      ))}
    </div>
  );
}
