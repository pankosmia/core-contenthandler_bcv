import { useEffect, useContext, useState } from "react";
import { getJson } from "pankosmia-lib/http";
import {
  currentProjectContext,
  bcvContext,
  debugContext,
  i18nContext,
  typographyContext,
} from "pankosmia-rcl";
import { Box, Button } from "@mui/material";
import BcvNotesEditorMuncher from "../components/bcvMuncher/muncher/Editor/BcvNotesEditorMuncher";
import BcvNotesViewerMuncher from "../components/bcvMuncher/muncher/Viewer/BcvNotesViewerMuncher";
import BcvQuestionsViewerMuncher from "../components/bcvMuncher/muncher/Viewer/BcvQuestionsViewerMuncher";
import WrapperNav from "../components/bcvMuncher/wrapperMuncher/WrapperNav";
export default function MuncherTest() {
  const { bcvRef } = useContext(bcvContext);
  const { systemBcv } = useContext(bcvContext);
  const { debugRef } = useContext(debugContext);
  const { i18nRef } = useContext(i18nContext);
  const { typographyRef } = useContext(typographyContext);
  const { currentProjectRef } = useContext(currentProjectContext);
  const [currentBurrito, setCurrentBurrito] = useState(null);
  const [modified, setModified] = useState(false);
  const [flavor, setFlavor] = useState();
  useEffect(() => {
    async function getSummary() {
      if (currentProjectRef.current) {
        const projectPath = `${currentProjectRef.current.source}/${currentProjectRef.current.organization}/${currentProjectRef.current.project}`;
        const fullMetadataResponse = await getJson(
          `/api/burrito/metadata/summary/${projectPath}`,
        );
        if (fullMetadataResponse.ok) {
          const entry = fullMetadataResponse.json;
          setCurrentBurrito([projectPath, entry]);
          setFlavor(entry.flavor);
        } else {
          enqueueSnackbar(
            `${doI18n("pages:core-translation_plan:error", i18nRef.current)}: ${fullMetadataResponse.status}`,
            { variant: "error" },
          );
        }
      }
    }

    getSummary();
  }, [currentProjectRef.current]);

  const metadata = currentBurrito && {
    local_path: currentBurrito[0],
    ...currentBurrito[1],
  };
  const handleCreate = () => {
    window.location.href =
      "/clients/core-contenthandler_translation_plan/#/createDocument/translationPlan?returnTypePage=munchertest";
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 3,
        height: "98vh",
      }}
    >
      <WrapperNav flavor={["x-bcvnotes", "x-bcvquestions"]} />

      <Box sx={{ display: "flex", width: "100%", overflowY: "scroll" }}>
        {metadata && (
          <Box sx={{ flex: 1, margin: 2 }}>
            <BcvNotesEditorMuncher
              metadata={metadata}
              debugRef={debugRef}
              systemBcv={systemBcv}
              i18nRef={i18nRef}
              bcvRef={bcvRef}
              currentProjectRef={currentProjectRef}
            />
          </Box>
        )}
        {metadata && flavor === "x-bcvnotes" && (
          <Box sx={{ flex: 1, margin: 5 }}>
            <BcvNotesViewerMuncher
              metadata={metadata}
              debugRef={debugRef}
              systemBcv={systemBcv}
              i18nRef={i18nRef}
            />
          </Box>
        )}
        {metadata && flavor === "x-bcvquestions" && (
          <Box sx={{ flex: 1, margin: 2 }}>
            <BcvQuestionsViewerMuncher
              metadata={metadata}
              debugRef={debugRef}
              systemBcv={systemBcv}
              i18nRef={i18nRef}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
