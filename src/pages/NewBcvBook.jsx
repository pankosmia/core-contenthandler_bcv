import { useState, useContext, useEffect } from "react";
import { Box, DialogContent, DialogContentText, Grid2 } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { postJson, doI18n, getJson } from "pithekos-lib";
import { i18nContext, debugContext, Header } from "pankosmia-rcl";
import {
  PanDialog,
  PanDialogActions,
  PanVersificationPicker,
  PanBookPicker,
} from "pankosmia-rcl";
import ErrorDialog from "./NewBcvContent/ErrorDialog";

export default function NewBcvBook() {
  const [bookCode, setBookCode] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAbbr, setBookAbbr] = useState("");
  const [open, setOpen] = useState(true);
  const [repoPath, setRepoPath] = useState([]);
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);
  const [bookCodes, setBookCodes] = useState([]);
  const [bookName, setBookName] = useState([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [versification, setVersification] = useState("eng");
  const [fileVrs, setFileVrs] = useState(false);
  const [nameProject, setNameProject] = useState("");
  const hash = window.location.hash;
  const query = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(query);
  const path = params.get("repoPath");

  const getProjectSummaries = async () => {
    setRepoPath(path);
    const summariesResponse = await getJson(
      `/burrito/metadata/summary/${path}`,
      debugContext.current,
    );
    if (summariesResponse.ok) {
      const data = summariesResponse.json;
      const bookCode = data.book_codes;
      setNameProject(data.name);
      setBookName(bookCode);
    } else {
      console.error(
        `${doI18n("pages:core-contenthandler_bcv:error_data", i18nRef.current)}`,
      );
    }
  };

  const getProjectFiles = async () => {
    const filesResponse = await getJson(
      `/burrito/paths/${path}`,
      debugContext.current,
    );
    if (filesResponse.ok) {
      const data = await filesResponse.json;
      if (data.includes("vrs.json")) {
        setFileVrs(true);
      }
    } else {
      console.error(
        `${doI18n("pages:core-contenthandler_bcv:error_data", i18nRef.current)}`,
      );
    }
  };

  useEffect(() => {
    getProjectSummaries();
    getProjectFiles();
  }, []);

  useEffect(() => {
    const doFetch = async () => {
      const versificationResponse = await getJson(
        "/content-utils/versification/eng",
        debugRef.current,
      );
      if (versificationResponse.ok) {
        const newBookCodes = Object.keys(versificationResponse.json.maxVerses);
        setBookCodes(newBookCodes);
      }
      setBookCode("");
      setBookTitle("");
      setBookAbbr("");
      setVersification("eng");
    };
    if (open) {
      doFetch().then();
    }
  }, [open]);

  const handleClose = async () => {
    setOpen(false);
    setTimeout(() => {
      window.location.href = "/clients/content";
    });
  };

  const handleCreate = async () => {
    const payload = {
      book_code: bookCode,
      book_title: bookTitle,
      book_abbr: bookAbbr,
      ...(fileVrs === false ? { vrs_name: versification } : {}),
    };
    const response = await postJson(
      `/git/new-bcv-resource-book/${repoPath}`,
      JSON.stringify(payload),
      debugRef.current,
    );
    if (response.ok) {
      enqueueSnackbar(
        doI18n("pages:core-contenthandler_bcv:book_created", i18nRef.current),
        {
          variant: "success",
        },
      );
      handleClose();
    } else {
      setErrorMessage(
        `${doI18n("pages:core-contenthandler_bcv:book_creation_error", i18nRef.current)}: ${
          response.status
        }`,
      );
      setErrorDialogOpen(true);
    }
  };

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
            'url("/app-resources/pages/content/background_blur.png")',
          backgroundRepeat: "no-repeat",
          backdropFilter: "blur(3px)",
        }}
      />
      <Header
        titleKey="pages:content:title"
        currentId="content"
        requireNet={false}
      />
      <PanDialog
        titleLabel={`${doI18n("pages:core-contenthandler_bcv:new_book", i18nRef.current)} - ${nameProject}`}
        isOpen={open}
        closeFn={() => handleClose()}
      >
        <DialogContentText variant="subtitle2" sx={{ ml: 1, p: 1 }}>
          {doI18n(
            `pages:core-contenthandler_bcv:required_field`,
            i18nRef.current,
          )}
        </DialogContentText>
        <DialogContent>
          <Grid2
            container
            spacing={2}
            justifyItems="flex-end"
            alignItems="stretch"
          >
            {fileVrs === false ? (
              <PanVersificationPicker
                versification={versification}
                setVersification={setVersification}
                isOpen={open}
              />
            ) : null}

            <PanBookPicker
              bookCode={bookCode}
              setBookCode={setBookCode}
              bookAbbr={bookAbbr}
              setBookAbbr={setBookAbbr}
              bookCodes={bookCodes}
              bookTitle={bookTitle}
              setBookTitle={setBookTitle}
              bookProject={bookName}
              addVerses={false}
            />
          </Grid2>
        </DialogContent>
        <PanDialogActions
          closeFn={() => handleClose()}
          closeLabel={doI18n(
            "pages:core-contenthandler_bcv:close",
            i18nRef.current,
          )}
          actionFn={handleCreate}
          closeOnAction={false}
          actionLabel={doI18n(
            "pages:core-contenthandler_bcv:create",
            i18nRef.current,
          )}
          isDisabled={
            !(
              bookCode.trim().length === 3 &&
              bookTitle.trim().length > 0 &&
              bookAbbr.trim().length > 0
            )
          }
        />
      </PanDialog>
      {/* Error Dialog */}
      <ErrorDialog
        setErrorDialogOpen={setErrorDialogOpen}
        handleClose={handleClose}
        errorDialogOpen={errorDialogOpen}
        errorMessage={errorMessage}
      />
    </Box>
  );
}
