import { useContext, useState, useEffect, useRef } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Typography,
  Checkbox,
} from "@mui/material";
import { getText, getJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import {
  debugContext,
  i18nContext,
  Header,
  PanBasicDialog,
  PanDialogActionsArray,
} from "pankosmia-rcl";

import { enqueueSnackbar } from "notistack";
import { saveAs } from "file-saver";

function TsvExport() {
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [noBooksSelected, setNoBooksSelected] = useState(false);
  const [bookCodes, setBookCodes] = useState([]);
  const [bookNames, setBookNames] = useState([]);
  const [repoPath, setRepoPath] = useState([]);
  const [open, setOpen] = useState(true);
  const [returnTypePage, setReturnTypePage] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const confirmationRef = useRef(null);

  const getProjectSummaries = async () => {
    const hash = window.location.hash;
    const query = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(query);
    const path = params.get("repoPath");
    const returnType = params.get("returnTypePage");
    setRepoPath(path);
    setReturnTypePage(returnType);
    const summariesResponse = await getJson(
      `/api/burrito/metadata/summary/${path}`,
      debugContext.current,
    );
    if (summariesResponse.ok) {
      const data = summariesResponse.json;
      setBookNames(data.book_codes);
      setDocumentName(data.name);
    } else {
      console.error(
        `${doI18n("pages:core-contenthandler_bcv:fetch_error", i18nRef.current)}`,
      );
    }
  };
  useEffect(() => {
    getProjectSummaries();
  }, []);

  const tsvExportOneBook = async (bookCode) => {
    const bookUrl = `/api/burrito/ingredient/raw/${repoPath}?ipath=${bookCode}.tsv`;
    const bookTsvResponse = await getText(bookUrl, debugRef.current);
    if (!bookTsvResponse.ok) {
      enqueueSnackbar(
        `${doI18n("pages:core-contenthandler_bcv:could_not_fetch", i18nRef.current)} ${bookCode}`,
        { variant: "error" },
      );
      return false;
    }
    let blob = new Blob([bookTsvResponse.text], {
      type: "text/tab-separated-values",
    });
    saveAs(blob, `${bookCode}.tsv`);
    enqueueSnackbar(
      `${doI18n("pages:content:saved", i18nRef.current)} ${bookCode} ${doI18n("pages:content:to_download_folder", i18nRef.current)}`,
      { variant: "success" },
    );
    return true;
  };

  const handleToggle = (item) => {
    setSelectedBooks((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooks([]);
    if (returnTypePage === "dashboard") {
      return (window.location.href = "/clients/main");
    }
    return (window.location.href = "/clients/content");
  };
  const handleExport = async () => {
    if (selectedBooks.length === 0) {
      setNoBooksSelected(true);
      confirmationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    setNoBooksSelected(false);
    for (const bookCode of selectedBooks) {
      await tsvExportOneBook(bookCode);
    }
  };

  useEffect(() => {
    const doFetch = async () => {
      const versificationResponse = await getJson(
        "/api/content-utils/versification/eng",
        debugRef.current,
      );
      if (versificationResponse.ok) {
        setBookCodes(Object.keys(versificationResponse.json.maxVerses));
      }
    };
    if (bookCodes.length === 0) {
      doFetch().then();
    }
  }, []);

  return (
    <Box>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
          backgroundImage:
            'url("/api/app-resources/pages/content/background_blur.png")',
          backgroundRepeat: "no-repeat",
          backdropFilter: "blur(3px)",
        }}
      />
      <Header
        titleKey="pages:content:title"
        currentId="content"
        requireNet={false}
      />

      <PanBasicDialog
        titleLabel={doI18n(
          "pages:core-contenthandler_bcv:export_as_tsv",
          i18nRef.current,
        )}
        closeFn={() => handleClose()}
        isOpen={open}
        actionsButtonArray={PanDialogActionsArray({
          actionLabel: doI18n(
            "pages:core-contenthandler_bcv:export_tsv_button",
            i18nRef.current,
          ),
          closeFn: () => handleClose(),
          closeLabel: doI18n(
            "pages:core-contenthandler_bcv:cancel",
            i18nRef.current,
          ),
          closeOnAction: false,
          actionFn: handleExport,
        })}
        dividers={true}
      >
        <Typography
          ref={confirmationRef}
          color={noBooksSelected && "error"}
          variant="body1"
        >
          {noBooksSelected
            ? doI18n(
                "pages:core-contenthandler_bcv:select_books_to_export",
                i18nRef.current,
              ).replace("{document_name}", documentName)
            : doI18n(
                "pages:core-contenthandler_bcv:select_books_to_export",
                i18nRef.current,
              ).replace("{document_name}", documentName)}
        </Typography>
        <FormControl>
          {bookCodes
            .filter((item) => bookNames.includes(item))
            .map((bookName) => (
              <FormControlLabel
                key={bookName}
                control={
                  <Checkbox
                    checked={selectedBooks.includes(bookName)}
                    onChange={() => handleToggle(bookName)}
                  />
                }
                label={doI18n(`scripture:books:${bookName}`, i18nRef.current)}
              />
            ))}
        </FormControl>
      </PanBasicDialog>
    </Box>
  );
}

export default TsvExport;
