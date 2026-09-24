import { useContext, useState, useEffect } from "react";
import { Button, DialogContent, Box, Typography, Stack } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { getJson, postJson } from "pankosmia-lib/http";
import { doI18n } from "pankosmia-lib/i18n";
import { i18nContext, debugContext, Header } from "pankosmia-rcl";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { PanDialog, PanDialogActions } from "pankosmia-rcl";
import { useFilePicker } from "use-file-picker";

export default function TsvImport() {
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);

  const [tsvImportAnchorEl, setTsvImportAnchorEl] = useState(true);
  const tsvImportOpen = Boolean(tsvImportAnchorEl);

  const [repoBooks, setRepoBooks] = useState([]);
  const [repoPath, setRepoPath] = useState([]);
  const [nameProject, setNameProject] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [loading, setLoading] = useState(false);
  const [filePicked, setFilePicked] = useState(null);
  const [localTsvContent, setLocalTsvContent] = useState(null);
  const [isTsvValid, setIsTsvValid] = useState(false);
  const [bookIsDuplicate, setBookIsDuplicate] = useState(false);

  const { openFilePicker: openTsvPicker, filesContent: tsvFiles } =
    useFilePicker({
      accept: [".tsv"],
      readAs: "Text",
    });

  const hash = window.location.hash;
  const query = hash.includes("?") ? hash.split("?") : "";
  const repoPathQuery = new URLSearchParams(query[1]);
  const typePageQuery = new URLSearchParams(query[2]);
  const path = repoPathQuery.get("repoPath");
  const returnType = typePageQuery.get("returnTypePage");

  const LINE2_REGEX = /^(?=(?:[^\t]*\t){6,})(?=.*:).*$/;

  function validateTsv(text) {
    const lines = text
      .replace(/\r\n/g, "\n")
      .split("\n")
      .filter((l) => l !== "");
    const header = lines[0] ?? "";
    const columns = header.split("\t").map((c) => c.trim().toLowerCase());
    setResourceType(columns.includes("note") ? "Notes" : "Questions");

    const line2 = lines[1] ?? "";
    return LINE2_REGEX.test(line2);
  }

  const bookCodeFromFile = filePicked
    ? filePicked.split(".")[0].toUpperCase()
    : null;

  const getProjectSummaries = async () => {
    setRepoPath(path);
    const summariesResponse = await getJson(
      `/api/burrito/metadata/summary/${path}`,
      debugRef.current,
    );
    if (summariesResponse.ok) {
      const data = summariesResponse.json;
      setNameProject(data.name);
      setRepoBooks(data.book_codes);
    } else {
      console.error(
        `${doI18n("pages:core-contenthandler_bcv:error_data", i18nRef.current)}`,
      );
    }
  };

  const handleClose = async () => {
    setFilePicked(null);
    setLocalTsvContent(null);
    setTsvImportAnchorEl(false);
    if (returnType === "dashboard") {
      window.location.href = "/clients/main";
    } else {
      window.location.href = "/clients/content";
    }
  };

  const handleFilePicked = (file) => {
    setLoading(true);
    setLocalTsvContent(file.content);
    setLoading(false);
  };

  const isBookCodeValid =
    bookCodeFromFile !== null &&
    /^(?:[0-9]{3}|[0-9][A-Z]{2})$/.test(bookCodeFromFile);
  const handleCreateLocalBook = async (tsvContent, repoPathArg) => {
    if (!bookCodeFromFile) {
      enqueueSnackbar(
        doI18n(
          "pages:core-contenthandler_bcv:no_tsv_id_found",
          i18nRef.current,
        ),
        { variant: "error" },
      );
      return;
    }

    if (repoBooks.includes(bookCodeFromFile)) {
      return;
    }
    const response = await postJson(
      `/api/burrito/ingredient/raw/${repoPathArg}?ipath=${`${bookCodeFromFile}.tsv`}&update_ingredients`,
      JSON.stringify({ payload: tsvContent }),
      debugRef.current,
    );
    if (response.ok) {
      enqueueSnackbar(
        doI18n("pages:core-contenthandler_bcv:book_created", i18nRef.current),
        { variant: "success" },
      );
      handleClose();
    } else {
      enqueueSnackbar(
        `${doI18n("pages:core-contenthandler_bcv:book_creation_error", i18nRef.current)}: ${response.status}`,
        { variant: "error" },
      );
    }
  };

  useEffect(() => {
    getProjectSummaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tsvFiles.length > 0) {
      const file = tsvFiles[0];
      setFilePicked(file.name);
      handleFilePicked(file);
    }
  }, [tsvFiles]);

  useEffect(() => {
    if (repoBooks.length > 0 && bookCodeFromFile) {
      setBookIsDuplicate(repoBooks.includes(bookCodeFromFile));
    }
  }, [repoBooks, bookCodeFromFile]);

  useEffect(() => {
    if (localTsvContent !== null) {
      setIsTsvValid(validateTsv(localTsvContent));
    } else {
      setIsTsvValid(false);
    }
  }, [localTsvContent]);

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
        titleKey="pages:core-contenthandler_bcv:title"
        currentId="core-contenthandler_bcv"
        requireNet={false}
      />
      <PanDialog
        isOpen={tsvImportOpen}
        closeFn={() => {
          handleClose();
        }}
        titleLabel={`${doI18n("pages:core-contenthandler_bcv:import_content", i18nRef.current)} - ${nameProject}`}
      >
        <DialogContent sx={{ mt: 1 }}>
          <Button
            onClick={() => openTsvPicker()}
            type="button"
            disabled={loading}
            variant="contained"
            color="primary"
            component="span"
            startIcon={<UploadFileIcon />}
          >
            {loading
              ? "Reading File..."
              : filePicked
                ? filePicked
                : doI18n(
                    "pages:core-contenthandler_bcv:import_click",
                    i18nRef.current,
                  )}
          </Button>

          {localTsvContent !== null &&
            (!isBookCodeValid || !isTsvValid || bookIsDuplicate) && (
              <Typography sx={{ color: "red", paddingTop: "8px" }}>
                {!isBookCodeValid
                  ? doI18n(
                      "pages:core-contenthandler_bcv:bad_book_code_filename",
                      i18nRef.current,
                    )
                  : !isTsvValid
                    ? doI18n(
                        "pages:core-contenthandler_bcv:tsv_invalid",
                        i18nRef.current,
                      )
                    : doI18n(
                        "pages:core-contenthandler_bcv:book_already_exists",
                        i18nRef.current,
                      )}
              </Typography>
            )}
          {localTsvContent !== null &&
            isBookCodeValid &&
            isTsvValid &&
            !bookIsDuplicate && (
              <Stack spacing={2} sx={{ mt: 0.5 }}>
                <Typography variant="body1">
                  {`Book Code: ${bookCodeFromFile}(${resourceType})`}
                </Typography>
              </Stack>
            )}
        </DialogContent>
        <PanDialogActions
          closeFn={() => {
            handleClose();
          }}
          closeLabel={doI18n(
            "pages:core-contenthandler_bcv:cancel",
            i18nRef.current,
          )}
          actionFn={() => {
            handleCreateLocalBook(localTsvContent, repoPath);
            setTsvImportAnchorEl(null);
          }}
          closeOnAction={false}
          actionLabel={doI18n(
            "pages:core-contenthandler_bcv:create",
            i18nRef.current,
          )}
          isDisabled={
            localTsvContent
              ? !isBookCodeValid || bookIsDuplicate || !isTsvValid
              : true
          }
        />
      </PanDialog>
    </Box>
  );
}
